export interface IErrorClassObj {
  [key: number]: new (message: string) => Error;
}