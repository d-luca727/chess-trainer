//todo : fix addPosition fen is undefined bug

import React, { useEffect, useState } from "react";
import Chessground from "@react-chess/chessground";
import { Button, Form, FormInstance, Input, message } from "antd";
import axios from "axios";
import { ChessInstance } from "chess.js";
import { toColor } from "../../utils/chessUtils";

const Chessjs = require("chess.js");

const { Item } = Form;

interface PropsInterface {
  form?: FormInstance;
  setFens(arg: any): void;
  password: string | undefined;
  id: string;
  type: "add" | "edit";
  index?: number;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isModalVisible?: boolean;
}

const FormComponent = (props: PropsInterface) => {
  //validate move
  const { form, setFens, password, id, type, index, setIsModalVisible } = props;

  const [chess] = useState<ChessInstance>(
    new Chessjs("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  );

  const [_fen, setFen] = useState<string>("");

  const validateMove = (value: string) => {
    chess.load(_fen as string);
    let _chess = chess;
    return _chess.move(value) !== null;
  };

  console.log("inside form component");
  console.log(form?.getFieldValue("fen"));
  //setting the fen based on the form hook
  useEffect(() => {
    /*  setFen(form?.getFieldValue("fen")); */
    /* chess.load(form?.getFieldValue("fen")); */
  }, [form]);

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
        form={form}
        autoComplete="off"
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
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
          tooltip="the best move for the position."
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
        {/* <a href={`https://lichess.org/analysis/${_fen}`} target={"_blank"}>
          <div style={{ margin: "0 auto", width: "400px", height: "400px" }}>
            <Chessground
              contained
              config={{
                fen: type === "edit" ? form?.getFieldValue("fen") : _fen,
                orientation: toColor(chess),
                coordinates: true,
                viewOnly: true,
              }}
            />
          </div>
        </a>
        <br />
        <br /> */}
        <Item shouldUpdate noStyle>
          {() => {
            let fen =
              "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
            if (type === "edit") fen = form?.getFieldValue("fen");

            chess.load(fen);

            return (
              <div
                style={{ margin: "0 auto", width: "400px", height: "400px" }}
              >
                <Chessground
                  contained
                  config={{
                    fen,
                    coordinates: true,
                    viewOnly: true,
                    orientation: toColor(chess),
                  }}
                />
              </div>
            );
          }}
        </Item>
        <br></br>
        <br></br>
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
