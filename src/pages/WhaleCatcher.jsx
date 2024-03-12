import React, { useEffect, useState, useRef } from "react";
import Address from "./Address";
import WalletAddress from "./WalletAddress";

const WhaleCatcher = () => {
  const [users, setUsers] = useState([]);
  const [catchingWhale, setCatchingWhale] = useState([]);
  const [languages, setLanguages] = useState([]);
  const contractAddressRef = useRef();
  const walletAddressRef = useRef();

  const exchangesInPepeToken = { //exchanges in pepe token
    "binance8":"0xF977814e90dA44bFA03b6295A0616a897441aceC",
    "binance14":"0x28C6c06298d514Db089934071355E5743bf21d60",
    "binance15":"0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549",
    "binance16":"0xDFd5293D8e347dFe59E90eFd55b2956a1343963d",
    "binance28": "0x5a52E96BAcdaBb82fd05763E25335261B270Efcb",
    "binance41":"0x294B9B133cA7Bc8ED2CdD03bA661a4C6d3a834D9",
    "OKX": "0x6cC5F688a315f3dC28A7781717a9A798a59fDA7b",
    "Bybit":"0xf89d7b9c864f589bbF53a82105107622B35EaA40",
    "crypto.com5":"0xCFFAd3200574698b78f32232aa9D63eABD290703",
    "crypto.com6":"0xf3B0073E3a7F747C7A38B36B805247B222C302A3",
    "kraken33":"0x16B2b042f15564Bb8585259f535907F375Bdc415",
    "kucoin5":"0x1692E170361cEFD1eb7240ec13D048Fd9aF6d667",
    "kucoin6":"0xD6216fC19DB775Df9774a6E33526131dA7D19a2c",
    "kucoin15":"0xb8e6D31e7B212b2b7250EE9c26C56cEBBFBe6B23",
    "kucoin20":"0x58edF78281334335EfFa23101bBe3371b6a36A51",
    "mexc3":"0x3CC936b795A188F0e246cBB2D74C5Bd190aeCF18",
    "coinspot":"0xf35A6bD6E0459A4B53A27862c51A2A7292b383d1",
    "uphold2":"0x3D8FC1CFfAa110F7A7F9f8BC237B73d54C4aBf61",
    "bitget5":"0x5bdf85216ec1e38D6458C870992A69e38e03F7Ef",
    "gemini4":"0x5f65f7b609678448494De4C87521CdF6cEf1e932",
    "gate.io5":"0xC882b111A75C0c657fC507C04FbFcD2cC984F071",
    "gate.io":"0x0D0707963952f2fBA59dD06f2b425ace40b492Fe",
    "huobirecovery":"0x18709E89BD403F470088aBDAcEbE86CC60dda12e",
    "indodax3":"0x91Dca37856240E5e1906222ec79278b16420Dc92",
    "Paribu5":"0x9acbB72Cf67103A30333A32CD203459c6a9c3311",
    "bitstamp":"0x48EC5560bFD59b95859965cCE48cC244CFDF6b0c",
    "coinone":"0x167A9333BF582556f35Bd4d16A7E80E191aa6476",
    "coinhako.warmwallet":"0xE66BAa0B612003AF308D78f066Bbdb9a5e00fF6c",
    "uniswapv3 pepe4":"0x11950d141EcB863F01007AdD7D1A342041227b58",
    "coinsquare23":"0xd093F2Ee92cf32B4D3EBefd965447415074DD6c8",
    "lbank.hotwallet":"0x120051a72966950B8ce12eB5496B5D1eEEC1541B",
    "korbit8":"0xf0bc8FdDB1F358cEf470D63F96aE65B1D7914953",
    "bitrue":"0x6cc8dCbCA746a6E4Fdefb98E1d0DF903b107fd21",
    "bitfinex.hotwallet":"0x77134cbC06cB00b66F4c7e623D5fdBF6777635EC",
    "coindcx2":"0x2407b9B9662d970ecE2224A0403D3B15c7e4D1FE",
    "bitfinex2":"0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    "test":"0x61ab3d3637f27573bc5409f219cba6841e7bd18c",
  }    

  
  const exchangesInShibaInuToken = { //exchanges in shiba inu token
    "crypto.com6":"0xf3B0073E3a7F747C7A38B36B805247B222C302A3",
    "binance8":"0xF977814e90dA44bFA03b6295A0616a897441aceC",
    "binance14":"0x28C6c06298d514Db089934071355E5743bf21d60",
    "binance28": "0x5a52E96BAcdaBb82fd05763E25335261B270Efcb",
    "binance15":"0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549",
    "binance16":"0xDFd5293D8e347dFe59E90eFd55b2956a1343963d",
    "binance42":"0x5D7F34372FA8708E09689D400A613EeE67F75543",
    "robinhood":"0x40B38765696e3d5d8d9d834D8AaD4bB6e418E489",
    "robinhood2":"0x2eFB50e952580f4ff32D8d2122853432bbF2E204",
    "OKX": "0x6cC5F688a315f3dC28A7781717a9A798a59fDA7b",
    "coinspot2":"0x19184aB45C40c2920B0E0e31413b9434ABD243eD",
    "crypto.com3":"0x72A53cDBBcc1b9efa39c834A540550e23463AAcB",
    "gate.io5":"0xC882b111A75C0c657fC507C04FbFcD2cC984F071",
    "kraken17":"0x6d0Cf1F651f5Ae585d24DcaA188d44E389E93D26",
    "crypto.com5":"0xCFFAd3200574698b78f32232aa9D63eABD290703",
    "gate.io3":"0x1C4b70a3968436B9A0a9cf5205c787eb81Bb558c",
    "kucoin6":"0xD6216fC19DB775Df9774a6E33526131dA7D19a2c",
    "Bybit":"0xf89d7b9c864f589bbF53a82105107622B35EaA40",
    "bitFlyer":"0x111cFf45948819988857BBF1966A0399e0D1141e",
    "mexc3":"0x3CC936b795A188F0e246cBB2D74C5Bd190aeCF18",
    "huobirecovery":"0x18709E89BD403F470088aBDAcEbE86CC60dda12e",
    "coindcx2":"0x2407b9B9662d970ecE2224A0403D3B15c7e4D1FE",
    "indodax3":"0x91Dca37856240E5e1906222ec79278b16420Dc92",
    "uphold2":"0x3D8FC1CFfAa110F7A7F9f8BC237B73d54C4aBf61",
    "crypto.com":"0x6262998Ced04146fA42253a5C0AF90CA02dfd2A3",
    "coinone":"0x167A9333BF582556f35Bd4d16A7E80E191aa6476",
    "gate.io":"0x0D0707963952f2fBA59dD06f2b425ace40b492Fe",
    "gemini4":"0x5f65f7b609678448494De4C87521CdF6cEf1e932",
    "coinspot":"0xf35A6bD6E0459A4B53A27862c51A2A7292b383d1",
    "bitget5":"0x5bdf85216ec1e38D6458C870992A69e38e03F7Ef",

    "binanceUS3":"0xf60c2Ea62EDBfE808163751DD0d8693DCb30019c",
    "coindcx3":"0x3698cc7F524BAde1a05e02910538F436a3E94384",
    "binance41":"0x294B9B133cA7Bc8ED2CdD03bA661a4C6d3a834D9",
    "coinhako.oldwarmwallet":"0xF2d4766Ad705e3A5C9ba5b0436b473085F82f82f",
    "korbit3":"0x8550E644D74536f1DF38B17D5F69aa1BFe28aE86",
    "bitfinex2":"0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    "lbank.hotwallet":"0x120051a72966950B8ce12eB5496B5D1eEEC1541B",
    "korbit7":"0xE83a48CaE4d7120e8bA1C2E0409568fFBA532E87",
    "coinbase10":"0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43",
    "kucoin20":"0x58edF78281334335EfFa23101bBe3371b6a36A51",
    "kucoin15":"0xb8e6D31e7B212b2b7250EE9c26C56cEBBFBe6B23",
    "crypto.com2":"0x46340b20830761efd32832A74d7169B29FEB9758",
    "korbit5":"0xd6e0F7dA4480b3AD7A2C8b31bc5a19325355CA15",
    "okx27":"0xD7efCbB86eFdD9E8dE014dafA5944AaE36E817e4",
  }
// "jumptrading":"0xf584F8728B874a6a5c7A8d4d387C9aae9172D621",


  const IsToAddressAnExchange = async (data) => {
    console.log("exchange=" + Object.values(exchangesInPepeToken))
    for (datum in data["result"]){
      console.log(`data["result"][datum]=${data["result"][datum].confirmations}`)
      if (data["result"][datum].confirmations <=20){ // don't take too long ago data
          console.log(datum + " " +data["result"][datum].to)          
          if (Object.values(exchangesInPepeToken).includes(data["result"][datum].to)){
              console.log("token sent to exchange!" + data["result"][datum].to)
              return true;
          }
      }
    }
    console.log("Whale haven't send token to any exchange")
    return false;
}
  
  const catchWhale = async () => {
    const contractAddress = contractAddressRef.current.value;
    const walletAddress = walletAddressRef.current.value;
  

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
        data = JSON.stringify(data)
        setCatchingWhale(data);

        IsToAddressAnExchange(data)
        console.log(`data= ${data}`)
        // console.log(`token name = ${Object.values(data[0]["result"][0].tokenName)}`)
        // console.log(`message= ${Object.values(data["result"])}`)

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
        <label>0x6982508145454Ce325dDbE47a25d4ec3d2311933</label>
        <input
          type="text"
          ref={contractAddressRef}
          placeholder="Enter Contract Address / Token "
          // placeholder="0x6982508145454Ce325dDbE47a25d4ec3d2311933"
          className="col-md-6"
        ></input>
      </div>
      <div className="row">
        <label>0x28C6c06298d514Db089934071355E5743bf21d60</label>
        <input
          type="text"
          ref={walletAddressRef}
          placeholder="To which Crypto Exchange Wallet Address"
          // placeholder="0x28C6c06298d514Db089934071355E5743bf21d60"
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
