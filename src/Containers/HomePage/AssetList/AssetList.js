import React, {Component} from "react";
import Table from "react-bootstrap/Table";

//Accepts array of NPA Structure
class AssetList extends Component {

    constructor(props) {
        super(props);
        this.state={
            isQuerying: false,
            queryAuctionId:'',
            queryOwner:'',
            queryCity:'',
            queryDate:'',
            queryReservePrice:'',
            queryEMD:'',
            queryBidMultiplier:'',
            queryEventType:'',
        }
    }

    filterData = (npa) => {
        let result = npa;
        if (this.state.queryAuctionId !== '') {
            result = result.filter(each => {
                return each._auctionID.toString().includes(this.state.queryAuctionId);
            })
        }
        if (this.state.queryOwner !== '') {
            result = result.filter(each => {
                return each._bankName.includes(this.state.queryOwner);
            })
        }
        if (this.state.queryCity !== '') {
            result = result.filter(each => {
                return each._city.includes(this.state.queryCity);
            })
        }
        if (this.state.queryDate !== '') {
            const _date = new Date(this.state.queryDate);
            const _timestamp = this.toTimestamp(_date.getFullYear(), _date.getMonth(), _date.getDate());
            result = result.filter(each => {
                return each._timeStamp.toString() === _timestamp.toString();
            })
        }
        if (this.state.queryReservePrice !== '') {
            result = result.filter(each => {
                return each._reservePrice === this.state.queryReservePrice;
            })
        }
        if (this.state.queryEMD !== '') {
            result = result.filter(each => {
                return each._EMD === this.state.queryEMD;
            })
        }
        if (this.state.queryBidMultiplier !== '') {
            result = result.filter(each => {
                return each._bidMultipliers === this.state.queryBidMultiplier;
            })
        }
        if (this.state.queryEventType !== ''){
            result = result.filter(each => {
                return each._eventType === (this.state.queryEventType);
            })
        }
        console.log(result);
        return result;
    }

    showRows=(_npa)=> {
        return _npa.map(({_auctionID, _bankName, _assetOnAuction, _city, _timeStamp, _reservePrice, _EMD, _bidMultipliers, _eventType}) => {
            const _date = new Date(_timeStamp * 1000);
            return (<tr key={_auctionID}>
                <td>{_auctionID}</td>
                <td>{_bankName}</td>
                <td>{_assetOnAuction}</td>
                <td>{_city}</td>
                <td>{_date.toDateString()}</td>
                <td>{_reservePrice}</td>
                <td>{_EMD}</td>
                <td>{_bidMultipliers}</td>
                <td>{_eventType}</td>
            </tr>)
        });
    }

    toggleFilter = () =>{
        this.setState({isQuerying: !this.state.isQuerying});
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

    toTimestamp = (year,month,day) => {
        const datum = new Date(Date.UTC(year,month,day));
        return datum.getTime()/1000;
    }

    render() {
        const _npa=this.filterData(this.props.npa);
        return (
            <div className={'w-80 bg-white shadow-5 br-m mt-3'}>
                {this.state.isQuerying?<div>
                    Auction Id:-<input onChange={this.handleInputChange} name={"queryAuctionId"}/>
                    Owner Entity:-<input onChange={this.handleInputChange} name={"queryOwner"}/>
                    City:-<input onChange={this.handleInputChange} name={"queryCity"}/>
                    Date:-<input type={"date"} onChange={this.handleInputChange} name={"queryDate"}/>
                    Reserve Price:-<input onChange={this.handleInputChange} name={"queryReservePrice"}/>
                    EMD:-<input onChange={this.handleInputChange} name={"queryEMD"}/>
                    Bid Multiplier:-<input onChange={this.handleInputChange} name={"queryBidMultiplier"}/>
                    Event Type:-<input onChange={this.handleInputChange} name={"queryEventType"}/>
                    <button onClick={this.toggleFilter}>Toggle Filter</button>
                </div>:<button onClick={this.toggleFilter}>Toggle Filter</button>}
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Auction ID</th>
                        <th>Owner Entity</th>
                        <th>Asset On Auction</th>
                        <th>City</th>
                        <th>Date</th>
                        <th>Reserve Price</th>
                        <th>EMD</th>
                        <th>Bid Multiplier</th>
                        <th>Event Type</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.showRows(_npa)}
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default AssetList;