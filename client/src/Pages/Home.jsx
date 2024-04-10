import { NavLink } from "react-router-dom";
import { ethers } from "ethers";
import './Home.css';

function Home({state}) {

    const mintTokens = async()=>{
        const {walletAddress, contractTokenOne, contractTokenTwo}=state;

        const bigNumberVal = ethers.utils.parseUnits("100", 18);
        const transactionOne = await contractTokenOne.mint(walletAddress, bigNumberVal)
        transactionOne.wait();
    }

    return (
        <div className="home-container">
            <h1>AMM</h1>
            <p className="wallet-instruction">
                You'll first need a Metamask wallet connected to Ethereum's Sepolia Testnet and funds.
            </p>
            {/* Insert your code for buttons here */}
            <div className="buttons-container">
                <NavLink to={"/AddLiquidity"} className="nav-button">
                    Add Liqudity
                </NavLink>
                <NavLink to={"/RemoveLiquidity"} className="nav-button">
                    Remove Liqudity
                </NavLink>
                <NavLink to={"/Swap"} className="nav-button">
                    Swap Token
                </NavLink>
            </div><br></br>
            <button className="mint-button" onClick={mintTokens}>Mint Tokens</button>
        </div>
    );
}

export default Home;