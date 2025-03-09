import {Candidat} from "./condidat";
import {Besoin} from "./besoin";
import {ProfilReferentiel} from "./ProfilReferentiel";

export class Referentiel {
    id: number | undefined;
    segments: string[] = [];
    sousSegments: string[] = [];
    technologie: string[] = [];

    // Relation avec l'entité Candidat
    candidat: Candidat | undefined;
    besoin?: Besoin | undefined;
    profilReferentiels: ProfilReferentiel[] = [];

}
