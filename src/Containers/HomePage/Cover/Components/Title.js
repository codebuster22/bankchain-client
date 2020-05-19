import React from 'react';

const Title = ({name}) => (
    <header className="tc ph4">
        <a className="link dim black b f1 f-headline-ns tc db mb1 mb4-ns no-underline" href={"#"} title={"Home"}>
            {name}
        </a>
    </header>
);

export default Title;