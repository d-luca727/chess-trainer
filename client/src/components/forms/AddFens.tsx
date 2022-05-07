import { Fens, LocationState } from "../../types";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Typography,
  Form,
  Input,
  Button,
  InputNumber,
  Row,
  Col,
  Card,
  Modal,
  Statistic,
  Space,
  message,
} from "antd";
import Chessground from "@react-chess/chessground";

import axios from "axios";

import { Config } from "@react-chess/chessground/node_modules/chessground/config";
import { ChessInstance } from "chess.js";
import { toColor } from "../../utils/chessUtils";

const Chessjs = require("chess.js");

const validFenRegex = new RegExp(
  /\s*([rnbqkpRNBQKP1-8]+\/){7}([rnbqkpRNBQKP1-8]+)\s[bw-]\s(([a-hkqA-HKQ]{1,4})|(-))\s(([a-h][36])|(-))\s\d+\s\d+\s*/
);

const AddFens = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState; // Type Casting, then you can get the params passed via router
  let by = state.by;

  if (state.by === "" || state.by === undefined) {
    by = "Anonymous";
  }

  const [chessConfig, setChessConfig] = useState<Partial<Config> | undefined>();
  const [chess] = useState<ChessInstance>(
    new Chessjs("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  );

  const [boardWidth, setBoardWidth] = useState(700);

  const [fen, setFen] = useState<string>(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [positions, setPositions] = useState<Fens[]>([]);

  //validate move
  const validateMove = (value: string) => {
    chess.load(fen);

    let _chess = chess;
    return _chess.move(value) !== null;
  };

  const onAdd = (values: Fens) => {
    //todo: fix this type
    setPositions((prev: any) => {
      if (values?.description === undefined) {
        values.description = "";
      }
      return [...prev, values];
    });

    message.success("Position added successfully");
    if (windowDimension >= 1800)
      window.scrollTo({
        top: 800,
        left: 0,
        behavior: "smooth",
      });
    else {
      window.scrollTo({
        top: 1500,
        left: 0,
        behavior: "smooth",
      });
    }
  };
  useEffect(() => {});
  const onSubmit = () => {
    //post request
    let data = {
      collection_name: state.collectionName,
      by: state.by,
      fens: positions,
      private: state.password,
    };

    const post = async () => {
      try {
        await axios.post("/api/fens", data).then((res) => {
          const id = res.data.data.id;

          navigate(`${id}`, { state: { id: id, password: state.password } });
          window.scrollTo(0, 0);
        });
      } catch (error) {
        console.log(error);
      }
    };

    post();
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
    <>
      <br></br>
      <Row>
        <Col span={windowDimension >= 1800 ? 6 : 24}>
          <div className="studyTitle card-statistics">
            <Card>
              <h1>
                <Statistic title="Study Title" value={state.collectionName} />
              </h1>

              <h2>
                <Statistic title="by" value={by} />
              </h2>
            </Card>
          </div>
        </Col>
        <Col
          span={windowDimension >= 1800 ? 10 : 24}
          style={{ paddingTop: 15, paddingBottom: 15 }}
        >
          <Card>
            <div style={{ textAlign: "center" }}>
              <h4>Board Preview</h4>
              {windowDimension > boardWidth && (
                <Space style={{ paddingTop: 10, paddingBottom: 10 }}>
                  <div>Resize Board:</div>
                  <InputNumber
                    defaultValue={100}
                    min={50}
                    max={100}
                    formatter={(value) => `${value}%`}
                    /*   parser={(value) => value.replace("%", "")} */
                    onChange={(value) => setBoardWidth(680 + (value - 100) * 3)}
                  />
                </Space>
              )}

              {windowDimension > boardWidth && (
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      margin: "0 auto",
                      height: boardWidth,
                      width: boardWidth,
                    }}
                  >
                    <Chessground
                      config={{
                        fen: fen,
                        orientation: toColor(chess),
                        viewOnly: true,
                      }}
                      contained
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
          {windowDimension <= boardWidth && (
            <div
              style={{
                textAlign: "center",
              }}
            >
              <div
                style={{
                  margin: "0 auto",
                  height: windowDimension,
                  width: windowDimension,
                }}
              >
                <Chessground
                  config={{
                    fen: fen,
                    orientation: toColor(chess),
                    viewOnly: true,
                  }}
                  contained
                />
              </div>
            </div>
          )}
        </Col>
        <Col style={{ padding: 20 }} span={windowDimension >= 1800 ? 8 : 24}>
          <Card title={"Add a Fen"}>
            <Form
              autoComplete="off"
              /*  labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }} */
              style={{
                paddingLeft:
                  windowDimension >= 1200 && windowDimension < 1800 ? 200 : 20,
                paddingRight:
                  windowDimension >= 1200 && windowDimension < 1800 ? 200 : 20,
              }}
              onFinish={(values) => onAdd(values)}
              onFinishFailed={(error) => {
                console.log({ error });
                console.log(error);
              }}
            >
              <Form.Item
                name="fen"
                label="Fen"
                tooltip="add a valid position in Forsyth-Edwards Notation"
                initialValue={
                  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                }
                rules={[
                  {
                    required: true,
                    message: "Please insert a position you want to study",
                  },
                  { whitespace: true },
                  {
                    validator: (_, value) =>
                      value && chess.validate_fen(value).valid
                        ? Promise.resolve()
                        : Promise.reject("Fen is not valid."),
                  },
                ]}
                hasFeedback
              >
                <Input
                  placeholder="Type the Position you want to study"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (validFenRegex.test(e.target.value) === true) {
                      setFen(e.target.value);
                      chess.load(e.target.value);
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                tooltip="add a description to understand the position better. It would be a good idea keeping it brief and simple."
                rules={[
                  {
                    required: false,
                  },
                  { min: 2 },
                ]}
                hasFeedback
              >
                <Input placeholder="Type an explanation of the answer" />
              </Form.Item>
              <Form.Item
                name="san"
                label="Answer in san"
                tooltip="The best move for the position. Make sure it is in precise san format."
                dependencies={["fen"]}
                rules={[
                  {
                    required: true,
                  },
                  {
                    validator(_, value) {
                      if (!value || validateMove(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject("This isn't a valid san.");
                    },
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Type the right move in san notation" />
              </Form.Item>
              <Form.Item>
                <div style={{ textAlign: "center" }}>
                  <Button type="primary" htmlType="submit">
                    Add Position
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
      <br></br>
      <hr></hr>
      <br></br>
      <h2 style={{ textAlign: "center" }}>Positions inside this study</h2>
      <div style={{ padding: "20px" }}>
        <Row gutter={[24, 24]}>
          {positions.map((position: Fens, index: number) => (
            <Col xs={24} sm={12} lg={6} className="fen-card" key={position._id}>
              <Card title={`${position.fen}. `} hoverable>
                <p>
                  <div className="collection-board">
                    <Chessground
                      contained
                      config={{
                        fen: position.fen,
                        coordinates: false,
                        viewOnly: true,
                      }}
                    />
                  </div>
                </p>
                <div style={{ textAlign: "center" }}>
                  <p>
                    <strong>Description:</strong> {position.description}
                  </p>
                  <p>
                    <strong>Answer:</strong> {position.san}
                  </p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <hr></hr>
      <br></br>
      <div style={{ textAlign: "center" }}>
        {positions.length > 0 && (
          <>
            If you have made a mistake you will be able to edit / delete any
            position in the next step.
            <br></br>
            <br></br>
            <Button type="primary" onClick={onSubmit}>
              Review your Study
            </Button>
          </>
        )}
      </div>
      <br></br>
      <br></br>
    </>
  );
};

export default AddFens;
