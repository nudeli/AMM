import { useState,useEffect } from 'react';
import abiAMM from "./contractJson/AMM.json";
import abiToken from "./contractJson/ERC20.json";
import {ethers} from "ethers";
import './App.css';
import { BrowserRouter } from "react-router-dom";
import Pages from './Pages/Pages';

function App() {
  const [state,setState]=useState({
    provider:null,
    signer:null,
    walletAddress:null,
    contractAMM:null,
    contractTokenOne:null,
    contractTokenTwo:null
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

      const contractAddressAMM = "0x20ab4E3083231F4851B0d5B7677181986242bC37";
      const contractAddressTokenOne = "0x4D8ec41B11aa0e21c998C53D1D43A72BCCf0Fe00";
      const contractAddressTokenTwo = "0xce70B60b9A2e75C7E803A926AFa98b0F63406D57";

      const contractAbiAMM = abiAMM.abi;
      const contractAbiToken = abiToken.abi
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
        const walletAddress = account[0]
        const provider = new ethers.providers.Web3Provider(ethereum);//read the Blockchain
        const signer =  provider.getSigner(); //write the blockchain
        
        const contractAMM = new ethers.Contract(
          contractAddressAMM,
          contractAbiAMM,
          signer
        );

        const contractTokenOne = new ethers.Contract(
          contractAddressTokenOne,
          contractAbiToken,
          signer
        );

        const contractTokenTwo = new ethers.Contract(
          contractAddressTokenTwo,
          contractAbiToken,
          signer
        );

        setState({provider,signer,walletAddress,contractAMM,contractTokenOne,contractTokenTwo});
       
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
