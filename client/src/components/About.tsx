import React from "react";

import { Row, Col, Typography } from "antd";
import "../styles/about.css";
const { Title, Text } = Typography;
const About = () => {
  const items = [
    {
      key: "1",
      icon: <i className="fas fa-chart-pie"></i>,
      title: "Play and learn",
      content: "yadayada.",
    },
    {
      key: "2",
      icon: <i className="fas fa-desktop"></i>,
      title: "Create your own study",
      content: " yafadat",
    },
    {
      key: "3",
      icon: <i className="fas fa-database"></i>,
      title: "share on lcihess",
      content: "ddd.",
    },
  ];
  return (
    <div id="about" className="block aboutBlock">
      <div className="container-fluid">
        <div className="titleHolder">
          <Title>About Opening Trainer</Title>
          <p>The best chess training platformm!!</p>
        </div>
        <div className="contentHolder">
          <p>Opening trainer is epic!</p>
        </div>
        <Title className={"titleHolder"}>Features</Title>
        <Row gutter={[16, 16]}>
          {items.map((item) => {
            return (
              <Col md={{ span: 8 }} key={item.key}>
                <div className="content">
                  <div className="icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.content}</p>
                </div>
              </Col>
            );
          })}
        </Row>
        <Title className={"titleHolder"}>About Us</Title>
        This website is made entirely by Daniele Luca, reach me through github
        or linkedin. --bottone github--bottone linkedin
      </div>
    </div>
  );
};

export default About;
