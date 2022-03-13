import { Color, Key } from "chessground/types";

export function toDests(chess: any): Map<Key, Key[]> {
  const dests = new Map();
  chess.SQUARES.forEach((s: any) => {
    const ms = chess.moves({ square: s, verbose: true });
    if (ms.length)
      dests.set(
        s,
        ms.map((m: { to: any }) => m.to)
      );
  });
  return dests;
}

export function toColor(chess: any): Color {
  return chess.turn() === "w" ? "white" : "black";
}
