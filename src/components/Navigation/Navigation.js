import React from 'react';

const Navigation = ({onRouteChange}) => {
    return (
        <nav className="flex justify-end">
            <p 
                className="f3 link dim black underline pa3 pointer" 
                onClick={() => onRouteChange("signin")}>
                    Sign Out
            </p>
        </nav>
    )
}


export default Navigation;