import { toColor, toDests } from "../utils/chessUtils";
import React, { useEffect, useState, useRef } from "react";
import Chessground from "@react-chess/chessground";
import { ChessInstance, Square } from "chess.js";
import { Config } from "@react-chess/chessground/node_modules/chessground/config";
import { Key } from "chessground/types";
const Chessjs = require("chess.js");

const exampleFens = [
  { fen: "5r2/1Pp2Pq1/4n3/3B2N1/3R3P/k1p3K1/p2P4/7r w - - 0 1", move: "Ra4+" },
  { fen: "4r2r/2p2Q1p/2Kpp2k/4B3/2P5/3R3p/2n1PP2/8 b - - 0 1", move: "Bf4#" },
  { fen: "8/rb1p4/PrRPN3/k7/5n1P/p2P1B2/P7/4K3 w - - 0 1", move: "Rc5+" },
  { fen: "1R2B2r/8/3P1Kpp/r5P1/1p1p4/3k4/3Pnp2/n7 w - - 0 1", move: "Kg7" },
];

let index: number = 0;

const Play: React.FC = () => {
  const [chess] = useState<ChessInstance>(
    new Chessjs("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  );

  const [config, setConfig] = useState<Partial<Config> | undefined>({});

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

  const [isPlay, setIsPlay] = useState(false);

  const [fen, setFen] = useState("");

  const [fensArr, setFensArr] = useState(exampleFens);

  const [message, setMessage] = useState("");
  useEffect(() => {
    console.log(index);
  }, [index]);

  const setupChessBoard = () => {
    index = 0;
    chess.load(fensArr[index].fen);

    setConfig(() => {
      return {
        fen: chess.fen(),
        orientation: toColor(chess),
        movable: {
          turnColor: toColor(chess), //toColor returns the player's color that has to move
          color: toColor(chess),
          free: false,
          dests: toDests(chess), //toDests sets the legal moves
          events: {
            after: (orig: Key, dest: Key) => {
              const res = chess.move({
                from: orig as Square,
                to: dest as Square,
              }); //setting the chess.js object first
              console.log(res?.san);
              if (res?.san === fensArr[index].move) {
                setMessage("GIUSTO!!!");
              } else {
                setMessage("SBAGLIATO");
              }
            },
          },
        },
      };
    });

    setIsPlay(true);
  };

  const clickHandler = () => {
    index++;
    chess.load(fensArr[index].fen);
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
            after: (orig: Key, dest: Key) => {
              const res = chess.move({
                from: orig as Square,
                to: dest as Square,
              }); //setting the chess.js object first
              console.log(res?.san);
              if (res?.san === fensArr[index].move) {
                setMessage("GIUSTO!!!");
              } else {
                setMessage("SBAGLIATO");
              }
            },
          },
        },
      };
    });
  };

  if (!isPlay) {
    return (
      <>
        Click to play <button onClick={setupChessBoard}>Play</button>
      </>
    );
  }

  return (
    <>
      {isMobile ? (
        <Chessground
          width={windowDimension - 50}
          height={windowDimension - 50}
          config={config}
        />
      ) : (
        <>
          <Chessground config={config} />
          <span>{message}</span>
          <button onClick={clickHandler}>avanti</button>
        </>
      )}
    </>
  );
};

export default Play;
