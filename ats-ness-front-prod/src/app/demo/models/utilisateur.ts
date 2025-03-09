import { Role } from "./enums/Role";

export class Utilisateur {
    id: number;
    prenom: string;
    nom: string;
    username: string;
    lastLogin:any;
    justLogged:any;
    email: string;
    password: string;
    role: Role;
}
