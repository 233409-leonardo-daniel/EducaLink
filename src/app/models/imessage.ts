import { IUserData } from "./iuser-data";

export interface IMessage {
    message: string;
    chat_id: number;
    date_message: string;
    id_message: number;
    sender: IUserData;
  }