export interface Prospection {
    id: number;
    nbrAppels: number;
    nbrMails: number;
    datePremiereAction: string;  // Utilisation de string pour la date (format ISO 8601)
    dateDerniereAction: string;  // Utilisation de string pour la date (format ISO 8601)
    nbrJoursDepuisDerniereAction: number;
    ajoutLinkedIn: boolean;
    dateajoutLinkedIn: string;  // Utilisation de string pour la date (format ISO 8601)
    linkedInAccepte: boolean;
    dateAcceptationLinkedIn: string;  // Utilisation de string pour la date (format ISO 8601)
    mailLinkedInEnvoye: boolean;
    dateEnvoiMailLinkedIn: string;  // Utilisation de string pour la date (format ISO 8601)
}
