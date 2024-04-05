import { useState,useEffect } from 'react';
import { ethers } from "ethers";
import "./Button.css";

function Swap({state}) {

    const [payAmount, setPayAmount]=useState('');
    const [receiveAmount, setReceiveAmount]=useState('');

    useEffect(() => {
        const getReceiveAmount = async () => {
            const {contractAMM, contractTokenOne, contractTokenTwo}=state;

            var swapDirection = document.querySelector("#swapType").value;

            if (payAmount > 0) {
                
                var contract;
                if (swapDirection == "t1t2") {
                    contract = contractTokenOne
                } else {
                    contract = contractTokenTwo
                }


                const bigNumberVal = ethers.utils.parseUnits(payAmount, 18);
                const amountOut = await contractAMM.calculateSwap(contract.address, bigNumberVal)
                const amountRec= ethers.utils.formatUnits(amountOut, 18);
                setReceiveAmount(amountRec)
            }

            else {
                setReceiveAmount('')
            }
        }

        getReceiveAmount();
    }, [payAmount]);

    const swap = async(event)=>{
        event.preventDefault();
        const {walletAddress, contractAMM, contractTokenOne, contractTokenTwo}=state;
        console.log(contractAMM);
        console.log(contractTokenOne);
        console.log(contractTokenTwo);
        console.log(walletAddress);

        var payAmount = document.querySelector("#payAmount").value;
        var swapDirection = document.querySelector("#swapType").value;

        if (payAmount === '' || payAmount <= 0 || isNaN(payAmount)) {
            alert("please enter a valid value for the amount of token 1 you would like to liquidate");
            return;
        }

        var contract;
        if (swapDirection == "t1t2") {
            contract = contractTokenOne
        } else {
            contract = contractTokenTwo
        }


        const balance = await contract.balanceOf(walletAddress)
        const balanceDec= ethers.utils.formatUnits(balance, 18);
        console.log(balanceDec)

        
        if (parseInt(payAmount) > balanceDec) {
            alert("You do not have enough tokens in your balance!");
            return;
        }


        const bigNumberVal = ethers.utils.parseUnits(payAmount, 18);
        const transaction = await contractAMM.swap(contract.address, bigNumberVal)
        transaction.wait();

        console.log(transaction);
        console.log("transaction is successful");
    }

    return <div className="container">
        <h1>SWAP TOKEN</h1>
        <p className="description">
            Choose the swap direction between tokens 1 and 2, and choose how much token to swap
        </p><br></br>
        <div className="form-container">
            <form onSubmit={swap}>
                <label for="guess">Swap Direction</label>
                <select id="swapType" name="Swap Direction">
                    <option value="t1t2">Token1 to Token2</option>
                    <option value="t2t1">Token2 to Token1</option>
                </select><br></br>
                <label for="payAmount">You pay:</label>
                <input id="payAmount" 
                       value={payAmount}
                       onChange={(e) => setPayAmount(e.target.value)}/>
                <br></br>
                <label for="receiveAmount">You receive:</label>
                <input id="receiveAmount" value={receiveAmount} disabled></input><br></br>
                <button class="button">Swap</button>
            </form>
        </div>
    </div>
}

export default Swap;
