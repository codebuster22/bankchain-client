import React from 'react';
const Title = ({name}) => (
    <header className="tc ph4">
        <p className="link dim black b f1 tc db mb1 mb4-ns no-underline pointer" title={"Home"}>
            {name}
        </p>
    </header>
);

export default Title;