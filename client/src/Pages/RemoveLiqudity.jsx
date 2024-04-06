import { useState,useEffect } from 'react';
import { ethers } from "ethers";
import "./Button.css";

function RemoveLiquidity({state}) {

    const removeLiquidity = async(event)=>{
        event.preventDefault();
        const {walletAddress, contractAMM, contractTokenOne, contractTokenTwo}=state;
        console.log(contractAMM);
        console.log(walletAddress);

        const balance = await contractAMM.balanceOf(walletAddress)
        const transaction = await contractAMM.removeLiquidity(balance)
        transaction.wait();

        console.log(transaction);
        console.log("transaction is successful");
    }

    return <div className="container">
        <h1>REMOVE LIQUIDITY</h1>
        <div className="form-container">
            <form onSubmit={removeLiquidity}>
                <button class="button">Remove Liquidity</button>
            </form>
        </div>
    </div>
}

export default RemoveLiquidity;