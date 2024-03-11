import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import WhaleCatcher from "./pages/WhaleCatcher";
import NavBar from "./components/NavBar";
import ContractAddress from "./pages/ContractAddress";
import WalletAddress from "./pages/WalletAddress";

function App() {
  return (
    <>
    <NavBar></NavBar>
    <Routes>
      <Route path='/' element={<Navigate replace to='/WhaleCatcher'/>}/>
      <Route path='WhaleCatcher' element={<WhaleCatcher />} />
      <Route path='ContractAddress' element={<ContractAddress />} />
      <Route path='WalletAddress' element={<WalletAddress />} />

      <Route path='*' element={<></>} />
    </Routes>    
    </>
  )
}

export default App;
