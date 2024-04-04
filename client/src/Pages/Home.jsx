import { NavLink } from "react-router-dom";
import './Home.css';

function Home() {
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
                <NavLink to={"/Swap"} className="nav-button">
                    Swap Token
                </NavLink>
            </div>
        </div>
    );
}

export default Home;