import { IUserData } from "./iuser-data";

export interface IForum {
    is_member: any;
    id_forum: number;
    name: string;
    description: string;
    education_level: string;
    privacy: string;
    password: string;
    creation_date: string;
    id_user: number;
    members: number;
    background_image_url: string;
    image_url: string;
    user_name: string;
    users_count: number;
    grade: number;
    creator: IUserData;
}
