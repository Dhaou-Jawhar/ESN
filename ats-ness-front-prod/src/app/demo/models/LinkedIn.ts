export interface LinkedIn {
    id: number;
    lien: string;
    jobTitle: string;
    jobDescription: string;
    jobLocation: string;
    previousCompany: string;
    previousJob: string;
    previousJobDescription: string;
    allSkills: string[];
    skillsJobActuel: string[];
    skillsJobPrecedent: string[];
    libelleGeneral: string;
    degreActiviteLinkedIn: number;
    infos: string;
    posteActuel: string;
    localisationLinkedin: string;
    dureeDerniereSociete: number;
    descriptionPosteDerniereSociete: string;
    motsCles: string[];
    commentaires: string;
    nbrPushCV: number;
}
