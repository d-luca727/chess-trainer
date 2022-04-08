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
