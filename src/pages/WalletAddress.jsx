import React, { useEffect, useState, useRef } from "react";
import Address from "./Address";
import styles from "./Address.module.css";
import {exchangesArray, tokenNames, contractAddressList} from "./exchangesAddress.js";
import LabelCom from "../components/LabelCom.jsx";
import InputCom from "../components/InputCom.jsx";
import ButtonCom from "../components/ButtonCom.jsx";
import SelectOptionCom from "../components/SelectOptionCom.jsx";

const WalletAddress = () => {
  const [users, setUsers] = useState([]);
  const [tokenName, setTokenName] = useState("pepe");
  const addressRef = useRef();
  const tagRef = useRef();
  const selectedRef = useRef();

  const getUserData = async (signal) => {
    // console.log("getUserData @ WalletAddress.jsx");
    setLocalData();    
    // getServerData(); // airtable data
  };

  const setLocalData = async () => {
    // console.log("getting local data")
    let temp = undefined
    if (tokenName=="shiba inu"){
      console.log("pushing data to shiba inu list")
      temp = [...exchangesArray[tokenNames["shiba inu"]]]
      setUsers(temp);      
    }
    else if (tokenName=="pepe"){
      console.log("pushing data to pepe list")
      temp = [...exchangesArray[tokenNames["pepe"]]]
      setUsers(temp);
    }
  }

  const getServerData = async (signal) => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/hw/users", {
        signal,
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.log(error.message);
      }
    }
  }

  
  const handleSelectChange = (event) => {
    let temp=undefined
    console.log("event.target.value at walletaddress=" + event.target.value)    
    if (event.target.value ==="shiba inu"){
      temp = [...exchangesArray[tokenNames["shiba inu"]]]
      setUsers(temp);
      // setUsers(exchangesArray[tokenNames["shiba inu"]])
      setTokenName("shiba inu")
      console.log(users)      
    }
    else if (event.target.value ==="pepe"){
      temp = [...exchangesArray[tokenNames["pepe"]]]      
      setUsers(temp);      
      // setUsers(exchangesArray[tokenNames["pepe"]]);   
      setTokenName("pepe")
      console.log(users)     
    }
    else{
      setTokenName(event.target.value)
      console.log("event target value=" + event.target.value)
      console.log("tokenNames" + tokenNames[2])
      console.log(typeof(event.target.value))
      console.log("tokenNames" + tokenNames[event.target.value])

      temp = [...exchangesArray[tokenNames["event.target.value"]]]      
      setUsers(temp);      
      // setUsers(exchangesArray[tokenNames[event.target.value]]);   
      console.log(users)     
    } 
    // next will be set data to airtable for persistence storage
    // getUserData()

  }

  const setDataToAirTable = () => {
    console.log("setDataToAirTable")

    if (tokenName=="shiba inu"){
      console.log(`pushing data to exchangesArray[tokenNames["shiba inu"]]`)
      exchangesArray[tokenNames["shiba inu"]].push({name: tagRef.current.value, address: addressRef.current.value})
    }
    else if (tokenName=="pepe"){
      console.log(`pushing data to exchangesArray[tokenNames["pepe"]]`)
      exchangesArray[tokenNames["pepe"]].push({name: tagRef.current.value, address: addressRef.current.value})
    }
    else{
      console.log(`pushing data to exchangesArray[tokenNames["?"]]`)
      exchangesArray[tokenNames[tokenName]].push({name: tagRef.current.value, address: addressRef.current.value})
    }

    // next will be set data to airtable for persistence storage

    return true;
  }

  const addAddress = async (event) => {
    const tag = tagRef.current.value;
    const address = addressRef.current.value;

    console.log(`tagRef.current.value=${tagRef.current.value}`)
    console.log(`addressRef.current.value=${addressRef.current.value}`)

    if (address != "") {
      if (setDataToAirTable()) {
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
    const controller = new AbortController();
    // getUserData(controller.signal);
    setUsers(exchangesArray[tokenNames["pepe"]]);

    return () => {
      controller.abort();
    };
  }, []);


  return (
    <div className="container">
      <h1>Wallet Address</h1>

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
          Add Wallet Address
        </ButtonCom>
      </div>
      <br/>
      <SelectOptionCom 
        className="row"
        reference={selectedRef} 
        optionPattern="contractAddress"
        onSelect={handleSelectChange}
      >
      </SelectOptionCom>


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

export default WalletAddress;
