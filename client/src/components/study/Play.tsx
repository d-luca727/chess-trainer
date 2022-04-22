import { toColor, toDests } from "../../utils/chessUtils";
import { Howl, Howler } from "howler";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PlayState } from "../../types";
import Chessground from "@react-chess/chessground";
import { ChessInstance } from "chess.js";
import { Config } from "@react-chess/chessground/node_modules/chessground/config";
import { Button, Card, Col, InputNumber, Row, Statistic } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
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
  const [goodAnswers, setGoodAnswers] = useState<any>([]);
  const { _id } = position;

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
      index = 0;

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
                setMessage("v");
                setIsCorrect(true);
                setGoodAnswers((prev: number[]) => [...prev, 1]);
              } else {
                soundPlayer(wrong_move);
                setMessage("x");
                setUpBoard();
                setGoodAnswers((prev: number[]) => [...prev, 0]);
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
      return {
        fen: chess.fen(),
        movable: { dests: undefined },
        highlight: { lastMove: false },
      };
    });
    setIsCorrect(true);
  };
  Howler.volume(1.0);
  return (
    <div>
      <Row gutter={[16, 16]} justify={"center"}>
        <Col span={6}>
          <div className="studyTitle card-statistics">
            <Card>
              <h1>
                <Statistic
                  title="Study Title"
                  value={position.collection_name}
                />
              </h1>

              <h2>
                <Statistic title="by" value={position.by} />
              </h2>
            </Card>
          </div>
        </Col>

        {!isGameOver ? (
          <>
            <Col span={12}>
              <div className="studyTitle card-statistics">
                <Card>
                  <h2>
                    Position {index + 1} of {fens.length}
                  </h2>
                  Resize Board:{" "}
                  <InputNumber
                    defaultValue={100}
                    min={50}
                    max={150}
                    formatter={(value) => `${value}%`}
                    /*   parser={(value) => value.replace("%", "")} */
                    onChange={(value) => setBoardWidth(700 + (value - 100) * 3)}
                  />
                  <div className="board-container">
                    <div
                      style={{
                        margin: "0 auto",
                        height: boardWidth,
                        width: boardWidth,
                      }}
                    >
                      <Chessground config={config} contained />
                    </div>
                  </div>
                </Card>
              </div>
            </Col>
            <Col span={6}>
              <div className="studyTitle card-statistics">
                <Card>
                  <span>
                    {message === "v" && (
                      <CheckOutlined
                        style={{ color: "green", fontSize: "300%" }}
                      />
                    )}
                    {message === "x" && (
                      <CloseOutlined
                        style={{ color: "red", fontSize: "300%" }}
                      />
                    )}
                  </span>
                  <br></br>
                  <hr></hr>
                  {isCorrect && (
                    <>
                      <Button
                        onClick={() => {
                          index++;
                          setMessage("");
                          setIsCorrect(false);
                          setUpBoard();
                        }}
                      >
                        Next
                      </Button>
                      <h2>Description</h2>
                      <p>{fens[index].description} sfjwdsbfjhd</p>
                      <a
                        href={`https://lichess.org/analysis/${fens[index].fen}`}
                        target={"_blank"}
                      >
                        <Button>Analyze this position</Button>
                      </a>
                    </>
                  )}
                  {!isCorrect && (
                    <>
                      <Statistic
                        title="Number of correct answers:"
                        value={`${
                          goodAnswers.filter((e: number) => e === 1).length
                        }`}
                      />

                      <Button onClick={solutionHandler}>View Solution</Button>
                    </>
                  )}
                </Card>
              </div>
            </Col>
          </>
        ) : (
          <>
            <Col span={8}>
              <div className="studyTitle card-statistics">
                <Card>
                  <h1>
                    <Statistic
                      title="Game Over"
                      value={`You studied ${fens.length} Positions`}
                    />
                  </h1>
                  <hr></hr>
                  <p>
                    <Button
                      onClick={() => {
                        setGoodAnswers([]);
                        setIsGameOver(false);
                        setUpBoard();
                      }}
                    >
                      Retry
                    </Button>
                  </p>
                  <p>
                    <Link to={`/study/${_id}`}>
                      <Button>Back to the Study</Button>
                    </Link>
                  </p>
                </Card>
              </div>
            </Col>
            <Col span={6}>
              <div className="studyTitle card-statistics">
                <Card>
                  <h1>
                    <Statistic
                      title="Number of correct answers:"
                      value={`${
                        goodAnswers.filter((e: number) => e === 1).length
                      }`}
                    />
                  </h1>
                </Card>
              </div>
            </Col>
          </>
        )}
      </Row>
    </div>
  );
};

export default Play;
