import React from "react";
import Particles from "react-particles-js";
import obj from "./obj";
import Cover from "./Cover/Cover";
import {Portal} from "./Portal/Portal";

export const AuctionStatus = ({auctionAddress, onSearchChange, routeChange, auctionInterface,web3}) =>{
    return (
            <div className="App ">
                <Particles params={obj} className={"particlesBg "}/>
                <Cover handleChange={onSearchChange} name={"Auction "+auctionAddress}  routeChange={routeChange}/>
                <Portal auctionInterface={auctionInterface} auctionAddress={auctionAddress} web3={web3}/>
            </div>
    )
};