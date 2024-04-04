import { useState,useEffect } from 'react';
import abi from "./contractJson/AMM.json";
import {ethers} from "ethers";
import './App.css';
import { BrowserRouter } from "react-router-dom";
import Pages from './Pages/Pages';

function App() {
  const [state,setState]=useState({
    provider:null,
    signer:null,
    contract:null
  })

  const appStyle = {
    backgroundImage: "url('background.png')",
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh' // Ensures the background covers the whole viewport height
  };

  const [account,setAccount]=useState('Not connected');
  useEffect(()=>{
    const template=async()=>{

      const contractAddres = "0xb4e33EAbf996fBD9F963DB9EF7230c83Aa1Ac9C2";
      const contractABI=abi.abi;
      //Metamask part
      //1. In order do transactions on goerli testnet
      //2. Metmask consists of infura api which actually help in connectig to the blockhain
      try{

        const {ethereum}=window;
        const account = await ethereum.request({
          method:"eth_requestAccounts"
        })
 
        window.ethereum.on("accountsChanged", ()=>{
          window.location.reload()
        })
        setAccount(account);
        const provider = new ethers.providers.Web3Provider(ethereum);//read the Blockchain
        const signer =  provider.getSigner(); //write the blockchain
        
        const contract = new ethers.Contract(
          contractAddres,
          contractABI,
          signer
        );

        setState({provider,signer,contract});
       
      }catch(error){
        console.log(error)
      }
    }
    template();
  },[])

  function convertHexToEthPrice(hexValue) {
    // Convert the hexadecimal value to a BigNumber
    const weiValue = ethers.BigNumber.from(hexValue);
    var decimalNumber = Number(hexValue);
    console.log(decimalNumber);

    // Convert the value from wei to ether
    const ethPrice = ethers.utils.formatUnits(decimalNumber,12);

    return ethPrice;
}


  return (
    <>
      <div className='App' style={appStyle}>
        <BrowserRouter>
          {/* <h3>Connected Account: {account} </h3> */}
          <Pages state={state} />
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
