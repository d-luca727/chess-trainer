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

export interface PlayState {
  _id: string;
  collection_name: string;
  by: string;
  private: string | undefined;
  fens: [{ fen: string; san: string; description: string }];
}
