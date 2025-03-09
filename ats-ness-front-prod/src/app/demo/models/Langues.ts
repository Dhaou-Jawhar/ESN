import {Candidat} from "./condidat";

export class Langues {
    id: number | undefined;
    name: string | undefined;
    lev: string | undefined;
    commentaire: string | undefined;

    // Relation avec l'entité Candidat
    candidat: Candidat | undefined;
}
