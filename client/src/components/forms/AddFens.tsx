import { LocationState } from "../../types";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Form, Input, Button } from "antd";
import Chessground from "@react-chess/chessground";

import axios from "axios";

import { toColor, toDests } from "../../utils/chessUtils";
import { Config } from "@react-chess/chessground/node_modules/chessground/config";
import { ChessInstance } from "chess.js";
const Chessjs = require("chess.js");

const { Title } = Typography;

const AddFens = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState; // Type Casting, then you can get the params passed via router

  const [chessConfig, setChessConfig] = useState<Partial<Config> | undefined>();
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
        });
      } catch (error) {
        console.log(error);
      }
    };

    post();
  };

  return (
    <>
      <h1>Study Name: {state.collectionName}</h1>
      <br />
      <h2>Author Name: {state.by}</h2>

      <Chessground config={{ fen: fen }} />

      <Form
        autoComplete="off"
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        onFinish={(values) => onAdd(values)}
        onFinishFailed={(error) => {
          console.log({ error });
          console.log(error);
        }}
      >
        <Form.Item
          name="fen"
          label="Fen"
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
            Add Position
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
        {positions.length > 0 && (
          <Button onClick={onSubmit}>Submit your Study</Button>
        )}
      </div>
    </>
  );
};

export default AddFens;
