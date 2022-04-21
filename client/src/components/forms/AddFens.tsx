import { LocationState } from "../../types";
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
} from "antd";
import Chessground from "@react-chess/chessground";

import axios from "axios";

import { toColor, toDests } from "../../utils/chessUtils";
import { Config } from "@react-chess/chessground/node_modules/chessground/config";
import { ChessInstance } from "chess.js";
import FormComponent from "./FormComponent";
const Chessjs = require("chess.js");

const { Title } = Typography;

const AddFens = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState; // Type Casting, then you can get the params passed via router
  let by = state.by;
  if (state.by === "") {
    by = "Anonymous";
  }

  const [chessConfig, setChessConfig] = useState<Partial<Config> | undefined>();
  const [chess] = useState<ChessInstance>(
    new Chessjs("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  );

  const [boardWidth, setBoardWidth] = useState(700);

  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [positions, setPositions] = useState<any>([]);

  //validate move
  const validateMove = (value: string) => {
    chess.load(fen);
    let _chess = chess;
    return _chess.move(value) !== null;
  };

  const onAdd = (values: any) => {
    setPositions((prev: any) => {
      if (values.description === undefined) {
        values.description = "";
      }
      return [...prev, values];
    });
  };

  const onSubmit = (values: any) => {
    //post request
    let data: any = {
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

  return (
    <>
      <br></br>
      <Row gutter={[16, 16]}>
        <Col span={6}>
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
        <Col span={10}>
          <Card>
            <div style={{ textAlign: "center" }}>
              Resize Board:{" "}
              <InputNumber
                defaultValue={100}
                min={50}
                max={115}
                formatter={(value) => `${value}%`}
                /*   parser={(value) => value.replace("%", "")} */
                onChange={(value) => setBoardWidth(700 + (value - 100) * 3)}
              />
              <div
                style={{
                  margin: "0 auto",
                  height: boardWidth,
                  width: boardWidth,
                  marginTop: 10,
                }}
              >
                <Chessground contained config={{ fen: fen, viewOnly: true }} />
              </div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title={"Add a Fen"}>
            <Form
              autoComplete="off"
              /*  labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }} */
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
                    setFen(e.target.value);
                    chess.load(e.target.value);
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
      <br></br>
      <Row gutter={[24, 24]}>
        {positions.map((position: any, index: number) => (
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
                  <strong>Answer:</strong>: {position.san}
                </p>
                {/* <Button onClick={() => onDeleteStudy(fen._id)}>Delete</Button> */}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <hr></hr>
      <br></br>
      <div style={{ textAlign: "center" }}>
        If you have made a mistake you will be able to edit / delete any
        position in the next step.
        <br></br>
        <br></br>
        {positions.length > 0 && (
          <Button type="primary" onClick={onSubmit}>
            Review your Study
          </Button>
        )}
      </div>
    </>
  );
};

export default AddFens;
