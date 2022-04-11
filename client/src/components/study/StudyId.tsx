//todo: set a button that lets the user edit everything or delete if he has the password of the study
import Chessground from "@react-chess/chessground";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button, Card, Col, Collapse, Row } from "antd";

const { Panel } = Collapse;

const boardWidth = 200;

const StudyId = () => {
  const { fenId } = useParams();
  const navigate = useNavigate();
  const [position, setPosition] = useState<any>();

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
      } catch (error) {
        console.log(error);
      }
    };

    fetch();
  }, []);

  const onStartGame = () => {
    navigate("play", { state: position });
  };

  if (position === undefined) return <h1>Loading...</h1>;
  return (
    <div>
      <h1>Study Name: {position.collection_name}</h1>
      <br />
      <h2>Author Name: {position.by}</h2>
      <h2>Number of positions to study: {position.fens.length}</h2>
      <div className="settings">
        <p>settings...</p>
        <Button type="primary" onClick={onStartGame}>
          Play
        </Button>
      </div>
      <h1>Fens</h1>
      <Collapse>
        <Panel header="Positions" key="1">
          <Row>
            {position.fens?.map(
              (fen: {
                _id: string;
                fen: string;
                description: string;
                san: string;
              }) => (
                <Col xs={24} sm={12} lg={6} className="fen-card" key={fen._id}>
                  <Card>
                    <p>
                      <Chessground
                        height={boardWidth}
                        width={boardWidth}
                        config={{ fen: fen?.fen, coordinates: false }}
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
                  </Card>
                </Col>
              )
            )}
          </Row>
        </Panel>
      </Collapse>
      ,
    </div>
  );
};

export default StudyId;
