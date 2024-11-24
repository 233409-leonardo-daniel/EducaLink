import { IUserData } from "./iuser-data";

export interface IChat {
  sender: IUserData;
  receiver: IUserData;
  id_chat: number;
  displayName?: string;
}