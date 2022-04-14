//todo: validator for fens and move (from AddFens)

//sync fen's board with fen's FormInput field

import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { editLocationState } from "../../types";
import Chessground from "@react-chess/chessground";

import { Card, Row, Col, Button, message, Popconfirm, Modal } from "antd";
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
            setFens(() => {
              return fens.splice(index, 1);
            });
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
      <h1>Review your study</h1>
      <Button
        type="primary"
        onClick={() => {
          setIsModalVisible(true);
          setIndex(index);
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
          index={index}
          fen={"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"}
          san={""}
          setFen={setFen}
          setFens={setFens}
          password={password}
          id={id}
          type={"add"}
          setIsModalVisible={setIsModalVisible}
        />
      </Modal>

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
              <Card>
                <p>
                  <Chessground
                    height={boardWidth}
                    width={boardWidth}
                    config={{
                      fen: fen?.fen,
                      coordinates: false,
                      viewOnly: true,
                    }}
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
                <Button onClick={() => onDeleteFen(index)}>Delete</Button>

                <Button
                  type="primary"
                  onClick={() => {
                    setIsEditModalVisible(true);
                    setIndex(index);
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
                    index={index}
                    fen={fen.fen}
                    san={fen.san}
                    setFen={setFen}
                    setFens={setFens}
                    password={password}
                    id={id}
                    type={"edit"}
                    setIsModalVisible={setIsEditModalVisible}
                  />
                </Modal>
              </Card>
            </Col>
          )
        )}
      </Row>

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
    </>
  );
};

export default EditFens;
