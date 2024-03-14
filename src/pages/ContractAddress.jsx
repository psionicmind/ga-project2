import React, { useEffect, useState, useRef } from "react";
import Address from "./Address";
import styles from "./Address.module.css";
import {exchangesArray, contractAddressList, tokenNames} from "./exchangesAddress.js";
import LabelCom from "../components/LabelCom.jsx";
import InputCom from "../components/InputCom.jsx";
import ButtonCom from "../components/ButtonCom.jsx";

const ContractAddress = () => {
  const [users, setUsers] = useState([]);
  const [isFirstTimeLoading, setIsFirstTimeLoading] = useState(true)
  const addressRef = useRef();
  const tagRef = useRef();


  const getUserData = () => {
    console.log("getUserData @ ContractAddress.jsx");
    getLocalData()   
    getServerUpdate(); // airtable data

  };

  const getLocalData = () => {
    console.log("getting local data")
    const temp=[...contractAddressList]
    setUsers(temp);
  }

  const getServerUpdate = async (signal) => {
    console.log("getting server data from airtable")
    try {
      const url =`https://api.airtable.com/v0/appau3qeDmEuoOXAq/contractAddress?view=Grid%20view`

      const res = await fetch(url, {
        signal, 
        headers:{"Authorization": `Bearer ${import.meta.env.VITE_AirtableApiToken}`}
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data.records.length)
        console.log(data.records)

        let name=""
        let address=""
        console.log("ready")
        console.log(contractAddressList)
        console.log("ready2")

        for (const record in data.records){
          name = data.records[record].fields.name
          address=data.records[record].fields.address
          console.log(name)
          console.log(address)
          contractAddressList.push({name: name, address: address})
        }
        console.log("see lah")
        console.log(contractAddressList)
        const temp=[...contractAddressList]
        setUsers(temp);        

      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.log(error.message);
      }
    }
  }

  const setDataToAirTable = () => {
    console.log("setDataToAirTable")

    contractAddressList.push({name: tagRef.current.value, address: addressRef.current.value})
    console.log("contractAddressList=" + contractAddressList)

    console.log("creating new array in exchangesArray")
    exchangesArray.push([])



    // tokenNames.push(tagRef.current.value)
    console.log(Object.keys(tokenNames).length)
    tokenNames[tagRef.current.value] = Object.keys(tokenNames).length // increment value
    // next will be set data to airtable for persistence storage

    return true;

  }

  
  const addAddress = () => {
    const tag = tagRef.current.value;
    const address = addressRef.current.value;
  
    console.log(tag)
    console.log(address)
    console.log(`tagRef.current.value=${tagRef.current.value}`)
    console.log(`addressRef.current.value=${addressRef.current.value}`)

    if (address != "") {    
      if (setDataToAirTable()){
        getUserData();
        tagRef.current.value = "";
        addressRef.current.value = "";
      } else {
        console.log("an error has occurred");
      }
    } else {
      console.log("wrong entry, check again");
    }
  };

  useEffect(() => {
    console.log("useEffect")
    const controller = new AbortController();
    // console.log("contractAddressList="+ JSON.stringify(contractAddressList))
    if (isFirstTimeLoading === false)
      setUsers(contractAddressList);
    else{
      getUserData()
      setIsFirstTimeLoading(false)
    }

    return () => {
      controller.abort();
    };
  }, []);
  // }, [users]);

  return (
    <div className="container">
      <h1>Contract Address</h1>

      <div className="row">
        <InputCom
          reference={tagRef}
          placeholder="Enter NickName"
        ></InputCom>
      </div>
      <div className="row">      
        <InputCom
          reference={addressRef}
          placeholder="Enter Address"
        ></InputCom>
      </div>
      <div className="row">          
        <ButtonCom handleBtnClick={addAddress}>
          Add Contract Address
        </ButtonCom>
      <div>
        {/* {Isloading && spinnerComponent} */}
      </div>
      </div>
      <br/>
      <br/>

      {users.map((item, idx) => {
        return (
          <Address
            key={idx}
            id={item.id}
            name={item.name}
            address={item.address}
            getUserData={getUserData}
          />
        );
      })}

      <br />
      <br />
    </div>
  );
};

export default ContractAddress;
