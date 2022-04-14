//todo: set a button that lets the user edit everything or delete if he has the password of the study

//todo: searchbar for Positions

//todo: cool edit ui
import Chessground from "@react-chess/chessground";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Button,
  Card,
  Col,
  Collapse,
  Form,
  Input,
  message,
  Modal,
  Row,
} from "antd";

const { Panel } = Collapse;

const boardWidth = 200;

const StudyId = () => {
  const [isLogged, setIsLogged] = useState(false);
  const { fenId } = useParams();
  const navigate = useNavigate();
  const [position, setPosition] = useState<any>();
  const [pass, setPass] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const { data } = await axios.get(`/api/fens/${fenId}`, config);
        setPosition(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetch();
  }, []);

  const onSubmitPassword = (values: any) => {
    const auth = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        message.loading({ content: "Loading...", key: "auth" });
        const { data } = await axios.post(`/api/fens/auth/${fenId}`, {
          config,
          private: values.password,
        });
        if (data.success) {
          message.success({
            content: "Autheticated!",
            key: "auth",
            duration: 2,
          });
          setIsLogged(true);
          setIsModalVisible(false);
        } else {
          message.error({
            content: "Provide a valid password!",
            key: "auth",
            duration: 2,
          });
        }
      } catch (error) {
        console.log(error);
        message.error({
          content: "Provide a valid password!",
          key: "auth",
          duration: 2,
        });
      }
    };

    auth();
  };

  const onStartGame = () => {
    navigate("play", { state: position });
  };

  if (position === undefined) return <h1>Loading...</h1>;
  return (
    <div>
      {!isLogged && (
        <>
          <Button
            type="primary"
            onClick={() => {
              setIsModalVisible(true);
            }}
          >
            Edit Study
          </Button>
          <Modal
            title="Add Position"
            visible={isModalVisible}
            onOk={() => setIsModalVisible(false)}
            onCancel={() => setIsModalVisible(false)}
          >
            <Form
              autoComplete="off"
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
              onFinish={onSubmitPassword}
              onFinishFailed={(error) => {
                console.log({ error });
                console.log(error);
              }}
            >
              <Form.Item
                name="password"
                label="Enter the study's password."
                rules={[
                  {
                    required: true,
                  },
                  { min: 6 },
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject("Password does not match criteria."),
                  },
                ]}
                hasFeedback
              >
                <Input.Password placeholder="Type your password" />
              </Form.Item>

              <Form.Item wrapperCol={{ span: 24 }}>
                <Button block type="primary" htmlType="submit">
                  Authenticate
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
      <h1>Study Name: {position.collection_name}</h1>
      <br />
      <h2>Author Name: {position.by}</h2>
      <h2>Number of positions to study: {position.fens.length}</h2>
      <div className="settings">
        <p>Hardcore mode?(todo)</p>
        <Button type="primary" onClick={onStartGame}>
          Play
        </Button>
      </div>
      <h1>Position inside this study:</h1>
      <Collapse>
        <Panel header="Positions" key="1">
          <Row>
            {position.fens?.map(
              (fen: {
                _id: string;
                fen: string;
                description: string;
                san: string;
              }) => (
                <Col xs={24} sm={12} lg={6} className="fen-card" key={fen._id}>
                  <Card>
                    <p>
                      <Chessground
                        height={boardWidth}
                        width={boardWidth}
                        config={{ fen: fen?.fen, coordinates: false }}
                      />
                    </p>
                    <p>
                      <strong>Description:</strong>
                      {fen.description}
                    </p>
                    <p>
                      <strong>Correct move:</strong>
                      {fen.san}
                    </p>
                  </Card>
                </Col>
              )
            )}
          </Row>
        </Panel>
      </Collapse>
    </div>
  );
};

export default StudyId;
