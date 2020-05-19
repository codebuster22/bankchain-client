import React, {Component} from "react";

export class Portal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bidAmount: 0,
            isLoaded: false,
            myBid:0,
            highestBid: 0,
            highestBidder: '',
            isActive: false,
            bidLog:[]
        }
    }

    componentDidMount = async () => {
        try{
            this.loggedInAccount = await window.ethereum.enable();
            this.props.auctionInterface.options.address=this.props.auctionAddress;
            await this.getAssetDetails();
            console.log(this.props.auctionInterface);
            if(!(await this.getStatus())) {
                await this.startBidding();
            }
            await this.getMybid();    //haven't tested this function
            this.listenToStart();
            this.listenToBid()
            this.listenToBidWithdraw()
            this.listenToSetOwner();
            this.listenToOwnerChange();
            this.listenToAuctionCancel();
            this.listenToAuctionEnd();
            this.setState({isLoaded: true},this.getHighestBid);
            console.log(this.owneraddress,this.assetAddress)
        }catch (e) {
            console.log(e);
        }
    }

    // haven't tested yet
    getMybid =async () =>{
        const response = await this.props.auctionInterface.methods.getMyBid().call();
        this.setState({
            myBid:response,
        })
    }

    getStatus = async () =>{
        try {
            return await this.props.auctionInterface.methods.ping().call()
        }catch (e) {
            console.log("An error occurred while processing.")
        }
    }

    sendBid = () => {
        this.props.auctionInterface.methods.bid().send({from: this.loggedInAccount[0], value: this.props.web3.utils.toWei(this.state.bidAmount,"finney")},(err,res)=>console.log(err,res)).then(res=>this.getMybid());  // haven't tested the last .then part
        this.setState({bidAmount:0})
    }

    startBidding = async () =>{
        try {
            const tx = {
                from: this.owneraddress,
                to: this.props.auctionInterface.options.address,
                data: this.props.auctionInterface.methods.startAuction().encodeABI()
            }
            console.log(tx, this.props.auctionInterface);
            this.props.web3.eth.sendTransaction(tx, (err, result) => {
                console.log(err, result);
            }).then(res => console.log(res.logs));
        }catch (e) {
            console.log("An error occurred while processing.")
        }
    }

    getHighestBid = async () =>{
        try {
            const response = await this.props.auctionInterface.methods.getHighestBid().call();
            const data = await Object.values(response);
            this.setState({highestBidder: data[1], highestBid: this.props.web3.utils.fromWei(data[0], "ether")})
        }catch (e) {
            console.log("An error occurred while processing.")
        }
    }

    //  auctionStarted(address _auction, address _asset);
    listenToStart = () =>{
        this.props.auctionInterface.events.auctionStarted().on("data",this.getHighestBid);
    }

    //  HighBidAlert(uint _bid, address _bidder);
    listenToBid = () =>{
        const data=this.state.bidLog;
        this.props.auctionInterface.events.HighBidAlert().on("data",this.getHighestBid).on("data",async (evt)=>{
            await this.getMybid();
            console.log(evt);
            if(data.length){
                // console.log(data.toString().includes([evt.returnValues._bid,evt.returnValues._bidder].toString()))
                let flag = false;
                data.forEach(each=>{
                    if(each.bid===evt.returnValues._bid && each.bidder===evt.returnValues._bidder){
                        flag=true;
                    }
                })
                if(!flag){
                    data.push({bid:evt.returnValues._bid,bidder:evt.returnValues._bidder});
                }
            }else{
                data.push({bid:evt.returnValues._bid,bidder:evt.returnValues._bidder});
            }
            this.setState({bidLog:data})
            console.log(this.state.bidLog);
        });
        // this.props.auctionInterface.events.HighBidAlert().on("data".this.getHighestBid);
    }

    getAssetDetails=async ()=>{
        try {
            this.owneraddress = await this.props.auctionInterface.methods.owner().call();
            this.assetAddress = await this.props.auctionInterface.methods.getAssetOnAuction().call();
        }catch (e) {
            console.log("An error occurred while processing.")
        }
    }

    ownerCancelAuction = async () =>{
        try {
            await this.props.auctionInterface.methods.cancelAuction.send({from: this.owneraddress}, (err, res) => console.log(err, res)).then(res => console.log(res));
        }catch (e) {
            console.log("An error occurred while processing.")
        }
    }

    ownerEndAuction = async () =>{
        try {
            await this.props.auctionInterface.methods.endAuction().send({from: this.owneraddress}, (err, res) => console.log(err, res)).then(res => console.log(res));
        }catch (e) {
                console.log("An error occurred while processing.")
            }
    }

    ownerStopAuction = async () =>{
        try {
            await this.props.auctionInterface.methods.toggleStopAuction().send({from: this.owneraddress}, (err, res) => console.log(err, res)).then(res => {
                console.log(res);
                alert("Transfer " + this.assetAddress + " ownership to Highest Bidder");
            });
        }catch (e) {
            console.log("An error occurred while processing.")
        }
    }

    bidderWithdrawBid = async () =>{
        try {
            await this.props.auctionInterface.methods.withdrawBid().send({from: this.loggedInAccount[0]}, (err, res) => console.log(err, res)).then(res => console.log(res));
        }catch (e) {
            console.log("An error occurred while processing.")
        }
    }

    //  bidWithdrawn(uint _bid, address _bidder);
    listenToBidWithdraw = () => {
        const data=this.state.bidLog;
        this.props.auctionInterface.events.bidWithdrawn().on("data",(evt)=>{
            console.log(evt);
            if(data.length){
                let flag = false;
                data.forEach(each=>{
                    if(each.bid===(-1)*evt.returnValues._bid && each.bidder===evt.returnValues._bidder){
                        flag=true;
                    }
                })
                if(!flag){
                    data.push({bid:(-1)*evt.returnValues._bid,bidder:evt.returnValues._bidder});
                }
            }else{
                data.push({bid:(-1)*evt.returnValues._bid,bidder:evt.returnValues._bidder});
            }
            this.setState({bidLog:data})
            console.log(this.state.bidLog);
        });
    }

    //  setOwner(address newOwner);
    listenToSetOwner = () =>{
        this.props.auctionInterface.events.setOwner().on("data",(evt)=>{
            alert("!!Auction Result!!\nHighest Bidder= "+evt.returnValues.newOwner+"\nOther Participants have been refunded their ethers. The owner need to transfer ownership of "+this.assetAddress+" to the Highest Bidder before they can receive the resulting amount. Thank You for Participating.\nNever run out of Gas!");
        });
    }

    //  newOwner(address _new);
    listenToOwnerChange = () =>{
        this.props.auctionInterface.events.newOwner().on("data",(evt)=>{
            alert("!!Auction Result!!\nHighest Bidder= "+evt.returnValues._new+"\nOwnership Transferred "+this.assetAddress+" to the Highest Bidder and owner have received the resulting amount. Thank You for Participating. Never run out of Gas!")
        });
    }

    //  auctionCanceled(address _auction, address _asset);
    listenToAuctionCancel = () =>{
        this.props.auctionInterface.events.auctionCanceled().on("data",(evt)=>{
            alert("Auction have been cancelled by the owner. The funds have been refunded back to respective accounts. Sorry for the Gas!");
            alert("!!Warning!!\n Any ether sent from now on might become entropy. So be aware! \nNever run out of Gas!");
        });
    }

    //  auctionEnded(address _auction, address _asset);
    listenToAuctionEnd = () =>{
        this.props.auctionInterface.events.auctionEnded().on("data",(evt)=>{
            alert("Auction have Ended by the owner. The funds have been refunded back to respective accounts. Sorry for the Gas!");
            alert("!!Warning!!\n Any ether sent from now on might become entropy. So be aware! \nNever run out of Gas!");
        });
    }

    handleInputChange = (evt) =>{
        const target=evt.target;
        const value = target.type === "checkbox"? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        })
        console.log(this.state.bidAmount);
    }

    render() {
        if (this.state.isLoaded) {
            console.log(this.loggedInAccount[0]===this.owneraddress);
            if (this.loggedInAccount[0].toLowerCase() === this.owneraddress.toLowerCase()) {
                return (
                    <div className={'w-90 bg-white shadow-5 br-m mt-3'}>
                        Portal for interacting with auction
                        <h1>Highest Bid :- {this.state.highestBid}</h1>
                        <h1>HighestBidder :- {this.state.highestBidder}</h1>
                        <button onClick={this.ownerCancelAuction}>Cancel Auction</button>
                        <button onClick={this.ownerStopAuction}>Stop Auction</button>
                        <button onClick={this.ownerEndAuction}>End Auction</button>
                        <h1>Logs</h1>
                        {this.state.bidLog.map(each => <p>Bid: {each.bid} wei Bidder: {each.bidder}</p>)}
                    </div>
                )
            } else {
                return (
                    <div className={'w-90 bg-white shadow-5 br-m mt-3'}>
                        Portal for interacting with auction
                        <h1>Highest Bid :- {this.state.highestBid}</h1>
                        <h1>HighestBidder :- {this.state.highestBidder}</h1>
                        <h1>My Bid :- {this.state.myBid}</h1>  {/*  haven't tested this functionality yet  */}
                        <h4>Enter your Bid Amount. Note:- Unit is finney. 1 ether = 1,000 finney</h4>
                        <input name={'bidAmount'} onChange={this.handleInputChange}/>
                        <button onClick={this.sendBid}>Bid</button>
                        <button onClick={this.bidderWithdrawBid}>Withdraw Bid</button>
                        <h1>Logs</h1>
                        {this.state.bidLog.map(each => <p>Bid: {each.bid} wei Bidder: {each.bidder}</p>)}
                    </div>
                )
            }
        }
        return (
            <div>
                Loading
            </div>
        )
    }
}