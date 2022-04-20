import {
  GithubOutlined,
  LinkedinOutlined,
  RadarChartOutlined,
  RiseOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Row, Col, Typography } from "antd";
import "../styles/about.css";
const { Title, Text } = Typography;
const About = () => {
  const items = [
    {
      key: "1",
      icon: <RiseOutlined />,
      title: "Play and Learn",
      content:
        "Enjoy our game modes for a more interactive learning experience.",
    },
    {
      key: "2",
      icon: <RadarChartOutlined />,
      title: "Create your own study",
      content: "Create, edit and delete your own studies ",
    },
    {
      key: "3",
      icon: <ShareAltOutlined />,
      title: "Share on Lichess",
      content:
        "With just a click you can share any study or poistion with everyone on lichess, for optimal interoperability.",
    },
  ];
  return (
    <div id="about" className="block aboutBlock">
      <div className="container-fluid">
        <br />
        <div className="titleHolder">
          <h1>Opening Trainer</h1>
          <p>The best way to learn openings</p>
        </div>
        <div className="contentHolder">
          <p></p>
        </div>
        <hr></hr>
        <h1 className="studyTitle">Features</h1>
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
        <hr></hr>
        <br></br>
        <Title className={"titleHolder"}>About Us</Title>
        <div className="studyTitle">
          This website is made entirely by Daniele Luca, reach me through github
          or linkedin.
          <br></br>
          <br></br>
          <br></br>
          <Row gutter={[16, 16]}>
            <Col span={6}></Col>
            <Col span={6}>
              <a
                href="https://github.com/Proioxis4/opening-trainer"
                target={"_blank"}
              >
                <GithubOutlined className="social-icons" />
              </a>
            </Col>
            <Col span={6}>
              {" "}
              <a href="" target={"_blank"}>
                <LinkedinOutlined className="social-icons" />
              </a>
            </Col>
            <Col span={6}></Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default About;
