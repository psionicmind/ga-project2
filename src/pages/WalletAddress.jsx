import React, { useEffect, useState, useRef } from "react";
import Address from "./Address";
import styles from "./Address.module.css";
import {exchangesArray, tokenNames, contractAddressList} from "./exchangesAddress.js";
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
    // console.log("getData @ WalletAddress.jsx");
    setLocalData();    
    getServerUpdate(); // airtable data
  };

  const setLocalData = async () => {
    console.log("getting local data")
    let temp = undefined
    console.log("pushing data to list")
    temp = [...exchangesArray[tokenNames[tokenName]]]
    setDefaultAddress(temp);
  }

  const getServerUpdate = async (signal) => {
    console.log("getting server data from airtable")
    try {
      const url =`https://api.airtable.com/v0/appau3qeDmEuoOXAq/exchangesInToken`

      const res = await fetch(url, {
        signal, 
        headers:{"Authorization": `Bearer ${import.meta.env.VITE_AirtableApiToken}`}
      });

      if (res.ok) {        
        const data = await res.json();
        // console.log(data.records.length)
        // console.log(data.records)

        let nameOfRecord=""
        let addressOfRecord=""
        let id=""
        // console.log("ready")

        let tempList=[]
        for (const record in data.records){
          const id = data.records[record].id
          const nameOfRecord = data.records[record].fields.name
          const addressOfRecord= data.records[record].fields.address
          const TokenName = data.records[record].fields.TokenName

          // console.log(id)
          // console.log(nameOfRecord)
          // console.log(addressOfRecord)
                    
          console.log(`tokenName=${tokenName}`)
          if (TokenName === tokenName){
            tempList.push({id:`${id}`,name: `${nameOfRecord}`, address: `${addressOfRecord}`})
          }
        }

        console.log("see lah lah")
        // console.log(tempList)
        userDefinedAddressList=[...tempList]
        console.log(JSON.stringify(userDefinedAddressList))

        const temp=[...tempList]
        // userDefinedAddressList.push({id:`${id}`,name: `${nameOfRecord}`, address: `${addressOfRecord}`})
        setUserDefined(temp);        

      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.log(error.message);
      }
    }
  }
  
  const handleSelectChange = (event) => {

    const selectedTokenName=event.target.value
    console.log("event.target.value at walletaddress=" + selectedTokenName )    
    setTokenName(selectedTokenName)

    console.log("tokenNames[event.target.value]=" + tokenNames[selectedTokenName])

    // setLocalData
    const temp = [...exchangesArray[tokenNames[selectedTokenName]]]      
    console.log(temp)     
    setDefaultAddress(temp);      

    // getServerUpdate
    // getServerUpdate()

    // getData()

  }

  const addAddress = async (event) => {
    const tag = tagRef.current.value;
    const address = addressRef.current.value;

    console.log(`tagRef.current.value=${tagRef.current.value}`)
    console.log(`addressRef.current.value=${addressRef.current.value}`)

    if (address != "") {
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
    console.log(exchangesArray[tokenNames[tokenName]])
    
    createRecordInServer();

    return true;
  }

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
        // let tempList=[...userDefined, {id:"", name: `${tagRef.current.value}`, address: `${addressRef.current.value}`}]
        // userDefinedAddressList = [...tempList]
        // setUserDefined(tempList);        

      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.log(error.message);
      }
    }
  }


  useEffect(() => {
    const controller = new AbortController();
    getData(controller.signal);
    // setDefaultAddress(exchangesArray[tokenNames["pepe"]]);
    // setUserDefined(exchangesArray[tokenNames["pepe"]])

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    console.log("useEffect tokenName=")
    console.log(tokenName)
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
