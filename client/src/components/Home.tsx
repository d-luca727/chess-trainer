import { Button } from "antd";

import { useNavigate } from "react-router-dom";
const logo = require("../imgs/logo2.jpg");
const Home = () => {
  const navigate = useNavigate();
  return (
    <div id="about" className="block aboutBlock">
      <div className="container-fluid">
        <br />
        <div className="titleHolder">
          <img src={logo}></img>
          <h1>Opening Trainer</h1>
          <p>The best way to learn openings</p>
        </div>
        <div className="contentHolder">
          <p style={{ textAlign: "center" }}>
            <Button onClick={() => navigate("play")}>Start Training!</Button>
          </p>
          <p style={{ textAlign: "center" }}>
            <a href="#" target="_blank">
              <Button>Get Started </Button>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
