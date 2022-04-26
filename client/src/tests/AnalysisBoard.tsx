import { toColor, toDests } from "../utils/chessUtils";
import React, { useEffect, useState, useRef, SetStateAction } from "react";
import Chessground from "@react-chess/chessground";
import { ChessInstance, Move, ShortMove } from "chess.js";
import { Config } from "@react-chess/chessground/node_modules/chessground/config";

import Container from "react-bootstrap/Container";
import "../styles/style.css";
import { Col, Row } from "react-bootstrap";

const Chessjs = require("chess.js");

const PlayvsPlayer: React.FC = () => {
  //functions

  function updateBoard(chess: ChessInstance, fen?: string | undefined) {
    setConfig(() => {
      return {
        turnColor: toColor(chess), //toColor returns the player's color that has to move
        movable: {
          color: toColor(chess),
          dests: toDests(chess), //toDests sets the legal moves
        },
      };
    });

    setConfig(() => {
      return { fen: fen };
    });
  }

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

          updateBoard(chess);

          setMove(res as Move);
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

  useEffect(() => {
    function handleResize() {
      setWindowDimension(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowDimension <= 640;

  const [moves, setMoves] = useState<any>([]);
  const [move, setMove] = useState<Move>();

  useEffect(() => {
    if (move)
      setMoves((state: any) => [
        ...state,
        { move: move?.san, chess: chess, fen: chess.fen() },
      ]);
  }, [move]);

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
                      move:
                        | { move: any; chess: any; fen: any }
                        | null
                        | undefined,
                      index: number
                    ) =>
                      index % 2 === 0 ? (
                        <>
                          <span className="index">
                            {Math.floor(index / 2) + 1}.
                          </span>
                          <button
                            className="move-w"
                            onClick={() => updateBoard(move?.chess, move?.fen)}
                          >
                            {move?.move}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            key={index}
                            className="move-b"
                            onClick={() => updateBoard(move?.chess, move?.fen)}
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
