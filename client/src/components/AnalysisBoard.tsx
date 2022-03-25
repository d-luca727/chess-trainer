import { toColor, toDests } from "../utils/chessUtils";
import React, { useEffect, useState, useRef } from "react";
import Chessground from "@react-chess/chessground";
import { ChessInstance, Move, ShortMove } from "chess.js";
import { Config } from "@react-chess/chessground/node_modules/chessground/config";

import Container from "react-bootstrap/Container";
import "../styles/style.css";
import { Col, Row } from "react-bootstrap";

const Chessjs = require("chess.js");

const PlayvsPlayer: React.FC = () => {
  const [chess] = useState<ChessInstance>(
    new Chessjs("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  );

  const [config, setConfig] = useState<Partial<Config> | undefined>({
    movable: {
      color: "white",
      free: false,
      dests: toDests(chess),
      events: {
        after: (orig: any, dest: any) => {
          const res = chess.move({ from: orig, to: dest }); //setting the chess.js object first
          setMoves([...moves, moves.push({ move: res?.san, config: config })]); //setting the moves for the analysis board
          setConfig((prevState) => {
            return {
              turnColor: toColor(chess), //toColor returns the player's color that has to move
              movable: {
                color: toColor(chess),
                dests: toDests(chess), //toDests sets the legal moves
              },
            };
          });
        },
      },
    },
    draggable: {
      showGhost: true,
    },
  });

  const [windowDimension, setWindowDimension] = useState(0);

  useEffect(() => {
    setWindowDimension(window.innerWidth);
  }, []);

  /*  useEffect(() => {
    if (move) setMoves([...moves, { move: move?.san, config: config }]);
  }, [move]); */

  useEffect(() => {
    function handleResize() {
      setWindowDimension(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowDimension <= 640;

  const [moves, setMoves] = useState<any>([]);

  return (
    <div>
      {isMobile ? (
        <Chessground
          width={windowDimension - 50}
          height={windowDimension - 50}
          config={config}
        />
      ) : (
        <Container>
          <Row>
            <Col>
              <Chessground
                width={windowDimension - 1200}
                height={windowDimension - 1200}
                contained={false}
                config={config}
              />
            </Col>

            <Col>
              <div>
                {moves &&
                  moves.map(
                    (
                      move: { move: any; config: any } | null | undefined,
                      index: number
                    ) =>
                      index % 2 === 0 ? (
                        <>
                          <span className="index">
                            {Math.floor(index / 2) + 1}.
                          </span>
                          <button
                            className="move-w"
                            onClick={() => setConfig(move?.config)}
                          >
                            {move?.move}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            key={index}
                            className="move-b"
                            onClick={() => setConfig(move?.config)}
                          >
                            ..{move?.move}
                          </button>
                          <br></br>
                        </>
                      )
                  )}
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default PlayvsPlayer;
