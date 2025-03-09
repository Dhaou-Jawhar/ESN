import {Candidat} from "./condidat";

export class Formations {
    id: number | undefined;
    titre: string | undefined;
    etablissement: string | undefined;
    commentaire: string | undefined;
    pays:  string| undefined;  // Le pays peut être un objet ou une chaîne
    anneeObtention: string | undefined;

    // Relation avec l'entité Candidat
    candidat: Candidat | undefined;
}
