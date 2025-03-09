import {Candidat} from "./condidat";
import {Besoin} from "./besoin";

export class BesoinsTechnologies {
    id: number | undefined;

    technologie: string | undefined;
    niveau: string | undefined;
    importance: string | undefined;
    anneesExperience:number | undefined;

    // Relation avec l'entité Candidat
    besoin: Besoin | undefined;

}
