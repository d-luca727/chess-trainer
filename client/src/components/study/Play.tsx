import { toColor, toDests } from "../../utils/chessUtils";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PlayState } from "../../types";
import Chessground from "@react-chess/chessground";
import { ChessInstance } from "chess.js";
import { Config } from "@react-chess/chessground/node_modules/chessground/config";
const Chessjs = require("chess.js");

let index = 0;

const Play = () => {
  const [chess] = useState<ChessInstance>(
    new Chessjs("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  );

  const [config, setConfig] = useState<Partial<Config> | undefined>({});
  const location = useLocation();
  const position = location.state as PlayState; // Type Casting, then you can get the params passed via router
  const { fens } = position;

  const [message, setMessage] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  const [isGameOver, setIsGameOver] = useState(false);

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
                setMessage("GIUSTO!!!");
                setIsCorrect(true);
              } else {
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

  return (
    <div>
      <h1>Study:{position.collection_name}</h1>
      <h2>by:{position.by}</h2>
      <br />
      <br />
      <br />

      {!isGameOver ? (
        <>
          <h2>
            Position {index + 1} of {fens.length}
          </h2>
          <Chessground config={config} />
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
            </>
          )}
          {!isCorrect && (
            <button onClick={solutionHandler}>View Solution</button>
          )}
        </>
      ) : (
        <h2>Game is over. You studied {fens.length} positions</h2>
      )}
    </div>
  );
};

export default Play;
