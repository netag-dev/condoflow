export interface Country {
    name?: string;
    code?: string;
}

export interface Representative {
    name?: string;
    image?: string;
}

export interface Pessoa{
    id_pessoa?:number,
    nome_pessoa?:string,
    telefone_pessoa?:string,
    endereco_id?:number,
    status_id?:number,
    bi_pessoa?:string   
}

export interface Customer {
    id?: number;
    name?: string;
    country?: Country;
    company?: string;
    date?: string;
    status?: string;
    activity?: number;
    representative?: Representative;
}
