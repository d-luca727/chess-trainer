//todo: validator for fens and move (from AddFens)

//sync fen's board with fen's FormInput field

import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { editLocationState } from "../../types";
import Chessground from "@react-chess/chessground";

import {
  Card,
  Row,
  Col,
  Button,
  message,
  Popconfirm,
  Modal,
  Space,
  Form,
} from "antd";
import FormComponent from "./FormComponent";
import { ChessInstance } from "chess.js";
const Chessjs = require("chess.js");

const boardWidth = 150;

const EditFens = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, password } = location.state as editLocationState; // Type Casting, then you can get the params passed via router

  const [index, setIndex] = useState<any>();
  console.log(id, password);

  //chess form things
  const [chess] = useState<ChessInstance>(
    new Chessjs("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  );
  const [_fen, setFen] = useState("");
  const [fens, setFens] = useState<any>([]);

  const [form] = Form.useForm();

  //prove
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  //fetching initial fens
  useEffect(() => {
    const fetch = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const { data } = await axios.get(`/api/fens/${id}`, config);
        setFens(data.data.fens);
      } catch (error) {
        console.log(error);
      }
    };

    fetch();
  }, []);

  //on delete
  const onDeleteFen = (index: number) => {
    const deleteFen = async () => {
      console.log("ciao");
      try {
        await axios
          .put(`/api/fens/${id}`, { index: index, private: password })
          .then((res) => {
            setFens(res.data.data);
            console.log("success!");
          });
      } catch (error) {
        console.log(error);
        //todo: add error handling for when there is a problem like SetError
      }
    };

    deleteFen();
  };

  //on submit
  const onSubmitStudy = () => {
    navigate(`/study/${id}`);
  };
  //ondiscard
  const onDiscardStudy = () => {
    console.log("helo");
    const deleteStudy = async () => {
      try {
        await axios
          .put(`/api/fens/delete/${id}`, {
            private: password,
          })
          .then((res) => {
            navigate("/play");
          });
      } catch (error) {
        console.log(error);
      }
    };

    deleteStudy();
  };

  /* if (fens.length === 0) return <h1>Loading...</h1>; */
  return (
    <>
      <br></br>
      <h1 style={{ textAlign: "center" }}>Review your study</h1>
      <hr></hr>
      <div style={{ padding: 15 }}>
        <Button
          type="primary"
          onClick={() => {
            setIsModalVisible(true);
            form.resetFields();
          }}
        >
          Add Position
        </Button>
        <Modal
          title="Add Position"
          visible={isModalVisible}
          onOk={() => setIsModalVisible(false)}
          onCancel={() => setIsModalVisible(false)}
        >
          {/* formcomponent */}
          <FormComponent
            form={form}
            setFens={setFens}
            password={password}
            id={id}
            type={"add"}
            setIsModalVisible={setIsModalVisible}
            isModalVisible={isModalVisible}
          />
        </Modal>

        <br></br>
        <br></br>

        <Row gutter={[24, 24]}>
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
                <Card title={fen.fen}>
                  <div style={{ textAlign: "center" }}>
                    <p>
                      <a
                        href={`https://lichess.org/analysis/${fen.fen}`}
                        target={"_blank"}
                      >
                        <div className="collection-board">
                          <Chessground
                            contained
                            config={{
                              fen: fen?.fen,
                              coordinates: false,
                              viewOnly: true,
                            }}
                          />
                        </div>
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
                    <Space>
                      <Button onClick={() => onDeleteFen(index)}>Delete</Button>

                      <Button
                        type="primary"
                        onClick={() => {
                          form.setFieldsValue(fen);
                          setIndex(index);
                          setFen(fen.fen);
                          setIsEditModalVisible(true);
                        }}
                      >
                        Edit Position
                      </Button>
                      <Modal
                        title="Edit Position"
                        visible={isEditModalVisible}
                        onOk={() => setIsEditModalVisible(false)}
                        onCancel={() => setIsEditModalVisible(false)}
                      >
                        {/* formcomponent */}

                        <FormComponent
                          form={form}
                          index={index}
                          setFens={setFens}
                          password={password}
                          id={id}
                          type={"edit"}
                          setIsModalVisible={setIsEditModalVisible}
                          isModalVisible={isEditModalVisible}
                        />
                      </Modal>
                    </Space>
                  </div>
                </Card>
              </Col>
            )
          )}
        </Row>
      </div>

      <br></br>
      <br></br>
      <div style={{ textAlign: "center" }}>
        <Space>
          <Popconfirm
            title="Are you sure you want to submit this study?"
            onConfirm={onSubmitStudy}
          >
            <Button type="primary">Submit Study</Button>
          </Popconfirm>

          <Popconfirm
            title="Are you sure you want to discard all the changes?"
            onConfirm={() => onDiscardStudy()}
          >
            <Button danger>Discard Study</Button>
          </Popconfirm>
        </Space>
      </div>
    </>
  );
};

export default EditFens;
