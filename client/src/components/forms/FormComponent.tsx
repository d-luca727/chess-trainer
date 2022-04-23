//todo: to fix the epic gamer form modal bug use refreshPage() in combo with the LocalStorage to not make the user log out

import React, { useState } from "react";
import Chessground from "@react-chess/chessground";
import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { ChessInstance } from "chess.js";
const Chessjs = require("chess.js");

interface PropsInterface {
  fen?: string;
  description?: string;
  san?: string;
  fens?: [];
  setFens(arg: any): void;
  password: string | undefined;
  id: string;
  type: "add" | "edit";
  index?: number;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormComponent = (props: PropsInterface) => {
  //validate move
  let {
    fen,
    setFens,
    password,
    id,
    san,
    type,
    fens,
    index,
    description,

    setIsModalVisible,
  } = props;
  const [chess] = useState<ChessInstance>(
    new Chessjs("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  );

  function refreshPage() {
    window.location.reload();
  }

  const [_fen, setFen] = useState<string>(fen as string);

  const validateMove = (value: string) => {
    chess.load(_fen);
    let _chess = chess;
    return _chess.move(value) !== null;
  };

  //on edit modal
  const onEditFen = (values: any) => {
    const editFen = async () => {
      try {
        await axios
          .put(`/api/fens/edit/${id}`, {
            private: password,
            san: values.san,
            fen: values.fen,
            description: values.description,
            index: index,
          })
          .then((res) => {
            setFens(res.data.data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    editFen();
  };
  //on Add
  const onAddFen = (values: any) => {
    console.log(values);
    const editFen = async () => {
      try {
        await axios
          .put(`/api/fens/edit/fen/${id}`, {
            private: password,
            san: values.san,
            fen: values.fen,
            description: values.description,
          })
          .then((res) => {
            setFens(res.data.data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    editFen();
  };
  return (
    <div>
      <Form
        autoComplete="off"
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        initialValues={{ fens }}
        onFinish={(values) => {
          if (type === "add") {
            onAddFen(values);
            message.success(`Position added successfully`);
          } else {
            onEditFen(values);
            message.success(`Position edited successfully`);
          }
          setIsModalVisible(false);
        }}
        onFinishFailed={(error) => {
          console.log({ error });
          console.log(error);
        }}
      >
        <Form.Item
          name="fen"
          label="Fen"
          tooltip="add a valid position in Forsyth-Edwards Notation"
          initialValue={_fen}
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
          initialValue={description}
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
          tooltip="the best move for the position."
          dependencies={["fen"]}
          initialValue={san}
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
        <a href={`https://lichess.org/analysis/${_fen}`} target={"_blank"}>
          <div style={{ margin: "0 auto", width: "400px", height: "400px" }}>
            <Chessground
              contained
              config={{ fen: _fen, coordinates: false, viewOnly: true }}
            />
          </div>
        </a>
        <br />
        <br />

        <Form.Item wrapperCol={{ span: 24 }}>
          <Button block type="primary" htmlType="submit">
            {/* {type === "add" ? "Add" : "Edit"} Position */}
            Save Position
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormComponent;
