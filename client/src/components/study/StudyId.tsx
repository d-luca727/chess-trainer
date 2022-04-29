//todo: complex searchbar for Positions

//todo: cool edit ui

//todo: bug 'k is not defined chessground' when typing random stuff

import Chessground from "@react-chess/chessground";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import FormComponent from "../forms/FormComponent";
import {
  Button,
  Card,
  Col,
  Collapse,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Typography,
} from "antd";
import Loader from "../../utils/Loader";
import { Fens, PlayState } from "../../types";

const boardWidth = 200;

const StudyId = () => {
  const [isLogged, setIsLogged] = useState(false);
  const { fenId } = useParams();
  const navigate = useNavigate();

  //state
  const [position, setPosition] = useState<PlayState>();
  const [fens, setFens] = useState<Fens[]>([]);
  const [pass, setPass] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditPositionModalVisible, setIsEditPositionModalVisible] =
    useState(false);

  //for edit formcomponent
  const [form] = Form.useForm();
  const [_index, setIndex] = useState(0);
  const [_fen, setFen] = useState("");
  const [san, setSan] = useState("");
  const [description, setDescription] = useState("");

  //edit inputs
  const [IsStudyNameClicked, setIsStudyNameClicked] = useState(false);
  const [studyName, setStudyName] = useState("");
  const [IsAuthNameClicked, setIsAuthNameClicked] = useState(false);
  const [authName, setAuthName] = useState("");

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
        //fix this type
        setPosition((prev: any) => ({ ...prev, collection_name: studyName }));
      } catch (error) {
        console.error(error);
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
        //fix this type
        setPosition((prev: any) => ({
          ...prev,
          by: authName,
        }));
      } catch (error) {
        console.error(error);
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
        console.error(error);
      }
    };

    fetch();
  }, []);

  const onSubmitPassword = (values: { password: string }) => {
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
        console.error(error);
        message.error({
          content: "Provide a valid password!",
          key: "auth",
          duration: 2,
        });
      }
    };

    auth();
  };

  const onDeleteStudy = () => {
    const deleteStudy = async () => {
      try {
        await axios
          .put(`/api/fens/delete/${fenId}`, {
            private: pass,
          })
          .then((res) => {
            navigate("/play");
          });
      } catch (error) {
        console.error(error);
      }
    };

    deleteStudy();
  };

  const onStartGame = () => {
    navigate("play", { state: position });
  };

  if (position === undefined || fens.length === 0) return <Loader />;
  return (
    <div style={{ padding: "10px" }}>
      {/* log in */}
      <Row gutter={[16, 16]}>
        <Col sm={{ span: 4 }}>
          {isLogged && (
            <div style={{ textAlign: "center" }}>
              <Popconfirm
                title="Are you sure you want to delete this study?"
                onConfirm={() => onDeleteStudy()}
              >
                <Button danger>Delete Study</Button>
              </Popconfirm>
            </div>
          )}
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 24 }}>
          <div className={"editStudyButton"}>
            {!isLogged && (
              <>
                <Button
                  type="primary"
                  onClick={() => {
                    setIsModalVisible(true);
                  }}
                >
                  Edit Study
                  <EditOutlined />
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
                      console.error({ error });
                      console.error(error);
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
                              : Promise.reject(
                                  "Password does not match criteria."
                                ),
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
          </div>
          <div className="titleHolder">
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
                  {position.collection_name}{" "}
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
            <h2>
              {IsAuthNameClicked ? (
                <>
                  by:
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
                  by: {position.by}
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
          </div>
        </Col>
        <Col span={4}></Col>

        <Col span={4}></Col>
        <Col xs={{ span: 24 }} sm={{ span: 24 }}>
          <div className={"settings-container"}>
            <h2>Number of positions to study: {fens.length}</h2>
            <br />

            {/*   <label>Hardcore mode?todo</label>
            <Checkbox />
            <br /> */}

            <Button type="primary" onClick={onStartGame}>
              Play
            </Button>
          </div>
        </Col>
        <Col span={4}></Col>
      </Row>

      <br />
      <div className={"settings-container"}>
        <h1>Positions inside this study:</h1>

        {isLogged && (
          <>
            <Button
              type="primary"
              onClick={() => {
                setIsAddModalVisible(true);
                form.resetFields();
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
                form={form}
                setFens={setFens}
                password={pass}
                id={fenId as string}
                type={"add"}
                setIsModalVisible={setIsAddModalVisible}
                isModalVisible={isModalVisible}
              />
            </Modal>
            <br />
            <br />
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
              <Col
                xs={24}
                xl={12}
                xxl={6}
                className="card-statistics"
                key={fen._id}
              >
                <Card title={fen.fen}>
                  <p>
                    <a
                      href={`https://lichess.org/analysis/${fen.fen}`}
                      target={"_blank"}
                    >
                      <div
                        style={{
                          margin: "0 auto",
                          width: boardWidth,
                          height: boardWidth,
                        }}
                      >
                        <Chessground
                          contained
                          config={{
                            fen: fen?.fen,
                            coordinates: false,
                            orientation:
                              fen?.fen.split(" ")[1] === "w"
                                ? "white"
                                : "black",
                            viewOnly: true,
                          }}
                        />
                      </div>
                    </a>
                  </p>
                  {/* <p>
                    <strong>Description:</strong>
                    {fen.description}
                  </p>
                  <p>
                    <strong>Correct move:</strong>
                    {fen.san}
                  </p> */}
                  <p>
                    {" "}
                    {isLogged && (
                      <>
                        <p>
                          <strong>Description:</strong>
                          {fen.description}
                        </p>
                        <p>
                          <strong>Correct move:</strong>
                          {fen.san}
                        </p>
                        <Button
                          onClick={() => {
                            form.setFieldsValue(fen);
                            setIndex(index);
                            setFen(fen.fen);
                            setIsEditPositionModalVisible(true);
                          }}
                        >
                          <strong>Edit Position</strong> <EditOutlined />
                        </Button>
                      </>
                    )}
                  </p>
                </Card>
              </Col>
            )
          )}

          <Modal
            title="Edit Position"
            visible={isEditPositionModalVisible}
            onOk={() => {
              setIsEditPositionModalVisible(false);
            }}
            onCancel={() => {
              setIsEditPositionModalVisible(false);
            }}
          >
            {/* formcomponent */}

            <FormComponent
              form={form}
              index={_index}
              setFens={setFens}
              password={pass}
              id={fenId as string}
              type={"edit"}
              setIsModalVisible={setIsEditPositionModalVisible}
              isModalVisible={isEditPositionModalVisible}
            />
          </Modal>
        </Row>
      </div>
    </div>
  );
};

export default StudyId;
