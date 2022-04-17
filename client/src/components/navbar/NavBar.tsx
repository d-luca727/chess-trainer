import { Component } from "react";
import LeftMenu from "./LeftMenu";
import RightMenu from "./RightMenu";
import { Drawer } from "antd";
class Navbar extends Component {
  state = {
    current: "mail",
    visible: false,
  };
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };
  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  render() {
    return (
      <nav className="menuBar">
        <div className="logo">
          <a href="/home">Opening Trainer</a>
        </div>
        <div className="menuCon">
          <div className="leftMenu">
            <LeftMenu />
          </div>
          <div className="rightMenu">{/* <RightMenu /> */}</div>

          <Drawer
            title="Basic Drawer"
            placement="right"
            closable={false}
            onClose={this.onClose}
            visible={this.state.visible}
          >
            <LeftMenu />
            {/* <RightMenu /> */}
          </Drawer>
        </div>
      </nav>
    );
  }
}
export default Navbar;
