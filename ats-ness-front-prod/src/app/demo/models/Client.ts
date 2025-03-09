import {Referentiel} from "./Referentiel";
import {Societe} from "./societe";
import {Besoin} from "./besoin";
import {Organigramme} from "./Organigramme";
import {LinkedIn} from "./LinkedIn";
import {Prospection} from "./Prospection";
import {Actions} from "./Actions";

export interface Client {
    id?: number; // Optional, as it may not be set initially
    dateDerniereMiseAJour?: string; // LocalDateTime as a string
    dateDeCreation?: string; // LocalDateTime as a string
    manager: string;
    isAmbassadeur?: boolean;
    intimiteClient:number;
    secteur?: string;
    localisation?: string;
    genre?: string; // URL of the original CV stored
    nom?: string;
    prenom?: string;
    email?: string;
    emailSecondaire?: string;
    telephonePrso?: number;
    telephonePro?: number;
    statut?: string;
    commentaireProfilsRecherches?: string;
    personnalite?: string;
    modeDeFonctionnement?: string;
    preferenceDeCommunication?: string;
    poste?:string;
    organigramme?: Organigramme;
    referentiel?: Referentiel;
    societe?: Societe;
    linkedIn?: LinkedIn;
    prospection?: Prospection;

    besoins?: Besoin[];
    actions?: Actions[];



}
