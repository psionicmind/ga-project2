import React, { useEffect, useState, useRef } from "react";
import Address from "./Address";
import styles from "./Address.module.css";
import {exchangesInShibaInuToken, exchangesInPepeToken, contractAddressList} from "./exchangesAddress.js";
import LabelCom from "../components/LabelCom.jsx";
import InputCom from "../components/InputCom.jsx";
import ButtonCom from "../components/ButtonCom.jsx";
import SelectOptionCom from "../components/SelectOptionCom.jsx";

const WalletAddress = () => {
  const [users, setUsers] = useState([]);
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
    // setUsers(exchangesInPepeToken);
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
    console.log("event.target.value at walletaddress=" + event.target.value)
    if (event.target.value ==="shiba inu"){
      setUsers(exchangesInShibaInuToken);
      console.log(users)      
    }
    else if (event.target.value ==="pepe"){
      setUsers(exchangesInPepeToken);   
      console.log(users)     
    }
    // next will be set data to airtable for persistence storage
    getUserData()

  }

  const addAddress = async () => {
    const tag = tagRef.current.value;
    const address = addressRef.current.value;

    console.log(`tagRef.current.value=${tagRef.current.value}`)
    console.log(`addressRef.current.value=${addressRef.current.value}`)

    if (address != "") {
      // send new data using setUsers  AND airtable

      // const res = await fetch(import.meta.env.VITE_SERVER + "/hw/users", {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     address: address,
      //   }),
      // });
      // if (res.ok) {
      if (true) {
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
    setUsers(exchangesInPepeToken);

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
