import AddLiquidity from "./AddLiqudity";
import RemoveLiquidity from "./RemoveLiqudity";
import Home from "./Home";
import { Route, Routes } from "react-router-dom";
import Swap from "./Swap";

function Pages({state}) { 

    return (
        <Routes>
          <Route path="/" element={<Home state={state} />} />
          <Route path="/AddLiquidity" element={<AddLiquidity state={state} />} />
          <Route path="/RemoveLiquidity" element={<RemoveLiquidity state={state} />} />
          <Route path="/Swap" element={<Swap state={state} />} />
        </Routes>
    );
}

export default Pages;