import React, { useEffect, useState, useRef } from "react";
import Address from "./Address";
import styles from "./Address.module.css";
import {exchangesInShibaInuToken, exchangesInPepeToken, contractAddressList} from "./exchangesAddress.js";

const ContractAddress = () => {
  const caData = [...contractAddressList]
  const [users, setUsers] = useState(caData);
  const [languages, setLanguages] = useState([]);
  const addressRef = useRef();
  const tagRef = useRef();

  console.log("caData=" + JSON.stringify(caData))
  const getUserData = async (signal) => {
    console.log("getUserData @ ContractAddress.jsx");
    getLocalData()   
    getServerUpdate();
  };

  const getLocalData = async () => {
    console.log("getting local data")
    setUsers(contractAddressList);
  }

  const getServerUpdate = async (signal) => {
    console.log("getting server data from airtable")
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
        addressRef.current.value = "";
      } else {
        console.log("an error has occurred");
      }
    } else {
      console.log("wrong entry, check again");
    }
  };

  return (
    <div className="container">
      <h1>Contract Address</h1>

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
          Add Contract Address
        </button>
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
