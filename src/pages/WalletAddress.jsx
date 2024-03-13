import React, { useEffect, useState, useRef } from "react";
import Address from "./Address";
import styles from "./Address.module.css";
import {exchangesInShibaInuToken, exchangesInPepeToken, contractAddressList} from "./exchangesAddress.js";

const WalletAddress = () => {
  const caData = [...exchangesInPepeToken]  
  const [users, setUsers] = useState(caData);
  const [languages, setLanguages] = useState([]);
  const addressRef = useRef();
  const tagRef = useRef();

  const getUserData = async (signal) => {
    console.log("getUserData @ WalletAddress.jsx");
    getLocalData();    
    getServerData();
  };

  const getLocalData = async () => {
    console.log("getting local data")
    setUsers(exchangesInPepeToken);
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
  const addAddress = async () => {
    const tagRef = tagRef.current.value;
    const address = addressRef.current.value;

    if (address != "") {
      // const res = await fetch(import.meta.env.VITE_SERVER + "/hw/users", {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     address: address,
      //   }),
      // });
      if (res.ok) {
        getUserData();
        tagRef.current.value = "";
        address.current.value = "";
      } else {
        console.log("an error has occurred");
      }
    } else {
      console.log("wrong entry, check again");
    }
  };

  return (
    <div className="container">
      <h1>Wallet Address</h1>

      <div className="row">
        <input
          type="text"
          ref={tagRef}
          placeholder="Enter NickName"
          className="col-md-6"
        ></input>        
      </div>
      <div className="row">      
        <input
          type="text"
          ref={addressRef}
          placeholder="Enter Address"
          className="col-md-6"
        ></input>
      </div>
      <div className="row">              
        <button className="col-md-3" onClick={addAddress}>
          Add Wallet Address
        </button>
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

export default WalletAddress;
