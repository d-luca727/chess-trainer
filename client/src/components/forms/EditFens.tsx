import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { LocationState } from "../../types";
import Chessground from "@react-chess/chessground";

import { Card, Row, Col, Button } from "antd";

const boardWidth = 150;

const EditFens = () => {
  const location = useLocation();
  const state = location.state as LocationState; // Type Casting, then you can get the params passed via router
  const [fens, setFens] = useState<any>([]);

  useEffect(() => {
    const fetch = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const { data } = await axios.get(`/api/fens/${state}`, config);
        setFens(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetch();
  }, []);
  return (
    <>
      <Row gutter={[24, 24]}>
        {fens?.map(
          (fen: {
            _id: React.Key | null | undefined;
            collection_name: any;
            by: any;
            fens: string | any[];
          }) => (
            <Col xs={24} sm={12} lg={6} className="fen-card" key={fen._id}>
              <Link to={`/study/${fen._id}`}>
                <Card
                  title={`${fen.collection_name}. `}
                  extra={`by ${fen.by}. `}
                  hoverable
                >
                  <p>
                    {fen?.fens[0] !== undefined ? (
                      <Chessground
                        height={boardWidth}
                        width={boardWidth}
                        config={{ fen: fen?.fens[0].fen, coordinates: false }}
                      />
                    ) : (
                      <Chessground
                        height={boardWidth}
                        width={boardWidth}
                        config={{ coordinates: false }}
                      />
                    )}
                  </p>
                  <p>Number of Positions to study: {fen.fens.length}</p>
                </Card>
              </Link>
            </Col>
          )
        )}
      </Row>
    </>
  );
};

export default EditFens;
