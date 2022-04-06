import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Typography, Form, Input, Button } from "antd";
import Chessground from "@react-chess/chessground";

import { toColor, toDests } from "../../utils/chessUtils";
import { Config } from "@react-chess/chessground/node_modules/chessground/config";
import { ChessInstance } from "chess.js";
const Chessjs = require("chess.js");

const { Title } = Typography;

interface LocationState {
  collectionName: string;
  password: string | undefined;
  confirmPassword: string | undefined;
}

const AddFens = () => {
  const location = useLocation();
  const state = location.state as LocationState; // Type Casting, then you can get the params passed via router

  const [config, setConfig] = useState<Partial<Config> | undefined>();
  const [chess] = useState<ChessInstance>(
    new Chessjs("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  );

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

  const onSubmit = (values: any) => {
    setPositions((prev: any) => [...prev, values]);
  };
  useEffect(() => {
    console.log(positions);
  }, [positions]);
  return (
    <>
      <h1>Study Name: {state.collectionName}</h1>

      <Chessground config={{ fen: fen }} />
      {/* <label>Insert Fen:</label>
      <input
        type="text"
        value={fen}
        onChange={(e) => setFen(e.target.value)}
      ></input>
      <button
        onClick={() =>
          setConfig(() => {
            return { fen: fen };
          })
        }
      >
        Insert
      </button> */}
      <Form
        autoComplete="off"
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        onFinish={(values) => onSubmit(values)}
        onFinishFailed={(error) => {
          console.log({ error });
          console.log(error);
        }}
      >
        <Form.Item
          name="fen"
          label="Fen"
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
        <Form.Item wrapperCol={{ span: 24 }}>
          <Button block type="primary" htmlType="submit">
            Submit Position
          </Button>
        </Form.Item>
      </Form>
      <div>
        {positions.map((position: any, index: number) => (
          <div key={index}>
            <p>Fen: {position.fen}</p>
            <p>Description: {position.description}</p>
            <p>Answer: {position.san}</p>
            <br />
            <br />
          </div>
        ))}
      </div>
    </>
  );
};

export default AddFens;
