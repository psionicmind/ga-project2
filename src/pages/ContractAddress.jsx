import React, { useEffect, useState, useRef } from "react";
import Address from "./Address";
import styles from "./Address.module.css";
import {contractAddressList} from "./exchangesAddress.js";
import LabelCom from "../components/LabelCom.jsx";
import InputCom from "../components/InputCom.jsx";
import ButtonCom from "../components/ButtonCom.jsx";

const ContractAddress = () => {
  const [users, setUsers] = useState([]);
  const addressRef = useRef();
  const tagRef = useRef();


  const getUserData = async (signal) => {
    console.log("getUserData @ ContractAddress.jsx");
    setLocalData()   

    console.log("contractAddressList=" + contractAddressList)
    setUsers(contractAddressList);
    // getServerUpdate(); // airtable data
  };

  const setLocalData = async () => {
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

  const setAirTable = () => {
    console.log("setairtable")

    contractAddressList.push({name: tagRef.current.value, address: addressRef.current.value})
    console.log("contractAddressList=" + contractAddressList)
    setUsers(contractAddressList)    
    // next will be set data to airtable for persistence storage
    getUserData()

  }
  const addAddress = async () => {
    const tag = tagRef.current.value;
    const address = addressRef.current.value;
  
    console.log(tag)
    console.log(address)
    console.log(`tagRef.current.value=${tagRef.current.value}`)
    console.log(`addressRef.current.value=${addressRef.current.value}`)

    if (address != "") {

      setAirTable()
      // setUsers((prevState) => {
      //   return [...prevState, {name: tag, address: address}]
      // });

     
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
      if (true){
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
    console.log("contractAddressList="+ JSON.stringify(contractAddressList))
    setUsers(contractAddressList);

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    console.log("useEffect")
    const controller = new AbortController();
    console.log("contractAddressList="+ JSON.stringify(contractAddressList))
    setUsers(contractAddressList);

    return () => {
      controller.abort();
    };
  }, [users]);


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
