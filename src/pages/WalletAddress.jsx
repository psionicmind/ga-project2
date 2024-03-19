import React, { useEffect, useState, useRef } from "react";
import Address from "./Address";
import {exchangesArray, tokenNames} from "./exchangesAddress.js";
import LabelCom from "../components/LabelCom.jsx";
import InputCom from "../components/InputCom.jsx";
import ButtonCom from "../components/ButtonCom.jsx";
import SelectOptionCom from "../components/SelectOptionCom.jsx";

const WalletAddress = () => {
  const [defaultAddress, setDefaultAddress] = useState([]);
  const [userDefined, setUserDefined] = useState([]);

  const [tokenName, setTokenName] = useState("pepe");
  const addressRef = useRef();
  const tagRef = useRef();
  const selectedRef = useRef();
  let userDefinedAddressList=""

  const getData = async (signal) => {
    setLocalData();    
    getServerUpdate(); // airtable data
  };

  const setLocalData = async () => {
    let temp = undefined
    temp = [...exchangesArray[tokenNames[tokenName]]]
    setDefaultAddress(temp);
  }

  // get data from airtable
  const getServerUpdate = async (signal) => {
    try {
      const url =`https://api.airtable.com/v0/appau3qeDmEuoOXAq/exchangesInToken`

      const res = await fetch(url, {
        signal, 
        headers:{"Authorization": `Bearer ${import.meta.env.VITE_AirtableApiToken}`}
      });

      if (res.ok) {        
        const data = await res.json();

        let tempList=[]
        for (const record in data.records){
          const id = data.records[record].id
          const nameOfRecord = data.records[record].fields.name
          const addressOfRecord= data.records[record].fields.address
          const TokenName = data.records[record].fields.TokenName
                    
          if (TokenName === tokenName){
            tempList.push({id:`${id}`,name: `${nameOfRecord}`, address: `${addressOfRecord}`})
          }
        }

        userDefinedAddressList=[...tempList]
        const temp=[...tempList]
        setUserDefined(temp);        

      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.log(error.message);
      }
    }
  }
  
  // handle select element change
  const handleSelectChange = (event) => {
    // send  selected value to set state
    const selectedTokenName=event.target.value
    setTokenName(selectedTokenName)

    // take the correct exchanges list of wallet address and set state.
    const temp = [...exchangesArray[tokenNames[selectedTokenName]]]      
    setDefaultAddress(temp);      
  }

  // add address to airtable and clear away useRef
  const addAddress = async (event) => {

    if (addressRef.current.value != "") {
      if (setDataToAirTable()) {
        getServerUpdate(); // since addAddress is for user defined data, we only get update from server
        tagRef.current.value = "";
        addressRef.current.value = "";
      } else {
        console.log("an error has occurred");
      }
    } else {
      console.log("wrong entry, check again");
    }
  };

  // set the two useRef data (tag and address) to exchangesArray list of exchange wallet address.
  // also create record in airtable using the same two data.
  const setDataToAirTable = () => {
    if (tokenName=="shiba inu"){
      exchangesArray[tokenNames["shiba inu"]].push({name: tagRef.current.value, address: addressRef.current.value})
    }
    else if (tokenName=="pepe"){
      exchangesArray[tokenNames["pepe"]].push({name: tagRef.current.value, address: addressRef.current.value})
    }
    else{
      exchangesArray[tokenNames[tokenName]].push({name: tagRef.current.value, address: addressRef.current.value})
    }
    
    createRecordInServer();

    return true;
  }

  // create record in airtable using tag and address useRef
  const createRecordInServer = async (signal) => {
    try {
      const url =`https://api.airtable.com/v0/appau3qeDmEuoOXAq/exchangesInToken`     

      const res = await fetch(url, {
        signal, 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_AirtableApiToken}`,
        },
        body: JSON.stringify({
          "records": [
            {
              "fields": {
                "TokenName":`${tokenName}`,
                "name": `${tagRef.current.value}`,
                "address": `${addressRef.current.value}`
              }
            }            
          ]
        }),        
      });

      if (res.ok) {
        console.log("saved new wallet address to server")
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.log(error.message);
      }
    }
  }

  // upon loading, load getData
  useEffect(() => {
    const controller = new AbortController();
    getData(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  // upon change of tokenName, get wallet address data from airtable
  useEffect(() => {
    const controller = new AbortController();
    getServerUpdate()

    return () => {
      controller.abort();
    };
  }, [tokenName]);

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
      {(defaultAddress.length!=0) && (<LabelCom>Default Exchange Address</LabelCom>)?"Default Exchange Address":"There is no Default Exchange Address"}      
      {defaultAddress.map((item, idx) => {
        return (
          <Address
            key={idx}
            // id={item.id}
            name={item.name}
            address={item.address}
            getData={setLocalData}
          />
        );
      })}
      <br />
      {(userDefined.length!=0) && (<LabelCom>User Defined Exchange Address</LabelCom>)?"User Defined Exchange Address":"There is no User Defined Exchange Address"}
      {userDefined.map((item, idx) => {
        return (
          <Address
            key={idx}
            // id={item.id}
            name={item.name}
            address={item.address}
            getData={getServerUpdate}
          />
        );
      })}
      <br />

      <br />
    </div>
  );
};

export default WalletAddress;
