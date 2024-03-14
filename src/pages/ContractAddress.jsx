import React, { useEffect, useState, useRef } from "react";
import Address from "./Address";
import styles from "./Address.module.css";
import {contractAddressList, tokenNames} from "./exchangesAddress.js";
import LabelCom from "../components/LabelCom.jsx";
import InputCom from "../components/InputCom.jsx";
import ButtonCom from "../components/ButtonCom.jsx";

const ContractAddress = () => {
  const [users, setUsers] = useState([]);
  const addressRef = useRef();
  const tagRef = useRef();


  const getUserData = () => {
    console.log("getUserData @ ContractAddress.jsx");
    getLocalData()   
    // getServerUpdate(); // airtable data
  };

  const getLocalData = () => {
    console.log("getting local data")
    const temp=[...contractAddressList]
    setUsers(temp);
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

  const setDataToAirTable = () => {
    console.log("setDataToAirTable")

    contractAddressList.push({name: tagRef.current.value, address: addressRef.current.value})
    console.log("contractAddressList=" + contractAddressList)

    tokenNames.push(tagRef.current.value)
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
    setUsers(contractAddressList);

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
