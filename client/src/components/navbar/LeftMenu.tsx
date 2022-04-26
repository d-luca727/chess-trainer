import { Component } from "react";
import { Menu } from "antd";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
class LeftMenu extends Component {
  render() {
    return (
      <Menu mode="horizontal">
        <Menu.Item key="mail">
          <a href="/">Home</a>
        </Menu.Item>
        <Menu.Item key="play">
          <a href="/play">Play</a>
        </Menu.Item>
        <Menu.Item key="alipay">
          <a href="/about">About Us</a>
        </Menu.Item>
      </Menu>
    );
  }
}
export default LeftMenu;
