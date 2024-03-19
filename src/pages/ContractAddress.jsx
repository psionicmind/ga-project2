import React, { useEffect, useState, useRef} from "react";
import Address from "./Address";
import {exchangesArray, contractAddressList, tokenNames} from "./exchangesAddress.js";
import LabelCom from "../components/LabelCom.jsx";
import InputCom from "../components/InputCom.jsx";
import ButtonCom from "../components/ButtonCom.jsx";
export let userDefinedAddressList = []


const ContractAddress = () => {
  const [defaultAddress, setDefaultAddress] = useState([]);
  const [userDefined, setUserDefined] = useState([]);
  const [isFirstTimeLoading, setIsFirstTimeLoading] = useState(true)
  const addressRef = useRef();
  const tagRef = useRef();

  
  const getData = () => {
    getLocalData()   
    getServerUpdate(); // airtable data

  };

  const getLocalData = () => {
    const temp=[...contractAddressList]
    setDefaultAddress(temp);
  }

  // create a record in airtable using useRef from two edit box
  const createRecordInServer = async (signal) => {
    try {
      const url =`https://api.airtable.com/v0/appau3qeDmEuoOXAq/contractAddress`     

      const res = await fetch(url, {
        signal, 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_AirtableApiToken}`,
        },
        body: JSON.stringify({
          "records": [
            {
              "fields": {
                "name": `${tagRef.current.value}`,
                "address": `${addressRef.current.value}`
              }
            }            
          ]
        }),        
      });

      if (res.ok) {

        // append to temp variable of state and set to state.
        let tempList=[...userDefined, {id:"", name: `${tagRef.current.value}`, address: `${addressRef.current.value}`}]
        userDefinedAddressList = [...tempList]

        const temp=[...tempList]
        setUserDefined(temp);        

      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.log(error.message);
      }
    }
  }


  const getOfflineServerData = ()=> {
    const temp=[...userDefined]
    userDefinedAddressList=[...temp]
    setUserDefined(temp)
  }

  // get airtable data to useState (userDefined)
  const getServerUpdate = async (signal) => {
    try {
      const url =`https://api.airtable.com/v0/appau3qeDmEuoOXAq/contractAddress`

      const res = await fetch(url, {
        signal, 
        headers:{"Authorization": `Bearer ${import.meta.env.VITE_AirtableApiToken}`}
      });

      if (res.ok) {        
        const data = await res.json();

        let nameOfRecord=""
        let addressOfRecord=""
        let id=""

        let tempList=[]
        for (const record in data.records){
          id = data.records[record].id
          nameOfRecord = data.records[record].fields.name
          addressOfRecord=data.records[record].fields.address

          tempList.push({id:`${id}`,name: `${nameOfRecord}`, address: `${addressOfRecord}`})
        }

        userDefinedAddressList=[...tempList]
        const temp=[...tempList]
        setUserDefined(temp);        

      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.log(error.message);
      }
    }
  }

  // create record in airtable
  // create a placeholder in exchangesArray for new token's 
  // exchanges list to be used in WALLET tab.
  const setDataToAirTable = () => {

    // for airtable
    createRecordInServer()
    exchangesArray.push([])

    // increment tokenName (that are used to reference token's place in exchangesArray (e.g. 0,1,2....))
    tokenNames[tagRef.current.value] = Object.keys(tokenNames).length // increment value

    return true;

  }

  // use useRef from two edit box to be used in createRecordInServer, 
  // which is inside setDataToAirTable. adding address to airtbable
  const addAddress = () => {    
    const tag = tagRef.current.value; // obsolete and to be delete after check later
    const address = addressRef.current.value;

    // basic business logic check
    if (address != "") {    
      if (setDataToAirTable()){
        getServerUpdate(); // airtable data
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
    const controller = new AbortController();

    // this if else is not useful; to be delete after testing
    if (isFirstTimeLoading === false){
      console.log("******************not first time loading")
      getData()
    }
    else{
      //first time loading
      console.log("+++++++++++++++++++first time loading")
      getData()
      setIsFirstTimeLoading(false)
    }

    return () => {
      controller.abort();
    };
  }, []);

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
      </div>
      <br/>
      <br/>
      
      <LabelCom>Local Contract Address</LabelCom>
      {defaultAddress.map((item, idx) => {
        return (
          <Address
            key={idx}
            // id={item.id}
            name={item.name}
            address={item.address}
            getData={getLocalData}
          />
        );
      })}
      <br/>
      <LabelCom>User Defined Contract Address</LabelCom>
      {userDefined.map((item, idx) => {
        return (
          <Address
            key={idx}
            // id={item.id}
            name={item.name}
            address={item.address}
            getData={getServerUpdate}
          />
        );
      })}


      <br />
      <br />
    </div>
  );
};

export default ContractAddress;
