import { Component, useEffect, useState } from "react";
import LeftMenu from "./LeftMenu";
import RightMenu from "./RightMenu";
import { Button, Drawer } from "antd";

const logo = require("../../imgs/logo.jpg");
const Navbar = () => {
  const [visible, setVisible] = useState<boolean>(false);

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
  //resposonsive stuff
  const [windowDimension, setWindowDimension] = useState(0);

  useEffect(() => {
    setWindowDimension(window.innerWidth);
  }, []);

  useEffect(() => {
    function handleResize() {
      setWindowDimension(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="menuBar">
      <div className="logo">
        <a href="/">
          <img height={70} width={70} src={logo}></img>
        </a>
      </div>

      <div className="menuCon">
        {windowDimension > 660 && (
          <>
            <div className="leftMenu">
              <LeftMenu />
            </div>
            <div className="rightMenu">{/* <RightMenu /> */}</div>
          </>
        )}

        {windowDimension <= 660 && (
          <Button className="barsMenu" type="default" onClick={showDrawer}>
            <span style={{ marginBottom: 4 }} className="barsBtn"></span>
          </Button>
        )}
        <Drawer
          title="Opening Trainer"
          placement="right"
          closable={false}
          onClose={onClose}
          visible={visible}
          width={windowDimension - 150}
        >
          <p>
            <a href="/">Home</a>
          </p>

          <p>
            {" "}
            <a href="/play">Play</a>
          </p>

          <p>
            <a href="/about">About Us</a>
          </p>
          {/* <RightMenu /> */}
        </Drawer>
      </div>
    </nav>
  );
};
export default Navbar;
