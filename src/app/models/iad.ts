import { ICompany } from "./icompany";

export interface IAd {
    id_ad: number;
    title: string;
    description: string;
    image_url: string;
    link: string;
    company_id: number;
    company: {
        name: string;
        image_url: string;
        link: string;
        id_company: number;
    };
    created_at: string;
}
