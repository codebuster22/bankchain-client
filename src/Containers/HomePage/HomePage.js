import React from "react";
import Particles from "react-particles-js";
import Cover from "./Cover/Cover";
import AssetList from "./AssetList/AssetList";
import obj from './obj';

export const HomePage = ({filter,onSearchChange,routeChange}) =>(
    <div className="App ">
        <Particles params={obj} className={"particlesBg "}/>
        <Cover handleChange={onSearchChange} name={"Asset List"} routeChange={routeChange}/>
        <AssetList npa={filter}/>
    </div>
)
