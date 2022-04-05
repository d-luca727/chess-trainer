import React, { useState, useEffect } from "react";
import axios from "axios";
import Chessground from "@react-chess/chessground";
import { Link } from "react-router-dom";
import { Card, Row, Col, Input } from "antd";

const boardWidth = 150;

const Collections = () => {
  const [fens, setFens] = useState<any>([]);
  useEffect(() => {
    const fetch = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const { data } = await axios.get("/api/fens", config);
        setFens(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetch();
  }, []);
  if (fens.length === 0) return <>"loading..."</>;
  return (
    <>
      <Row gutter={[24, 24]} className="fens-card-container">
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
                        config={{ fen: fen?.fens[0].fen }}
                      />
                    ) : (
                      <Chessground height={boardWidth} width={boardWidth} />
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

export default Collections;
