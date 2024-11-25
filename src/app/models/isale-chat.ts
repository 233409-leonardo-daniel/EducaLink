import { IUserData } from "./iuser-data";

export interface ISaleChat {
    id_sale_chat: number;
    buyer: IUserData;
    seller: IUserData;
}
