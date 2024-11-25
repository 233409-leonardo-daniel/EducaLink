import { ICompany } from "./icompany";

export interface IAd {
    id_ad: number;
    title: string;
    description: string;
    link: string;
    image_url: string;
    company_id: number;
    company: ICompany;
    created_at: string;
}
