import React, { useEffect, useState, useRef } from "react";
import Address from "./Address";
import SelectOptionCom from "../components/SelectOptionCom.jsx";
import {exchangesInShibaInuToken, exchangesInPepeToken} from "./exchangesAddress.js";
import ButtonCom from "../components/ButtonCom.jsx";

const WhaleCatcher = () => {
  const [offloadingWhale, setOffloadingWhale] = useState([]);
  const [catchingWhale, setCatchingWhale] = useState([]);
  const [tokenAddress, setTokenAddress] = useState("0x6982508145454Ce325dDbE47a25d4ec3d2311933");  //pepe
  // const selectedRef = useRef();
  
  

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function runLoopFunction(){
    let exchangeAddresses = "";
    const contractAddress=tokenAddress

    if (contractAddress ==="0x6982508145454Ce325dDbE47a25d4ec3d2311933"){
      // console.log("checking against pepe's exchange")
      exchangeAddresses=exchangesInShibaInuToken
      // console.log(`exchangeAddresses= ${JSON.stringify(exchangeAddresses)}`)
    }
    else if (contractAddress ==="0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"){
      // console.log("checking against shiba inu's exchange")
      exchangeAddresses=exchangesInPepeToken
      // console.log(`exchangeAddresses= ${JSON.stringify(exchangeAddresses)}`)
    }

    loopFunction(exchangeAddresses)    
  }

  function loopFunction(tokenAddress) {
    sleep(1000).then(() => {
      catchWhale()
      // IsToAddressAnExchange(catchingWhale, tokenAddress)
      loopFunction(tokenAddress);
    });
  }

  const IsToAddressAnExchange = (data, tokenAddress) => {
    console.log("data = " + JSON.stringify(data))    
    // console.log("exchange   =  " + Object.values(exchangesInPepeToken))
    for (const datum in data["result"]){
      // console.log(`data["result"][datum]=${data["result"][datum].confirmations}`)
      // console.log("datum")
      // console.log(datum + " " +data["result"][datum].to)          
      console.log(JSON.stringify(data["result"][datum]))          
      if (data["result"][datum].confirmations <=200){ // don't take too long ago data
          // console.log(datum + " " +data["result"][datum].to)          
          if (Object.values(tokenAddress).includes(data["result"][datum].to)){
              console.log("token sent to exchange!" + data["result"][datum].to)
              setOffloadingWhale(data["result"][datum])
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
    // console.log("catching whale...............")
    // console.log(`tokenAddress=${tokenAddress}`)

    const contractAddress=tokenAddress
    // console.log(`contractAddress=${contractAddress}`)
    const totalPage=100
    
    if (contractAddress != "") {
      let url = "";
      url = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${contractAddress}&page=1&offset=${totalPage}&startblock=0&endblock=99999999&sort=desc&apikey=${import.meta.env.VITE_YourApiKeyToken}`  
      // url = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${contractAddress}&address=${walletAddress}&page=1&offset=20&startblock=0&endblock=99999999&sort=desc&apikey=${import.meta.env.VITE_YourApiKeyToken}`
      
      // console.log(url)

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
        // console.log(`data=${JSON.stringify(data)}`)


        // console.log("data = " + JSON.stringify(data))    
        // console.log("exchange   =  " + Object.values(exchangesInPepeToken))
        for (const datum in data["result"]){
          // console.log(`data["result"][datum]=${data["result"][datum].confirmations}`)
          // console.log("datum")
          // console.log(datum + " " +data["result"][datum].to)          
          console.log(JSON.stringify(data["result"][datum]))          
          const date = new Date(data["result"][datum].timeStamp);
          console.log(date);
          console.log(`${data["result"][datum].value}`)
          console.log(`${data["result"][datum].tokenDecimal}`)
          const decimalValue= (1/(Math.pow(10,6)))
          console.log(decimalValue)
          const amount=decimalValue*data["result"][datum].value
          console.log(amount)

          if (data["result"][datum].confirmations <=20){ // don't take too long ago data
              console.log(datum + " " +data["result"][datum].to)          
              if (Object.values(tokenAddress).includes(data["result"][datum].to)){
                  console.log("token sent to exchange!" + data["result"][datum].to)
                  setOffloadingWhale(data["result"][datum])                  
              }
          }
        }
        console.log(".")







      } else {
        console.log("an error has occurred");
      }
    } else {
      console.log("wrong entry, check again");
    }  
  }

  const handleSelectChange = (event) => {
    console.log("select change ........................")

    // const selectedOptionData = event.target.options[event.target.selectedIndex]
    // console.log(selectedOptionData)

    const address = event.target.options[event.target.selectedIndex].dataset.address
    console.log(address)

    setTokenAddress(address)    
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
      <div className="row">
      <ButtonCom handleBtnClick={runLoopFunction}>
          Catch Whale
      </ButtonCom>
      </div>
      <br/>
      <div className="row">
        <SelectOptionCom id="tokenSelect"
          // reference={selectedRef} 
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
      {offloadingWhale.map((item, idx) => {
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
