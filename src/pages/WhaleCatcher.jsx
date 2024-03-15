import React, { useEffect, useState, useRef } from "react";
import Address from "./Address";
import SelectOptionCom from "../components/SelectOptionCom.jsx";
import {exchangesInShibaInuToken, exchangesInPepeToken} from "./exchangesAddress.js";

const WhaleCatcher = () => {
  const [users, setUsers] = useState([]);
  const [catchingWhale, setCatchingWhale] = useState([]);
  const [tokenAddress, setTokenAddress] = useState("0x6982508145454Ce325dDbE47a25d4ec3d2311933");  //pepe
  const [languages, setLanguages] = useState([]);
  // const contractAddressRef = useRef();
  // const walletAddressRef = useRef();
  const selectedRef = useRef();
  
  

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function runLoopFunction(data, contractAddress){
    let tokenAddress = "";

    if (contractAddress ==="0x6982508145454Ce325dDbE47a25d4ec3d2311933"){
      console.log("checking against pepe's exchange")
      tokenAddress=exchangesInShibaInuToken
      console.log(`tokenAddress= ${JSON.stringify(tokenAddress)}`)
    }
    else if (contractAddress ==="0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"){
      console.log("checking against shiba inu's exchange")
      tokenAddress=exchangesInPepeToken
      console.log(`tokenAddress= ${JSON.stringify(tokenAddress)}`)
    }

    loopFunction(data, tokenAddress)    
  }

  function loopFunction(data, tokenAddress) {
    sleep(1000).then(() => {
      IsToAddressAnExchange(data, tokenAddress)
      loopFunction(data, tokenAddress);
    });
  }

  const IsToAddressAnExchange = (data, tokenAddress) => {
    // console.log("data = " + JSON.stringify(data))    
    // console.log("exchange   =  " + Object.values(exchangesInPepeToken))
    for (const datum in data["result"]){
      // console.log(`data["result"][datum]=${data["result"][datum].confirmations}`)
      if (data["result"][datum].confirmations <=200){ // don't take too long ago data
          // console.log(datum + " " +data["result"][datum].to)          
          if (Object.values(tokenAddress).includes(data["result"][datum].to)){
              console.log("token sent to exchange!" + data["result"][datum].to)
              return true;
          }
      }
    }
    console.log(".")
    // console.log("Whale haven't send token to any exchange")
    return false;
}
  
  const catchWhale = async () => {
    // const contractAddress = contractAddressRef.current.value;
    // const walletAddress = walletAddressRef.current.value;
    tokenName

    if (contractAddress != "") {
      let url = "";
      if (walletAddress === ""){
          url = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${contractAddress}&page=1&offset=20&startblock=0&endblock=99999999&sort=desc&apikey=${import.meta.env.VITE_YourApiKeyToken}`  
      }
      else
        url = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${contractAddress}&address=${walletAddress}&page=1&offset=20&startblock=0&endblock=99999999&sort=desc&apikey=${import.meta.env.VITE_YourApiKeyToken}`
      // url ="https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=0xdac17f958d2ee523a2206206994597c13d831ec7&address=0xdfd5293d8e347dfe59e90efd55b2956a1343963d&page=1&offset=100&startblock=0&endblock=99999999&sort=desc&apikey=" + import.meta.env.VITE_YourApiKeyToken
      // const res = await fetch(url, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },        
      // });

      const res  = await fetch(url)
      if (res.ok) {
        // getUserData();
        let data = await res.json();
        setCatchingWhale(data);

        runLoopFunction(data, contractAddress)


        // contractAddressRef.current.value = "";
        // walletAddressRef.current.value = "";
      } else {
        console.log("an error has occurred");
      }
    } else {
      console.log("wrong entry, check again");
    }  
  }

  const handleSelectChange = (event) => {
    let temp=undefined
    console.log("event.target.value at whalecatcher=" + event.target.value)    

    setTokenAddress(event.target.value)


  }
  // const getUserData = async (signal) => {
  //   console.log("getUserData @ WhaleCatcher.jsx");
  //   try {
  //     const res = await fetch(import.meta.env.VITE_SERVER + "/hw/users", {
  //       signal,
  //     });

  //     if (res.ok) {
  //       const data = await res.json();
  //       setUsers(data);
  //     }
  //   } catch (error) {
  //     if (error.name !== "AbortError") {
  //       console.log(error.message);
  //     }
  //   }
  // };

  useEffect(() => {
    // console.log("useEffect Main body");
    const controller = new AbortController();
    // getUserData(controller.signal);

    return () => {
      // console.log("useEffect return");
      controller.abort();
    };
  }, []);

  return (
    <div className="container">
      <h1>Whale Catcher</h1>

      {/* <div className="row">
        <label>0x6982508145454Ce325dDbE47a25d4ec3d2311933</label>
        <input
          type="text"
          ref={contractAddressRef}
          placeholder="Enter Contract Address / Token "
          // placeholder="0x6982508145454Ce325dDbE47a25d4ec3d2311933"
          className="col-md-6"
        ></input>
      </div> */}
      <div>
        <SelectOptionCom 
          className="row"
          reference={selectedRef} 
          optionPattern="contractAddress"
          onSelect={handleSelectChange}
        >
        </SelectOptionCom>
      </div>
      {/* <div className="row">
        <label>0x28C6c06298d514Db089934071355E5743bf21d60</label>
        <input
          type="text"
          ref={walletAddressRef}
          placeholder="To which Crypto Exchange Wallet Address"
          // placeholder="0x28C6c06298d514Db089934071355E5743bf21d60"
          className="col-md-6"
        ></input>
      </div> */}
      <div className="row">
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
            // getUserData={getUserData}
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
