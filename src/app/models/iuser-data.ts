export interface IUserData {
    id_user: number;
    name: string;
    lastname: string;
    background_image_url: string;
    profile_image_url: string;
    mail: string;
    grade: number;
    education_level: string;
    user_type: string;
    creation_date: string;
    state: string;
    password?: string; //recien lo agregue xd
}
