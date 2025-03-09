import {Candidat} from "./condidat";

export class Certifications {
    id: number | undefined;

    titreCertif: string | undefined;
    etablissementCertif: string | undefined;
    commentaireCertif: string | undefined;
    paysCertif: string | undefined;
    anneeObtentionCertif: string | undefined;

    // Relation avec l'entité Candidat
    candidat: Candidat | undefined;

}
