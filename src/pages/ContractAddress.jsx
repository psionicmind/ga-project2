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
    console.log("getData @ ContractAddress.jsx");
    getLocalData()   
    getServerUpdate(); // airtable data

  };

  const getLocalData = () => {
    console.log("getting local data")
    const temp=[...contractAddressList]
    setDefaultAddress(temp);
  }

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


  const getServerUpdate = async (signal) => {
    console.log("getting server data from airtable")
    try {
      const url =`https://api.airtable.com/v0/appau3qeDmEuoOXAq/contractAddress`

      const res = await fetch(url, {
        signal, 
        headers:{"Authorization": `Bearer ${import.meta.env.VITE_AirtableApiToken}`}
      });

      if (res.ok) {        
        const data = await res.json();
        // console.log(data.records.length)
        // console.log(data.records)

        let nameOfRecord=""
        let addressOfRecord=""
        let id=""
        // console.log("ready")

        let tempList=[]
        for (const record in data.records){
          id = data.records[record].id
          nameOfRecord = data.records[record].fields.name
          addressOfRecord=data.records[record].fields.address

          // console.log(id)
          // console.log(nameOfRecord)
          // console.log(addressOfRecord)
          tempList.push({id:`${id}`,name: `${nameOfRecord}`, address: `${addressOfRecord}`})
        }

        console.log("see lah")
        console.log(tempList)
        userDefinedAddressList=[...tempList]
        console.log(userDefinedAddressList)

        const temp=[...tempList]

        setUserDefined(temp);        

      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.log(error.message);
      }
    }
  }

  const setDataToAirTable = () => {
    console.log("setDataToAirTable")

    // for airtable
    createRecordInServer()

    console.log("creating new array in exchangesArray")
    exchangesArray.push([])

    // tokenNames.push(tagRef.current.value)
    console.log(Object.keys(tokenNames).length)
    tokenNames[tagRef.current.value] = Object.keys(tokenNames).length // increment value
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
    console.log("useEffect")
    const controller = new AbortController();

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
  // }, [userDefined]);

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
