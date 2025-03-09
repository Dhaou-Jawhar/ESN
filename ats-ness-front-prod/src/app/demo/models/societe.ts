import { Besoin } from "./besoin";
import {Client} from "./Client";


export interface Societe {
  id?: number; // optional because it may not be set for new Societe instances
  dateDeCreation?: string; // LocalDateTime; should be a string in Angular
  dateDeDerniereMiseAJour?: string;
  logo?: string;
  nom: string;
  societeMere?: string;
  adresse?: string;
  capitalSocial: number;
  rcs?: string;
  villeRcs?: string;
  siret: number;
  secteur?:string;

    organigramme?: string[]; // Array of URLs to the organigramme files
  besoins?: Besoin[]; // Array of Besoin objects
  clients?: Client[]; // Array of Besoin objects

}
