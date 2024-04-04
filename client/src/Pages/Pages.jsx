import Home from "./Home";
import { Route, Routes } from "react-router-dom";

function Pages({state}) { 

    return (
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
    );
}

export default Pages;