import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {connect} from 'react-redux';
import AssetInterfaceContract from "./contracts/AssetInterface.json";
import AuctionContract from "./contracts/Auction.json";
import AuctionManagerContract from './contracts/AuctionManager.json';
import {changeSearchField} from "./actions";
import getWeb3 from "./getWeb3";
import {HomePage} from "./Containers/HomePage/HomePage";
import {Auction} from "./Containers/Auction/Auction";
import {AuctionStatus} from "./Containers/AuctionStatus/AuctionStatus";
import {BiSell} from "./Containers/BiSell/BiSell";

const mapStateToProps = (state) => ({
    searchField: state.searchField,
})

const mapDispatchToProps = (dispatch) => ({
    onSearchChange: (event) => dispatch(changeSearchField(event.target.value)),
})

class App extends Component {

    constructor(props) {
        super(props);
        this.state= {
            isLoaded: false,
            npa: [],
            contracts: [],
            route: "homepage",
            auctionManager: '',
            openAuction: '',
            openSale: '',
            auctions: [],
            AuctionInstance: {}
        }
    }

    componentDidMount = async () => {
        try {
            this.web3 = await getWeb3();
            this.web3.eth.handleRevert = true;

            this.accounts = await this.web3.eth.getAccounts();

            this.networkId = await this.web3.eth.net.getId();

            this.assetInterface = new this.web3.eth.Contract(
                AssetInterfaceContract.abi,
                AssetInterfaceContract.networks[this.networkId] && AssetInterfaceContract.networks[this.networkId].address,
            );

            this.auction = new this.web3.eth.Contract(
                AuctionContract.abi,
                AuctionContract.networks[this.networkId] && AuctionContract.networks[this.networkId].address,
            );

            this.auctionManager = new this.web3.eth.Contract(
                AuctionManagerContract.abi,
                AuctionManagerContract.networks[this.networkId] && AuctionManagerContract.networks[this.networkId].address,
            );
            this.auctionManager.options.address = await this.fetchAuctionManagerAddress();

            this.fetchAddress().then(res=>{this.feed();this.auctionStatus();});
            this.setState({isLoaded: true, AuctionInstance:this.auction});
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load`,
            );
            console.error(error);
        }
    };

    fetchAuctionManagerAddress = async() =>{
        try{
            const response = await fetch("http://localhost:3001/getAuctionManager/");
            return await response.json();
        }catch (e) {
            console.log("Couldn't fetch data from Server");
        }
    }

    feed =  () => {
        this.state.contracts.forEach(async element=>{
            const array = this.state.npa;
            await this.feedDataToState(element.address).then(res=>{
                if(res.flag){
                    array.push(res.Data);
                }else{
                    alert(res.Data)
                }
            })
            this.setState({npa:array});
        })
    }

    feedDataToState = async (_address) => {
        try {
            const response = await fetch("http://localhost:3001/fetchData", {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    address: _address
                })
            });
            return await response.json()
        }catch (e) {
            console.log("Couldn't fetch data from server");
        }
    }

    fetchAddress = async () =>{
        try {
            const response = await fetch('http://localhost:3001/getAddress');
            const data = await response.json();
            this.setState({
                contracts: data
            });
        }catch (e) {
            console.log("Couldn't fetch data from Server")
        }
    }

    viewAuction = (address) =>{
        this.setState({openAuction: address});
        this.changeRoute("viewAuction");
        console.log(this.auction,this.state);
    }

    startAuction = async (address) => {
        try {
            const auctionManagerAddress = this.auctionManager.options.address;
            console.log(auctionManagerAddress, this.accounts);
            const auctionInstance = await this.auction.deploy({
                data: AuctionContract.bytecode,
                arguments: [address, auctionManagerAddress]
            }).send({
                from: this.accounts[0],
                gas: 2000000,
                gasPrice: '20000000000'
            }, (err, result) => console.log(err, result))
            this.viewAuction(auctionInstance.options.address);
            this.setState({AuctionInstance: auctionInstance});
            console.log(this.state);
        }catch (e) {
            console.log("An error occurred while processing")
        }
    };

    auctionStatus = () =>{
        console.log(this.auctionManager);
        const contract = this.state.contracts;
        console.log(contract,this.state.auctions);
        if(contract.length===0){
            console.log("Empty");
        }else{
            let i =0;
            contract.forEach(async({address})=>{
                try {
                    const data = this.state.auctions;
                    const {auction, status} = await this.auctionManager.methods.getAuctionStatus(address).call();
                    if (data.length === 0) {
                        data.push({address, auction, status});
                    } else {
                        let index = 0;
                        const flag = data.some((each, i) => {
                            index = i;
                            return address === each.address;
                        })
                        console.log(index);
                        if (flag) {
                            data[index].auction = auction;
                            data[index].status = status;
                        } else {
                            data.push({address, auction, status});
                        }
                    }
                    this.setState({auctions: data});
                    i++;
                }catch (e) {
                    console.log("An error occurred while processing",e)
                }
            })
        }
        console.log(this.state.auctions);
    }

    sellAsset = (address) =>{
        this.changeRoute("sell");
        this.setState({openSale:address});
    }

    changeRoute = (_route) => {
        this.setState({route:_route})
    }

    filterNpa = (npa,searchField) =>{
        let filter = npa;
        if(npa.length!==0){
            filter = npa.filter(each=>{
                return Object.values(each).toString().toLowerCase().includes(searchField.toLowerCase());
            })
        }
        return filter;
    }

  render() {
        const filter = this.filterNpa(this.state.npa,this.props.searchField);
    if(this.state.isLoaded){
        switch (this.state.route){
            case "auction":
                return (
                    <Auction sellAsset={this.sellAsset} viewAuction={this.viewAuction} startAuction={this.startAuction} routeChange={this.changeRoute} filter={filter}  auctions={this.state.auctions}/>
                )
            case "homepage":
                return (
                    <HomePage filter={filter} onSearchChange={this.props.onSearchChange} routeChange={this.changeRoute} />
                )
            case "viewAuction":
                return(
                    <AuctionStatus auctionAddress={this.state.openAuction} routeChange={this.changeRoute} auctionInterface={this.state.AuctionInstance} web3={this.web3}/>
                )
            case "sell":
                return(
                    <BiSell assetAddress={this.state.openSale} routeChange={this.changeRoute} assetInterface={this.assetInterface} web3={this.web3}/>
                )
        }
      }else{
          return <div>Loading </div>;
      }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
