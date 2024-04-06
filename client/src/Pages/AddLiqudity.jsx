import { useState,useEffect } from 'react';
import { ethers } from "ethers";
import "./Button.css";

function AddLiquidity({state}) {

    const addLiquidity = async(event)=>{
        event.preventDefault();
        const {walletAddress, contractAMM, contractTokenOne, contractTokenTwo}=state;
        console.log(contractAMM);
        console.log(contractTokenOne);
        console.log(contractTokenTwo);
        console.log(walletAddress);

        var token1 = document.querySelector("#token1").value;
        var token2 = document.querySelector("#token2").value;

        if (token1 === '' || token1 <= 0 || isNaN(token1)) {
            alert("please enter a valid value for the amount of token 1 you would like to liquidate");
            return;
        }

        if (token2 === '' || token2 <= 0 || isNaN(token2)) {
            alert("please enter a valid value for the amount of token 2 you would like to liquidate");
            return;
        }

        const balanceOne = await contractTokenOne.balanceOf(walletAddress)
        const balanceTwo = await contractTokenTwo.balanceOf(walletAddress)
        const balanceOneDec= ethers.utils.formatUnits(balanceOne, 18);
        const balanceTwoDec= ethers.utils.formatUnits(balanceTwo, 18);
        
        if (parseInt(token1) > balanceOneDec) {
            alert("You do not have enough token 1 in your balance!");
            return;
        }

        if (parseInt(token2) > balanceTwoDec) {
            alert("You do not have enough token 2 in your balance!");
            return;
        }

        const allowanceOne = await contractTokenOne.allowance(walletAddress, contractAMM.address);
        const allowanceTwo = await contractTokenTwo.allowance(walletAddress, contractAMM.address);

        const amount = ethers.utils.parseUnits("1000", 18);

        if (allowanceOne.eq(0)) {
            const tx = await contractTokenOne.approve(contractAMM.address, amount);
            await tx.wait();
            console.log('Approval successful!');
        } else {
            console.log('Allowance already set. Skipping approval.');
        }

        if (allowanceTwo.eq(0)) {
            const tx = await contractTokenTwo.approve(contractAMM.address, amount);
            await tx.wait();
            console.log('Approval successful!');
        } else {
            console.log('Allowance already set. Skipping approval.');
        }

        const bigNumberOne = ethers.utils.parseUnits(token1, 18);
        const bigNumberTwo = ethers.utils.parseUnits(token2, 18);
        const transaction = await contractAMM.addLiquidity(bigNumberOne, bigNumberTwo)
        transaction.wait();

        console.log(transaction);
        console.log("transaction is successful");
    }

    return <div className="container">
        <h1>ADD LIQUIDITY</h1>
        <p className="description">
            Enter the amount of token1 and token2 you would like to provide
        </p><br></br>
        <div className="form-container">
            <form onSubmit={addLiquidity}>
                <label for="token 1 amount">Token1 Amount:</label>
                <input id="token1"></input><br></br>
                <label for="token 2 amount">Token2 Amount:</label>
                <input id="token2"></input><br></br>
                <button class="button">Add Liquidity</button>
            </form>
        </div>
    </div>
}

export default AddLiquidity;
