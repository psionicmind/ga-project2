import React, { useEffect, useState, useRef } from "react";
import Address from "./Address";
import styles from "./Address.module.css";
import SelectOptionCom from "../components/SelectOptionCom.jsx";
import {exchangesInShibaInuToken, exchangesInPepeToken} from "./exchangesAddress.js";
import ButtonCom from "../components/ButtonCom.jsx";
import LabelCom from "../components/LabelCom.jsx";
import Spinner from 'react-bootstrap/Spinner';
import CryptoLogoCom from "../components/CryptoLogoCom.jsx";

const WhaleCatcher = () => {
  const [offloadingWhale, setOffloadingWhale] = useState([]);
  const [catchingWhale, setCatchingWhale] = useState([]);
  const [startSpinner, setStartSpinner] = useState(false);


  const [stopLoop, setStopLoop] = useState(false);

  const [tokenAddress, setTokenAddress] = useState("0x6982508145454Ce325dDbE47a25d4ec3d2311933");  //pepe
  const [tokenSymbol, setTokenSymbol] = useState("PEPE");
  const [tokenPrice, setTokenPrice] = useState(0.0);

  // const selectedRef = useRef();

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function stopLoopFunction(){
    console.log("stop loop")
    setStopLoop(true)
  }
  
  function runLoopFunction(){
    playSound()
    setStartSpinner(true)
    setStopLoop(false)
    let exchangeAddressesOnly = "";
    let exchangesAddress = "";
    const contractAddress=tokenAddress

    if (contractAddress ==="0x6982508145454Ce325dDbE47a25d4ec3d2311933"){
      // console.log("checking against pepe's exchange")
      exchangesAddress=exchangesInPepeToken
      exchangeAddressesOnly=Object.values(exchangesInPepeToken).map(function(d){
        return d["address"].toLowerCase()        
      })
      console.log(`runLoopFunction exchangeAddresses= ${JSON.stringify(exchangeAddressesOnly)}`)
    }
    else if (contractAddress ==="0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"){
      // console.log("checking against shiba inu's exchange")
      exchangesAddress=exchangesInShibaInuToken
      exchangeAddressesOnly=Object.values(exchangesInShibaInuToken).map(function(d){
        return d["address"].toLowerCase()
      })
      console.log(`runLoopFunction exchangeAddresses= ${JSON.stringify(exchangeAddressesOnly)}`)
    }

    // console.log(`tokenPrice=${tokenPrice}`)
    // console.log(`runLoopFunction contractAddress=${contractAddress}`)
    const price=coingeckoPriceApi(contractAddress)
    console.log(`runLoopFunction price=${JSON.stringify(price)}`)
    setTokenPrice(price)

    loopFunction(price, 0,exchangeAddressesOnly, exchangesAddress)    
  }

  // function loopFunction(price, counter, address, exchangesAddress) {
  //   // console.log(`loopFunction price=${JSON.stringify(price)}`)
  //   // console.log(price)
  //   console.log(`stopLoop................=${stopLoop}`)

  //   while (stopLoop===false){
  //     console.log(`in while...........`)      
  //     sleep(1000).then(() => {
  //       console.log("after sleep")
  //       counter++
  //       if (counter >=5){
  //         counter=0
  //         // console.log(`counter tokenPrice=${tokenPrice}`)
  //         // console.log(`counter tokenAddress=${tokenAddress}`)
  //         price=coingeckoPriceApi(tokenAddress)
  //         // console.log(`counter price=${JSON.stringify(price)}`)
  //         setTokenPrice(price)
  //       }
  //       console.log("starting catchwhale")
  //       catchWhale(price, address, exchangesAddress)
  //     });
  //   }
  // }

  function loopFunction(price, counter, exchangeAddressesOnly, exchangesAddress) {
    // console.log(`loopFunction price=${JSON.stringify(price)}`)
    // console.log(price)

    sleep(1000).then(async () => {
      // console.log(`stopLoop................=${stopLoop}`)
      counter++
      if (counter >=5){
        counter=0

        console.log(`counter tokenAddress=${tokenAddress}`)
        price= await coingeckoPriceApi(tokenAddress)
      
        console.log(`counter tokenPrice=${tokenPrice}`)
        console.log(`counter price=${JSON.stringify(price)}`)
        console.log(price)

        let temp=[...offloadingWhale]
        for (const datum in temp){
          if (price!=undefined){
            console.log(temp[datum].amountInQty)
            if (temp[datum].sumInDollar ==="sync..."){            
              temp[datum].sumInDollar = "$" + (temp[datum].amountInQty * price).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            console.log(`temp[datum].sumInDollar = ${temp[datum].sumInDollar}`)
          }
        }
        setOffloadingWhale(temp)


        setTokenPrice(price)
      }

      if (stopLoop===false){
        catchWhale(price, exchangeAddressesOnly, exchangesAddress)
        loopFunction(price, counter, exchangeAddressesOnly, exchangesAddress);
      }
      else
        return
    });
  }



//   const IsToAddressAnExchange = (data, exchangesAdd) => {
//     console.log("data = " + JSON.stringify(data))    
//     // console.log("exchange   =  " + Object.values(exchangesInPepeToken))
//     for (const datum in data["result"]){
//       // console.log(`data["result"][datum]=${data["result"][datum].confirmations}`)
//       // console.log("datum")
//       // console.log(datum + " " +data["result"][datum].to)          
//       console.log(JSON.stringify(data["result"][datum]))          
//       if (data["result"][datum].confirmations <=200){ // don't take too long ago data
//           // console.log(datum + " " +data["result"][datum].to)          
//           if (Object.values(exchangesAdd).includes(data["result"][datum].to)){
//               console.log("token sent to exchange!" + data["result"][datum].to)
//               setOffloadingWhale(data["result"][datum])
//               return true;
//           }
//       }
//     }
//     console.log(".")
//     // console.log("Whale haven't send token to any exchange")
//     return false;
// }



  const catchWhale = async (price, exchangesAdd, exchangesAddress) => {
    // const contractAddress = contractAddressRef.current.value;
    // const walletAddress = walletAddressRef.current.value;
    // console.log("catching whale...............")
    // console.log(`tokenAddress=${tokenAddress}`)

    const contractAddress=tokenAddress
    // console.log(`contractAddress=${contractAddress}`)
    const totalTransaction=25 // standard 
    
    if (contractAddress != "") {
      let url = "";
      url = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${contractAddress}&page=1&offset=${totalTransaction}&startblock=0&endblock=99999999&sort=desc&apikey=${import.meta.env.VITE_YourApiKeyToken}`  
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
          const toAddress = data["result"][datum].to

          // console.log(`data["result"][datum]=${data["result"][datum].confirmations}`)
          // console.log("datum")
          // console.log(datum + " " +data["result"][datum].to)          
          // console.log(JSON.stringify(data["result"][datum]))          

          // const date = new Date(data["result"][datum].timeStamp);
          // console.log(date);

          // console.log(`data["result"][datum].value=${data["result"][datum].value}`)
          const tokenDecimal= data["result"][datum].tokenDecimal
          // console.log(`tokenDecimal=${tokenDecimal}`)
          const decimalValue= (1.0/(Math.pow(10,tokenDecimal)))
          // console.log(`decimalValue=${decimalValue}`)
          // console.log(`Object.values(exchangesAdd) = `)
          // console.log(Object.values(exchangesAdd))
          // console.log(`typeof offloadingWhale=${typeof(offloadingWhale)}`)
          // console.log(`offloadingWhale[0]=${JSON.stringify(offloadingWhale)}`)

          if (data["result"][datum].confirmations <=200){ // don't take too long ago data

              
            // console.log(datum + " " + toAddress)          
            
            const block=Object.values(offloadingWhale).map(function(d){
              return d["blockNumber"]
            })
            // console.log(`block=${block}`)
            if (!block.includes(data["result"][datum].blockNumber)){
              const indexValue= Object.values(exchangesAdd).indexOf(toAddress)
              if (indexValue!=-1){
                console.log(datum + " " + toAddress)          
                console.log(`indexValue=${indexValue}`)
                console.log(`exchange address ${JSON.stringify(exchangesAddress[indexValue])}`)
              }
            }



              if (Object.values(exchangesAdd).includes(toAddress)){

                // console.log("includedddddddddddddddddddddddddddddddddddddddddddd")
                // console.log(`from=${data["result"][datum].from}`)
                // AMOUNT
                let amountInQty=decimalValue*data["result"][datum].value
                data["result"][datum].amountInQty=amountInQty
                console.log(`catchWhale price=${JSON.stringify(price)}`)
                let sumInDollar=price*amountInQty


                if (sumInDollar >=0){
                  sumInDollar= "$" + sumInDollar.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  console.log(`sumInDollar=${sumInDollar}`)

                  if (isNaN(sumInDollar)){
                    data["result"][datum].sumInDollar= "sync..."
                  }
                  else{
                    data["result"][datum].sumInDollar= sumInDollar;
                  }

                  // NAME OF EXCHANGE BEING SENT TO (CAN SHORT IN ANY EXCHANGES, FYI ONLY)
                  const indexAdd=Object.values(exchangesAdd).indexOf(toAddress)
                  const targetedExchangeName=exchangesAddress[indexAdd].name
                  // console.log(`indexAdd=${indexAdd}`)
                  // console.log(`targetedExchangeName=${targetedExchangeName}`)
                  data["result"][datum].targetedExchangeName= targetedExchangeName;


                  // console.log("token sent to exchange!" + data["result"][datum].to)
                  // console.log(`data["result"][datum]= ${JSON.stringify(data["result"][datum])}`)                   
                  // console.log(`blocknumber= ${JSON.stringify(data["result"][datum].blockNumber)}`)                   
                  
                  const block=Object.values(offloadingWhale).map(function(d){
                    return d["blockNumber"]
                  })
                  // console.log(`block=${block}`)
                  if (!block.includes(data["result"][datum].blockNumber)){
                    // playFoundWhaleSound()
                    const temp=offloadingWhale
                    // const temp=[]
                    temp.push(data["result"][datum])
                    setOffloadingWhale(temp)  
                  }
                }

                // console.log(`blocknumber from offload=${JSON.stringify(offloadingWhale)}`)
                // console.log(`offloadingWhale[0]=${JSON.stringify(offloadingWhale[0])}`)
              }
              // else{
              //   console.log("x")
              // }
          }
        }
        console.log("o")

      } else {
        console.log("an error has occurred");
      }
    } else {
      console.log("wrong entry, check again");
    }  
  } // end of catchWhale

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
            console.log(`price=${price}`)
            return price
          }
          console.log(".")
        }

        console.log("o")

      } else {
        console.log("an error has occurred");
      }
    } else {
      console.log("wrong entry, check again");
    }  
  } // end of cmcPriceApi 


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
          console.log(`coingecko data=${JSON.stringify(data)}`)
          let price=0.0
          
          for (const datum in data){
            price = data[datum].usd
          }        
          console.log(`coingeckoPriceApi price=${price}`)
          setTokenPrice(price)

          return price
          // for(const eachToken in data["data"][tokenName]){
          //   if (data["data"][tokenName][eachToken]["platform"]["token_address"]==tokenAddress){
          //     price=data["data"][tokenName][eachToken]["quote"]["USD"]["price"]  
          //     console.log(`price=${price}`)
          //     return price
          //   }
          //   console.log(".")
          // }

        } else {
          console.log("an error has occurred");
        }
      } else {
        console.log("wrong entry, check again");
      }  
    }
    catch (error){
      console.log("catching error" + error)
      console.log("retrying...") //but could use recursion next time

      // const url= `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${contractAdd}&vs_currencies=usd`      
      // const res = await fetch(url, {
      //   method: "GET",
      //   // mode: "cors",
      //   x_cg_pro_api_key: `${import.meta.env.VITE_CoinGeckoApiKey2}`
      // });

      // if (res.ok) {
      //   let data = await res.json();
      //   console.log(`coingecko data2=${JSON.stringify(data)}`)
      //   let price=0.0
        
      //   for (const datum in data){
      //     price = data[datum].usd
      //   }        
      //   console.log(`coingeckoPriceApi price2=${price}`)
      //   setTokenPrice(price)

      //   return price      
      // } else {
      //   console.log("an error has occurred");
      // }     
    }
  } // end of coingeckoPriceApi

  

  
  const getOffLoadingWhaleData = () => {
    const temp=[...offloadingWhale]
    setOffloadingWhale(temp)
  }

  const handleSelectChange = (event) => {
    console.log("select change ........................")

    // const selectedOptionData = event.target.options[event.target.selectedIndex]
    // console.log(selectedOptionData)

    const name = event.target.options[event.target.selectedIndex].dataset.name
    console.log(name)

    const address = event.target.options[event.target.selectedIndex].dataset.address
    console.log(address)
    
    setTokenSymbol(name)    
    setTokenAddress(address)
    // const price= cmcPriceApi(name)
    // console.log(`price=${price}`)
    // setTokenPrice(price)
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

  useEffect(() => {
    const controller = new AbortController();
    // console.log(`useEffect tokenPrice=${tokenPrice}`)


    return () => {
      // console.log("useEffect return");
      controller.abort();
    };
  }, [tokenPrice]);  

  // useEffect(() => {
  //   const controller = new AbortController();
  //   console.log(`useEffect stopLoop=${stopLoop}`)
  //   if (stopLoop===true){
  //     setStopLoop(true)
  //   }

  //   return () => {
  //     // console.log("useEffect return");
  //     controller.abort();
  //   };
  // }, [stopLoop]);

  function playSound(){
    console.log("play sound")
    var audio = new Audio('../../sound/money-button.mp3');
    audio.play();
  }

  function playFoundWhaleSound(){
    console.log("play sound")
    var audio = new Audio('../../sound/i-see-money-181273.mp3');
    audio.play();
  }  

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
      <ButtonCom handleBtnClick={stopLoopFunction}>
          Stop Loop
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
      {(stopLoop===true) && (<LabelCom>stop</LabelCom>)}
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
            // amountInQty={item.amountInQty}
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
