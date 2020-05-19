import React from 'react';

const NavigationBar = ({routeChange}) => (
    <nav className="pa3 pa4-ns">
        <div className="tc bg-white shadow-5 br-pill">
            <h5 className={"link dim gray f6 f5-ns dib mr3 no-underline pointer"} title={"Home"} onClick={()=>routeChange("auction")}>Auction</h5>
        </div>
    </nav>
);

export default NavigationBar