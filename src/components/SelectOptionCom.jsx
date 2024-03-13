import React, { useEffect, useState,  } from "react";
import {contractAddressList} from "../pages/exchangesAddress.js";

const SelectOptionCom = (props) => {
    const [options, setOptions] = useState([]);

    const handleSelectClick = (event)=>{
        // console.log("select click")
        // loadOptions()
    }
    
    const handleOnChange = (event) => {
        // console.log("selected option="+ props.reference)
        // console.log("event.target.value=" + event.target.value)
        props.onSelect(event)
    }

    const loadOptions = ()=> {
        // console.log("entered loadOptions")
        // console.log(`props.optionPattern=${props.optionPattern}`)
        if (props.optionPattern ==="contractAddress"){
            // console.log("contract address loading.....")
            setOptions(contractAddressList)        
        }
    }

    useEffect(() => {
        const controller = new AbortController();
        loadOptions(props.optionPattern)
    
        return () => {
          controller.abort();
        };
      }, []);

    return (
        <select onClick={handleSelectClick} onChange={handleOnChange} ref={props.reference} id={props.id} className='select'>
        {options.map((item, idx) => {
                return (
                <option
                    key={idx}
                    id={item.id}
                    value={item.name}
                    name={item.name}
                    address={item.address}
                    // getUserData={getUserData}
                >{item.name}</option>
                );
            })}            

        </select>
    );
};

export default SelectOptionCom;