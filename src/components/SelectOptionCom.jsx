import React, { useEffect, useState,  } from "react";
import {contractAddressList, exchangesArray, tokenNames} from "../pages/exchangesAddress.js";

const SelectOptionCom = (props) => {
    const [options, setOptions] = useState([]);

    const handleOnChange = (event) => {
        props.onSelect(event)
    }

    const loadOptions = ()=> {
        if (props.optionPattern ==="contractAddress"){
            const result= getServerUpdate()
        }
    }

    const getServerUpdate = async (signal) => {
        try {
          const url =`https://api.airtable.com/v0/appau3qeDmEuoOXAq/contractAddress`
    
          const res = await fetch(url, {
            signal, 
            headers:{"Authorization": `Bearer ${import.meta.env.VITE_AirtableApiToken}`}
          });
    
          if (res.ok) {        
            const data = await res.json();

            let id=""
            let nameOfRecord=""
            let addressOfRecord=""

            let temp=[]
            let tempList=[...contractAddressList]   
            for (const record in data.records){
                id = data.records[record].id
                nameOfRecord = data.records[record].fields.name
                addressOfRecord=data.records[record].fields.address

                temp.push(             {id:`${id}`,name: `${nameOfRecord}`, address: `${addressOfRecord}`})
                tempList=[...tempList, {id:`${id}`,name: `${nameOfRecord}`, address: `${addressOfRecord}`}]

                if (tokenNames[nameOfRecord] ===undefined){
                    exchangesArray.push([])

                    tokenNames[nameOfRecord] = Object.keys(tokenNames).length // increment value                    
                }
            }

            setOptions(tempList)                
    
          }
        } catch (error) {
          if (error.name !== "AbortError") {
            console.log(error.message);
          }
        }
    } // end of getServerUpdate function    


    useEffect(() => {
        const controller = new AbortController();
        loadOptions(props.optionPattern)
    
        return () => {
          controller.abort();
        };
      }, []);

    return (
        <select onChange={handleOnChange} ref={props.reference} id={props.id} className='select'>
        {options.map((item, idx) => {
                return (
                <option
                    key={idx}
                    data-id={item.id}
                    value={item.name}
                    data-name={item.name}
                    data-address={item.address}
                    // getUserData={getUserData}
                >{item.name}</option>
                );
            })}            

        </select>
    );
};

export default SelectOptionCom;