//todo: set a button that lets the user edit everything or delete if he has the password of the study

//todo: searchbar for Positions

//todo: cool edit ui

//todo: bug 'k is not defined chessground' when typing random stuff
import Chessground from "@react-chess/chessground";

import axios from "axios";
import { useEffect, useState } from "react";
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

import { EditOutlined } from "@ant-design/icons";
import FormComponent from "../forms/FormComponent";

const { Panel } = Collapse;

const boardWidth = 200;

const StudyId = () => {
  const [isLogged, setIsLogged] = useState(false);
  const { fenId } = useParams();
  const navigate = useNavigate();

  //state
  const [fens, setFens] = useState<any>([]);
  const [position, setPosition] = useState<any>();
  const [pass, setPass] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditPositionModalVisible, setIsEditPositionModalVisible] =
    useState(false);
  const [index, setIndex] = useState(0);

  //edit inputs
  const [IsStudyNameClicked, setIsStudyNameClicked] = useState(false);
  const [studyName, setStudyName] = useState("");
  const [IsAuthNameClicked, setIsAuthNameClicked] = useState(false);
  const [authName, setAuthName] = useState("");
  console.log(position);

  const editStudyNameHandler = () => {
    const editName = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const { data } = await axios.put(`/api/fens/`, {
          collection_name: studyName,
          _id: fenId,
          private: pass,
        });
        setPosition((prev: any) => ({ ...prev, collection_name: studyName }));
      } catch (error) {
        console.log(error);
      }
    };

    editName();
    setIsStudyNameClicked(false);
  };

  const editAuthorNameHandler = () => {
    const editName = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const { data } = await axios.put(`/api/fens/`, {
          by: authName,
          _id: fenId,
          private: pass,
        });
        setPosition((prev: any) => ({ ...prev, by: authName }));
      } catch (error) {
        console.log(error);
      }
    };

    editName();
    setIsAuthNameClicked(false);
  };

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
        setFens(data.data.fens);
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
          setPass(values.password);
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
      {/* log in */}
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
      <h1>
        {IsStudyNameClicked ? (
          <>
            Study Name:
            <Input
              value={studyName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setStudyName(e.target.value)
              }
            ></Input>
            <Button onClick={editStudyNameHandler}>Edit</Button>
          </>
        ) : (
          <>
            Study Name: {position.collection_name}{" "}
            {isLogged && (
              <Button
                onClick={() => {
                  setIsStudyNameClicked(true);
                  setStudyName(position.collection_name);
                }}
              >
                <EditOutlined />
              </Button>
            )}
          </>
        )}
      </h1>
      <br />
      <h2>
        {IsAuthNameClicked ? (
          <>
            Author Name:
            <Input
              value={authName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAuthName(e.target.value)
              }
            ></Input>
            <Button onClick={editAuthorNameHandler}>Edit</Button>
          </>
        ) : (
          <>
            Author Name: {position.by}
            {isLogged && (
              <Button
                onClick={() => {
                  setIsAuthNameClicked(true);
                  setAuthName(position.by);
                }}
              >
                <EditOutlined />
              </Button>
            )}
          </>
        )}
      </h2>
      <h2>Number of positions to study: {fens.length}</h2>
      <div className="settings">
        <p>Hardcore mode?(todo)</p>
        <Button type="primary" onClick={onStartGame}>
          Play
        </Button>
      </div>
      <h1>Position inside this study:</h1>
      <Collapse>
        <Panel header="Positions" key="1">
          {isLogged && (
            <>
              <Button
                type="primary"
                onClick={() => {
                  setIsAddModalVisible(true);
                }}
              >
                Add Position
              </Button>
              <Modal
                title="Add Position"
                visible={isAddModalVisible}
                onOk={() => setIsAddModalVisible(false)}
                onCancel={() => setIsAddModalVisible(false)}
              >
                {/* formcomponent */}
                <FormComponent
                  fen={
                    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                  }
                  san={""}
                  setFens={setFens}
                  password={pass}
                  id={fenId as string}
                  type={"add"}
                  setIsModalVisible={setIsAddModalVisible}
                />
              </Modal>
            </>
          )}
          <Row>
            {fens?.map(
              (
                fen: {
                  _id: string;
                  fen: string;
                  description: string;
                  san: string;
                },
                index: number
              ) => (
                <Col xs={24} sm={12} lg={6} className="fen-card" key={fen._id}>
                  <Card>
                    <p>
                      <a
                        href={`https://lichess.org/analysis/${fen.fen}`}
                        target={"_blank"}
                      >
                        <Chessground
                          height={boardWidth}
                          width={boardWidth}
                          config={{
                            fen: fen?.fen,
                            coordinates: false,
                            viewOnly: true,
                          }}
                        />
                      </a>
                    </p>
                    <p>
                      <strong>Description:</strong>
                      {fen.description}
                    </p>
                    <p>
                      <strong>Correct move:</strong>
                      {fen.san}
                    </p>
                    <p>
                      {" "}
                      {isLogged && (
                        <>
                          <Button
                            onClick={() => {
                              setIsEditPositionModalVisible(true);
                              setIndex(index);
                            }}
                          >
                            <strong>Edit Position</strong> <EditOutlined />
                          </Button>
                          <Modal
                            title="Edit Position"
                            visible={isEditPositionModalVisible}
                            onOk={() => setIsEditPositionModalVisible(false)}
                            onCancel={() =>
                              setIsEditPositionModalVisible(false)
                            }
                          >
                            {/* formcomponent */}
                            <FormComponent
                              index={index}
                              fen={fen.fen}
                              san={fen.san}
                              setFens={setFens}
                              password={pass}
                              id={fenId as string}
                              type={"edit"}
                              setIsModalVisible={setIsEditPositionModalVisible}
                            />
                          </Modal>
                        </>
                      )}
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
