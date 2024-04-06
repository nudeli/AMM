import { useState,useEffect } from 'react';
import { ethers } from "ethers";
import "./Button.css";

function RemoveLiquidity({state}) {

    const removeLiquidity = async(event)=>{
        event.preventDefault();
        const {walletAddress, contractAMM}=state;
        console.log(contractAMM);
        console.log(walletAddress);

        var ltToken= document.querySelector("#LTToken").value;

        if (ltToken === '' || ltToken <= 0 || isNaN(ltToken)) {
            alert("please enter a valid value for the amount of liqudity token you would like to return");
            return;
        }

        const balance = await contractAMM.balanceOf(walletAddress)
        const balanceDec= ethers.utils.formatUnits(balance, 18);
        
        if (parseInt(ltToken) > balanceDec) {
            alert("You do not have enough liquidity token in your balance");
            return;
        }

        const bigNumber = ethers.utils.parseUnits(ltToken, 18);

        const transaction = await contractAMM.removeLiquidity(bigNumber)
        transaction.wait();

        console.log(transaction);
        console.log("transaction is successful");
    }

    return <div className="container">
        <h1>REMOVE LIQUIDITY</h1>
        <p className="description">
            Enter the amount of Liquidity Token you would like to return
        </p><br></br>
        <div className="form-container">
            <form onSubmit={removeLiquidity}>
                <label for="LT token amount">Liquidity Token Amount:</label>
                <input id="LTToken"></input><br></br>
                <button class="button">Remove Liquidity</button>
            </form>
        </div>
    </div>
}

export default RemoveLiquidity;