import {Besoin} from "./besoin";

export interface Rating {

    id?: number;
    value?:number;
    ratedAt?:string;
    besoins?: Besoin;
}
