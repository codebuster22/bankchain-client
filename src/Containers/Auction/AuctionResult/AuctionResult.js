import React from "react";
import Table from "react-bootstrap/Table";

//Accepts array of NPA Structure
export const AuctionResult = ({npa,startAuction,viewAuction,auctions, routeChange, sellAsset}) => {
    const rows = npa.map(({_auctionID,_bankName,_assetOnAuction,_city,_timeStamp,_reservePrice,_EMD,_bidMultipliers,_eventType,address})=>{
        let flag = false;
        let auctionAddress = '';
        auctions.some((each,i)=>{
            flag = each.status;
            auctionAddress = each.auction;
            return address === each.address;
        })
        console.log(flag,auctionAddress);
        const _date= new Date(_timeStamp*1000);
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
            <td>{address}</td>
            {(flag)?
                (<td>
                <button onClick={()=>viewAuction(auctionAddress)}>View Auction</button>
                </td>):
                ( <td>
                <button onClick={()=>startAuction(address)}>Start Auction</button>
                </td>)
            }
            <td><button onClick={()=>sellAsset(address)}>Sell Asset</button></td>
        </tr>);
    });
    return (
        <div className={'w-90 bg-white shadow-5 br-m mt-3'}>
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
                    <th>Asset Contract Address</th>
                    <th>Auction Status</th>
                    <th>Sell</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>
        </div>
    )
}