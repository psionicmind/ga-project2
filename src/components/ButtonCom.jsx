import React from 'react';

const ButtonCom = (props) => {
    const handleButtonClick = (event) => {
        props.handleBtnClick(event)
    }

    return (
        <button onClick={handleButtonClick} id={props.id} className="col-md-3">{props.children}</button>
    );
};

export default ButtonCom;