import {Client} from "./Client";
import {Candidat} from "./condidat";
import {Besoin} from "./besoin";

export class Actions {
    id?: number;
    dateMiseAJour?: string;
    dateDeCreation?: string;
    manager?: string;
    type?: string;
    relance?: boolean;
    etatPersonneConcerne?: string;
    prochainRdvPlanifie?: boolean;
    dateProchainRdvPlanifie?: string;
    actionPour?:string;
    satisfactionMission?: number;
    commentaires?: string;
    satisfactionNessTechnologies?: number;
    commentairesNessTechnologies?: string;
    client?: Client; // Référence à l'identifiant du Client
    candidat?: Candidat; // Référence à l'identifiant du Candidat
    besoin?: Besoin;

}
