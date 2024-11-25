import { IUserData } from "./iuser-data";

export interface ISaleMessage {
    id_sale_message: number;
    id_sale_chat: number;
    sender: IUserData;
    message: string;
    message_date: string;
}
