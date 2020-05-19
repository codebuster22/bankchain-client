import React, {Component} from "react";

export default class Portal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            input: '',
            currentOwner:'',
            newOwner:'',
            contractBalance: 0,
            assetDetails: {},
        }
    }

    componentDidMount = async () => {
        try{
            this.props.assetInterface.options.address=this.props.assetAddress;
            console.log(this.props.assetInterface);
            await this.getAllInitialData();
            this.listenToEvents();
            this.setState({
                isLoaded: true,
            })
        }catch (e) {
            alert("Failed to Load");
        }
    }

    getCurrentOwner = async () =>{ //Working   ----   sets currentOwner in State to current Asset Owner
        try {
            const response = await this.props.assetInterface.methods.owner().call();
            this.setState({
                currentOwner: response,
            });
            console.log("inside getCurrentOwner", this.state);
        }catch (e) {
            console.log("An error occurred while processing.")
        }
    }

    getContractBalance = async () =>{  //Working     ----- set contract balance in state from asset contract
        try {
            const response = await this.props.assetInterface.methods.getBalance().call();
            this.setState({
                contractBalance: response,
            });
            console.log("inside getContractBalance", this.state);
        }catch (e) {
            console.log("An error occurred while processing.")
        }
    }

    getNpaDetails = async () =>{  //Working   ----   sets contract details in state from asset contract
        try {
            const {_NPA_ID, _assetOnAuction, _bankName, _city} = await this.props.assetInterface.methods.getNPADetails().call();
            this.setState({
                assetDetails: {
                    _NPA_ID, _assetOnAuction, _bankName, _city
                }
            });
        }catch (e) {
            console.log("An error occurred while processing.",e)
        }

    }

    getNewOwner = async () =>{ //Working   ----   sets newOwner in State to current Asset Owner
        try {
            const response = await this.props.assetInterface.methods.getNewOwner().call();
            this.setState({
                newOwner: response,
            });
            console.log("inside getNewOwner", this.state);
        }catch (e) {
            console.log("An error occurred while processing.")
        }
    }

    setNewOwner = async (address) =>{ //Working    -----  set newOwner in Asset Contract
        try {
            await this.props.assetInterface.methods.setNewOwner(address).send({from: this.state.currentOwner}).then(res => {
                this.getNewOwner();
            });
            this.setState({input: ''})
            console.log("inside setNewOwner", this.state);
        }catch (e) {
            console.log("An error occurred while processing.")
        }
    }

    transferOwnership = async () =>{  //Working    -----    transfer asset contract ownership from previous owner to new owner
        try {
            await this.props.assetInterface.methods.transferOwnership().send({from: this.state.currentOwner}).then(res => {
                this.getCurrentOwner();
                this.getNewOwner();
                this.getContractBalance();
                console.log(res);
            })
            console.log("inside transferOwnership", this.state);
        }catch (e) {
            console.log("An error occurred while processing.")
        }
    }

    getAllInitialData = async () =>{
        try {
            await this.getCurrentOwner();
            await this.getNewOwner();
            await this.getContractBalance();
            await this.getNpaDetails();
        }catch (e) {
            console.log("An error occurred while processing.")
        }
    }

    listenToEvents = () => {
        this.props.assetInterface.events.newOwnerAssigned().on("data",(evt)=>{
            alert("New ownership assigned to "+evt.returnValues._newOwner+". \nPlease Transfer the exact amount!");
        });
        this.props.assetInterface.events.OwnershipTransferred().on("data",(evt)=>{
            alert("The Ownership have been successfully transferred from "+evt.returnValues.previousOwner+" to "+evt.returnValues.newOwner+".\n Never run out of Gas!")
        })
    }

    handleInputChange = (evt) =>{
        const target = evt.target;
        const value = target.type==='checkbox'?target.checked:target.value;
        const name = target.name;
        this.setState({
            [name]:value,
        })
        console.log("inside handleInputChange",this.state);
    }

    render() {
        if(this.state.isLoaded){
            return (
                <div className={'w-60 bg-white shadow-5 br-m mt-3'}>
                <h1>Welcome to Asset Sale</h1>
                <p>NPA ID :- {this.state.assetDetails._NPA_ID}</p>
                <p>Asset Details :- {this.state.assetDetails._assetOnAuction}</p>
                <p>Owner Entity :- {this.state.assetDetails._bankName}</p>
                <p>City :- {this.state.assetDetails._city}</p>
                    <p>Current Owner Address :-  {this.state.currentOwner}</p>
                    <p>New Owner Address :-  {this.state.newOwner}</p>
                    <div>
                        <input onChange={this.handleInputChange} name={"input"} value={this.state.input}/>
                        <button onClick={()=>this.setNewOwner(this.state.input)}>Test Button for setNewOwner()</button>
                    </div>
                    <button onClick={this.transferOwnership}>Test Button for transferOwnership()</button>
                 </div>
            )
        }
        else {
            return (
                <div className={'w-60 bg-white shadow-5 br-m mt-3'}>
                    Couldn't Load
                </div>
            )
        }
    }

}