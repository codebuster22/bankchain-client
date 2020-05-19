import React from "react";
import Particles from "react-particles-js";
import Cover from "./Cover/Cover";
import obj from './obj';
import {AuctionResult} from "./AuctionResult/AuctionResult";

export const Auction = ({filter,onSearchChange, routeChange,auctions, startAuction, viewAuction, sellAsset}) =>(
    <div className="App ">
        <Particles params={obj} className={"particlesBg "}/>
        <Cover handleChange={onSearchChange} name={"Auction"} routeChange={routeChange}/>
        <AuctionResult npa={filter} auctions={auctions} startAuction={startAuction} viewAuction={viewAuction} sellAsset={sellAsset}/>
    </div>
)