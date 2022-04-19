import { toColor, toDests } from "../../utils/chessUtils";
import { Howl, Howler } from "howler";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PlayState } from "../../types";
import Chessground from "@react-chess/chessground";
import { ChessInstance } from "chess.js";
import { Config } from "@react-chess/chessground/node_modules/chessground/config";
import { Col, InputNumber, Row } from "antd";
const Chessjs = require("chess.js");

const move = require("../../audio/move.mp3");
const wrong_move = require("../../audio/wrong_move.mp3");
const piece_capture = require("../../audio/piece_capture.mp3");

let index = 0;

const Play = () => {
  const [chess] = useState<ChessInstance>(
    new Chessjs("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  );

  const [config, setConfig] = useState<Partial<Config> | undefined>({});
  const location = useLocation();
  const position = location.state as PlayState; // Type Casting, then you can get the params passed via router
  const { fens } = position;

  const [boardWidth, setBoardWidth] = useState(700);

  const [message, setMessage] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  const [isGameOver, setIsGameOver] = useState(false);

  const isCaptureSound = (san: string[]) => {
    const isCapture = san.find((e) => e === "x");

    return isCapture !== undefined ? true : false;
  };
  const soundPlayer = (src: any) => {
    const sound = new Howl({
      src,
    });

    sound.play();
  };

  const setUpBoard = () => {
    if (index === fens.length) {
      setIsGameOver(true);
      return;
    }

    chess.load(fens[index].fen);

    setConfig(() => {
      return {
        fen: chess.fen(),
        orientation: toColor(chess),
        movable: {
          turnColor: toColor(chess), //toColor returns the player's color that has to move
          color: "both",
          free: false,
          dests: toDests(chess), //toDests sets the legal moves
          events: {
            after: (orig: any, dest: any) => {
              const res = chess.move({ from: orig, to: dest }); //setting the chess.js object first
              console.log(res?.san);
              if (res?.san === fens[index].san) {
                isCaptureSound(res.san.split(""))
                  ? soundPlayer(piece_capture)
                  : soundPlayer(move);
                setMessage("GIUSTO!!!");
                setIsCorrect(true);
              } else {
                soundPlayer(wrong_move);
                setMessage("SBAGLIATO");
                setUpBoard();
              }
            },
          },
        },
      };
    });
  };

  useEffect(() => {
    setIsCorrect(false);
    setUpBoard();
  }, []);

  const solutionHandler = () => {
    chess.move(fens[index].san);

    setConfig(() => {
      return { fen: chess.fen(), viewOnly: true };
    });
    setIsCorrect(true);
  };
  Howler.volume(1.0);
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <div>
            <h1>Study:{position.collection_name}</h1>
            <h2>by:{position.by}</h2>
          </div>
        </Col>

        {!isGameOver ? (
          <>
            <Col span={12}>
              <h2>
                Position {index + 1} of {fens.length}
              </h2>
              <InputNumber
                defaultValue={100}
                min={50}
                max={150}
                formatter={(value) => `${value}%`}
                /*   parser={(value) => value.replace("%", "")} */
                onChange={(value) => setBoardWidth(700 + (value - 100) * 3)}
              />
              <br />

              <Chessground
                width={boardWidth}
                height={boardWidth}
                config={config}
              />
            </Col>
            <Col span={4}>
              <span>{message}</span>
              {isCorrect && (
                <>
                  <button
                    onClick={() => {
                      index++;
                      setIsCorrect(false);
                      setUpBoard();
                    }}
                  >
                    Next
                  </button>
                  <h2>Description</h2>
                  <p>{fens[index].description} sfjwdsbfjhd</p>
                  <a
                    href={`https://lichess.org/analysis/${fens[index].fen}`}
                    target={"_blank"}
                  >
                    <button>Analyze this position</button>
                  </a>
                </>
              )}
              {!isCorrect && (
                <button onClick={solutionHandler}>View Solution</button>
              )}
            </Col>
          </>
        ) : (
          <h2>Game is over. You studied {fens.length} positions</h2>
        )}

        <Col span={8} />
        <Col span={8} />
        <Col span={8} />
      </Row>
    </div>
  );
};

export default Play;
