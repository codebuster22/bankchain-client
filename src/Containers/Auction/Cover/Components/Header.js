import React from 'react';
import Title from "./Title";

const Header = ({name}) => (
    <div className={"header"}>
        <Title name={name}/>
    </div>
);

export default Header;