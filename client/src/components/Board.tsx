import { toColor, toDests } from "../utils/chessUtils";
import React, { useState } from "react";
import Chessground from "@react-chess/chessground";
import { ChessInstance, ShortMove } from "chess.js";
import { Config } from "@react-chess/chessground/node_modules/chessground/config";
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

  return (
    <div className="chessboard">
      <Chessground config={config} />
    </div>
  );
};

export default PlayvsPlayer;
