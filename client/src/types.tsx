export interface LocationState {
  collectionName: string;
  by: string;
  password: string | undefined;
  confirmPassword: string | undefined;
}

export interface editLocationState {
  id: string;
  password: string | undefined;
}
export interface Fens {
  _id: string;
  fen: string;
  san: string;
  description: string;
}

export interface PlayState {
  _id: string | undefined;
  collection_name: string;
  by: string;
  fens: Fens[];
}
