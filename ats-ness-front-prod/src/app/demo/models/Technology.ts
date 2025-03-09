import {Candidat} from "./condidat";

export interface Technology {
    id?: number; // Facultatif si l'ID est généré automatiquement
    name: any;
    anneesExperiences: number;
    candidat: Candidat | undefined;

}
