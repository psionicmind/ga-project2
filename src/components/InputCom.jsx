import React from 'react';

const InputCom = (props) => {

    return (
        <input value={props.value} ref={props.reference} placeholder={props.placeholder} type='text' id={props.id} className="col-md-6"></input>
    );
};

export default InputCom;