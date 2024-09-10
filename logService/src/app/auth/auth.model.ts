export interface TokenInfo {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
}

export interface Person {
  Id: string;
  Name: string;
}
