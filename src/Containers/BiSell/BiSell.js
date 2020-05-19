import React from "react";
import Particles from "react-particles-js";
import Cover from "./Cover/Cover";
import obj from './obj';
import Portal from "./Portal/Portal";

export const BiSell = ({onSearchChange,routeChange,assetAddress, assetInterface, web3}) =>(
    <div className="App ">
        <Particles params={obj} className={"particlesBg "}/>
        <Cover handleChange={onSearchChange} name={"Sale of "+assetAddress} routeChange={routeChange}/>
        <Portal assetInterface={assetInterface} assetAddress={assetAddress} web3={web3}/>
    </div>
)