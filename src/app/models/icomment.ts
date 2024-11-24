import { IUserData } from "./iuser-data";

export interface IComment {
    id_comment: number;
    post_id: number;
    user_id: number;
    comment_text: string;
    comment_date: string;
    user: IUserData;
}
