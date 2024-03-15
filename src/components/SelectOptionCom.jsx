import React, { useEffect, useState,  } from "react";
import {contractAddressList, exchangesArray, tokenNames} from "../pages/exchangesAddress.js";
// import {userDefinedAddressList} from "../pages/ContractAddress.jsx"

const SelectOptionCom = (props) => {
    const [options, setOptions] = useState([]);
    const [selectOptionUserDefinedAddressList, setSelectOptionUserDefinedAddressList] = useState([]);    
    let select_userDefinedAddressList = []

    const handleOnChange = (event) => {
        // console.log("selected option="+ props.reference)
        // console.log("event.target.value=" + event.target.value)
        props.onSelect(event)
    }

    const loadOptions = ()=> {
        // console.log("entered loadOptions")
        // console.log(`props.optionPattern=${props.optionPattern}`)
        if (props.optionPattern ==="contractAddress"){
            console.log("contract address loading.....")
            const result= getServerUpdate()
            console.log("result=")
            console.log(result)


            console.log("before setOption")
            console.log(select_userDefinedAddressList)
            // setOptions(select_userDefinedAddressList)        
        }
    }

    const getServerUpdate = async (signal) => {
        console.log("gett server data from airtable:SelectOption")
        try {
          const url =`https://api.airtable.com/v0/appau3qeDmEuoOXAq/contractAddress?view=Grid%20view`
    
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

                temp.push({id:`${id}`,name: `${nameOfRecord}`, address: `${addressOfRecord}`})
                tempList=[...tempList, {id:`${id}`,name: `${nameOfRecord}`, address: `${addressOfRecord}`}]

                console.log("adding user defined contract address to array")
                if (tokenNames[nameOfRecord] ===undefined){
                    exchangesArray.push([])

                    console.log(Object.keys(tokenNames).length)
                    tokenNames[nameOfRecord] = Object.keys(tokenNames).length // increment value                    
                }
            }

            console.log(tempList)       
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