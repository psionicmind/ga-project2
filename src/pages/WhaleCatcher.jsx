import React, { useEffect, useState, useRef } from "react";
import Address from "./Address";
import styles from "./Address.module.css";
import SelectOptionCom from "../components/SelectOptionCom.jsx";
import {exchangesInShibaInuToken, exchangesInPepeToken} from "./exchangesAddress.js";
import ButtonCom from "../components/ButtonCom.jsx";
import LabelCom from "../components/LabelCom.jsx";
import CryptoLogoCom from "../components/CryptoLogoCom.jsx";

const WhaleCatcher = () => {
  const [offloadingWhale, setOffloadingWhale] = useState([]);
  const [catchingWhale, setCatchingWhale] = useState([]);
  const [startSpinner, setStartSpinner] = useState(false);


  const [stopLoop, setStopLoop] = useState(false);

  const [tokenAddress, setTokenAddress] = useState("0x6982508145454Ce325dDbE47a25d4ec3d2311933");  //pepe
  const [tokenSymbol, setTokenSymbol] = useState("PEPE");
  const [tokenPrice, setTokenPrice] = useState(0.0);


  // to access api 1second at a time
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function stopLoopFunction(){
    console.log("stop loop")
    setStopLoop(true)
  }
  
  // setting of data before running the actual loop
  function runLoopFunction(){
    playSound()
    setStartSpinner(true)
    setStopLoop(false)
    let exchangeAddressesOnly = "";
    let exchangesAddress = "";
    const contractAddress=tokenAddress

    // contract address is the token address you wanted to monitor.
    if (contractAddress ==="0x6982508145454Ce325dDbE47a25d4ec3d2311933"){
      exchangesAddress=exchangesInPepeToken

      // an extraction of "address" only to this array for comparison purpose.
      exchangeAddressesOnly=Object.values(exchangesInPepeToken).map(function(d){
        return d["address"].toLowerCase()        
      })
    }
    else if (contractAddress ==="0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"){
      exchangesAddress=exchangesInShibaInuToken
      exchangeAddressesOnly=Object.values(exchangesInShibaInuToken).map(function(d){
        return d["address"].toLowerCase()
      })
    }

    // get price from api using contract address. e.g. get price of pepe inu
    const price=coingeckoPriceApi(contractAddress)

    // set token price to useState
    setTokenPrice(price)

    // go into loop
    loopFunction(price, 0,exchangeAddressesOnly, exchangesAddress)    
  }

  // this will be the recursive loop running the main function catchWhale
  // which calls etherscan api to fetch latest 25 transaction of (e.g. pepe token)
  function loopFunction(price, counter, exchangeAddressesOnly, exchangesAddress) {

    // the loop will perform a cycle per cycle
    sleep(1000).then(async () => {
      counter++
      if (counter >=5){
        counter=0

        // get price of token using contract address
        price= await coingeckoPriceApi(tokenAddress)

        // take the result of the whalecatcher list and refresh price if price
        // is previously "pending" as it is a async await api call.
        let temp=[...offloadingWhale]
        for (const datum in temp){
          if (price!=undefined){
            if (temp[datum].sumInDollar ==="sync..."){            
              temp[datum].sumInDollar = "$" + (temp[datum].amountInQty * price).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          }
        }

        // after updating data, set to state.
        setOffloadingWhale(temp)

        // after getting the price, set to state.
        setTokenPrice(price)
      }

      if (stopLoop===false){
        // catch whale (get 25 latest transactions of (e.g. pepe token) and
        // compared to list of crypto exchange address  )
        catchWhale(price, exchangeAddressesOnly, exchangesAddress)

        // recursion
        loopFunction(price, counter, exchangeAddressesOnly, exchangesAddress);
      }
      else
        return
    });
  }

  // catch whale (get 25 latest transactions of (e.g. pepe token) and
  // compared to list of crypto exchange address  )
  const catchWhale = async (price, exchangesAdd, exchangesAddress) => {

    //set to contract address what is previously set stated in tokenAddress
    const contractAddress=tokenAddress    
    const totalTransaction=25 // standard page list 25 transactions.
    
    // basic business logic check !=""
    if (contractAddress != "") {
      let url = "";
      url = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${contractAddress}&page=1&offset=${totalTransaction}&startblock=0&endblock=99999999&sort=desc&apikey=${import.meta.env.VITE_YourApiKeyToken}`  

      // fetching etherscan api
      const res  = await fetch(url)
      if (res.ok) {
        let data = await res.json();
        setCatchingWhale(data); // not useful for now

        // cycle thru the 25 transactions extracted from etherscan api
        for (const datum in data["result"]){

          // get the "To" address, to be compared against a list of
          // crypto exchange wallet address.  This is to check if any
          // whale is trying to transfer their token(e.g. pepe token)
          // to exchange, to be sell off.
          const toAddress = data["result"][datum].to

          // multiple decimalValue with value to get qty of (e.g. pepe token)
          const tokenDecimal= data["result"][datum].tokenDecimal
          const decimalValue= (1.0/(Math.pow(10,tokenDecimal)))

          // don't take too long ago data
          // when sending to crypto exchange, usually needs about
          // 20 to 30 confirmations before you can sell the token
          // you have transferred.  during this time(around 3mins),
          // before the confirmations completes, user of this app can
          // 1) sell their own (e.g. pepe token)
          // 2) short the (e.g. pepe token)
          if (data["result"][datum].confirmations <=200){ 
            // obsolete - to be tested later and discard
            const block=Object.values(offloadingWhale).map(function(d){
              return d["blockNumber"]
            })

              // check all crypto exchange wallet address, any of them got this
              // transaction's "To" address. essentially, asking if holder sending
              // to crypto exchange?
              if (Object.values(exchangesAdd).includes(toAddress)){

                // AMOUNT in $$$
                let amountInQty=decimalValue*data["result"][datum].value
                data["result"][datum].amountInQty=amountInQty
                let sumInDollar=price*amountInQty

                // if (sumInDollar >=0){
                  // display currency number nicely
                  sumInDollar= "$" + sumInDollar.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

                  // if price is undefined, sumInDollar will be NaN
                  if (isNaN(sumInDollar)){
                    data["result"][datum].sumInDollar= "sync..."
                  }
                  else{
                    data["result"][datum].sumInDollar= sumInDollar;
                  }

                  // NAME OF EXCHANGE BEING SENT TO (CAN SHORT IN ANY EXCHANGES, FYI ONLY)
                  const indexAdd=Object.values(exchangesAdd).indexOf(toAddress)
                  const targetedExchangeName=exchangesAddress[indexAdd].name
                  data["result"][datum].targetedExchangeName= targetedExchangeName;


                  // check offloadingWhale list of transaction's block number against incoming
                  // 25 transaction's blocknumber, if same, don't add to offloadingWhale
                  const block=Object.values(offloadingWhale).map(function(d){
                    return d["blockNumber"]
                  })
                  if (!block.includes(data["result"][datum].blockNumber)){
                    // playFoundWhaleSound()
                    const temp=offloadingWhale
                    temp.push(data["result"][datum])
                    setOffloadingWhale(temp)  
                  }
                // }

              }
          }
        }
      } else {
        console.log("an error has occurred");
      }
    } else {
      console.log("wrong entry, check again");
    }  
  } // end of catchWhale

  // cmc api to get price. got cors error.
  const cmcPriceApi = async (contractName) => {

    if (contractName != "") {
      let url = "";
      url= `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${contractName}`
      
      const res = await fetch(url, {
        method: "GET",
        // cors: { origin: "*" },
        headers: {
          "X-CMC_PRO_API_KEY": `${import.meta.env.VITE_CMC_PRO_API_KEY}`,
        },        
      });

      if (res.ok) {
        let data = await res.json();
        let price=0.0

        for(const eachToken in data["data"][tokenName]){
          if (data["data"][tokenName][eachToken]["platform"]["token_address"]==tokenAddress){
            price=data["data"][tokenName][eachToken]["quote"]["USD"]["price"]  
            return price
          }
        }
      } else {
        console.log("an error has occurred");
      }
    } else {
      console.log("wrong entry, check again");
    }  
  } // end of cmcPriceApi 

  //coingecko get price of token using contract address
  const coingeckoPriceApi = async (contractAdd) => {
    try{
      if (contractAdd != "") {
        const url= `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${contractAdd}&vs_currencies=usd`
        
        const res = await fetch(url, {
          method: "GET",
          // mode: "cors",
          x_cg_pro_api_key: `${import.meta.env.VITE_CoinGeckoApiKey}`
        });

        if (res.ok) {
          let data = await res.json();
          let price=0.0
          
          for (const datum in data){
            price = data[datum].usd
          }        
          setTokenPrice(price)

          return price
        } else {
          console.log("an error has occurred");
        }
      } else {
        console.log("wrong entry, check again");
      }  
    }
    catch (error){
      console.log("catching error" + error)
    }
  } // end of coingeckoPriceApi

  const getOffLoadingWhaleData = () => {
    const temp=[...offloadingWhale]
    setOffloadingWhale(temp)
  }

  // select element change
  const handleSelectChange = (event) => {
    // use selected index of element to get "name and address" of option item details
    const name = event.target.options[event.target.selectedIndex].dataset.name
    const address = event.target.options[event.target.selectedIndex].dataset.address
    
    // set to state
    setTokenSymbol(name)    
    setTokenAddress(address)
  }
  
  // obsolete - to be tested later and discard
  useEffect(() => {
    const controller = new AbortController();
  
    return () => {
      controller.abort();
    };
  }, []);

  // obsolete - to be tested later and discard
  useEffect(() => {
    const controller = new AbortController();
  
    return () => {
      controller.abort();
    };
  }, [tokenPrice]);  

  function playSound(){
    var audio = new Audio('../../sound/money-button.mp3');
    audio.play();
  }

  function playFoundWhaleSound(){
    var audio = new Audio('../../sound/i-see-money-181273.mp3');
    audio.play();
  }  

  return (
    <div className="container">
      <h1>Whale Catcher</h1>
      <div className="row">
      <ButtonCom handleBtnClick={runLoopFunction}>
          Catch Whale
      </ButtonCom>
      {/* <ButtonCom handleBtnClick={stopLoopFunction}>
          Stop Loop
      </ButtonCom> */}
      </div>

      <br/>
      <div className="row">
        <SelectOptionCom id="tokenSelect"
          optionPattern="contractAddress"
          onSelect={handleSelectChange}
        >
        </SelectOptionCom>
      </div>
      {(stopLoop===true) && (<LabelCom>stop</LabelCom>)}
      <br/>
      <p>Whale Caught</p>
      <div className={`row ${styles.address}`}>
        <div className="col-sm-0"> </div>
        <div className="col-sm-1">Token</div>
        <div className="col-sm-7">from</div>
        <div className="col-sm-2">To</div>
        <div className="col-sm-1">Amount</div>
      </div>
      {offloadingWhale.map((item, idx) => {
        return (
          <Address
            key={idx}
            // id={item.id}
            name={item.tokenName}
            address={item.from}
            targetedExchangeName={item.targetedExchangeName}            
            sumInDollar={item.sumInDollar}
            getData={getOffLoadingWhaleData}
          />
        );
      })}
      <br />
      <p className={`${styles.alignRight}`}>Price Data, Powered by CoinGecko</p>
      <br />
      {(startSpinner) && (<CryptoLogoCom className={`${styles.loaderIcon}`}/>)}
      <br />
      <br />
    </div>
  );
};

export default WhaleCatcher;
