import React, { useEffect, useState, useRef } from "react";
import Address from "./Address";

const WhaleCatcher = () => {
  const [users, setUsers] = useState([]);
  const [languages, setLanguages] = useState([]);
  const contractAddressRef = useRef();
  const walletAddressRef = useRef();

  const catchWhale = async () => {
    const contractAddress = contractAddressRef.current.value;
    const walletAddress = walletAddressRef.current.value;
  

    if (address != "") {
      const res = await fetch(import.meta.env.VITE_SERVER + "/hw/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: address,
        }),
      });
      if (res.ok) {
        getUserData();
        contractAddressRef.current.value = "";
        walletAddressRef.current.value = "";
      } else {
        console.log("an error has occurred");
      }
    } else {
      console.log("wrong entry, check again");
    }  
  }
  const getUserData = async (signal) => {
    console.log("getUserData @ WhaleCatcher.jsx");
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/hw/users", {
        signal,
      });

      if (res.ok) {
        //        if (res.status !== 200) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    console.log("useEffect Main body");
    const controller = new AbortController();
    getUserData(controller.signal);

    return () => {
      console.log("useEffect return");
      controller.abort();
    };
  }, []);

  return (
    <div className="container">
      <h1>Whale Catcher</h1>

      <div className="row">
        <input
          type="text"
          ref={contractAddressRef}
          placeholder="Enter Contract Address"
          className="col-md-6"
        ></input>
      </div>
      <div className="row">
        <input
          type="text"
          ref={walletAddressRef}
          placeholder="Enter Wallet Address"
          className="col-md-6"
        ></input>
        <button className="col-md-2" onClick={catchWhale}>
          Catch Whale
        </button>
      </div>
      {users.map((item, idx) => {
        return (
          <Address
            key={idx}
            id={item.id}
            name={item.name}
            age={item.age}
            country={item.country}
            getUserData={getUserData}
          />
        );
      })}
      <br />
      <br />
      <br />
    </div>
  );
};

export default WhaleCatcher;
