export type Status = 0 | 1;

export interface Payload {
  powerStatus: Status;
  internetStatus: Status;
}

export enum HTTPStatus {
  OK = 'OK',
}
