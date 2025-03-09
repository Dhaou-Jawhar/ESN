
import {Referentiel} from "./Referentiel";

export class ProfilReferentiel {
    id: number | undefined;

    profil: string | undefined ;
    niveau: string | undefined;

    // Relation avec l'entité Candidat
    referentiel: Referentiel | undefined;
}
