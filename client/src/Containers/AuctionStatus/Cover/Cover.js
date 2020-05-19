import React from "react";
import SearchField from "./Components/SearchField";
import Header from "./Components/Header";

const Cover = ({handleChange,name,routeChange}) =>{

    return (
        <div>
            <Header name={name}/>
            <SearchField  handleChange={handleChange} routeChange={routeChange}/>
        </div>
    )
}

export default Cover;