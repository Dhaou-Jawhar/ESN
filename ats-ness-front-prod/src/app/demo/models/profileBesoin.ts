import { Niveau } from "./enums/Niveau";

export interface ProfilBesoin {
    id?: number; // Optional because it may not be set initially
    difficultes?: string; // LONGTEXT in Java can be represented as a string in Angular
    seniorite?: Niveau; // Enum for seniority level
    anneesExperienceTotales?: number;
    tjmMinEstime?: number;
    tjmMaxEstime?: number;
    tjmMax?: number;
    tjmMin?: number;
    tjmSouhaite?: number;
    commentaire?: string; // LONGTEXT in Java can be represented as a string in Angular
    avantages?: string;

}
