import {Technologie} from "./Technologie";
import {SousSegment} from "./SousSegment";
import {Segment} from "./Segment";


export class StatistiquesProfil {
    id?: number;
    segments: Segment[] = [];  // Liste des segments
    sousSegments: SousSegment[] = [];  // Liste des sous-segments
    technologie: Technologie[] = [];  // Liste des technologies
    candidat?: number;  // Candidat lié à StatistiquesProfil
    candidatId?: number; // Optionnel, ID pour la relation avec Candidat

    constructor(init?: Partial<StatistiquesProfil>) {
        Object.assign(this, init);
    }
}
