import { Media } from './media';
import { ProfilBesoin } from './profileBesoin';
import {Rating} from "./Rating";
import {Referentiel} from "./Referentiel";
import {BesoinsTechnologies} from "./BesoinsTechnologies";
import {Client} from "./Client";

export interface Besoin {
  id?: number; // Optional, as it may not be set initially
  dateDerniereMiseAJour?: string; // LocalDateTime as a string
  dateDeCreation?: string; // LocalDateTime as a string
  titre: string;
  reference?: string;
  aoSow?: string;
  descriptifUrl?: string; // URL of the original CV stored
  etat?: string;
  plateforme?: string;
  besoinEnAvanceDePhase?: boolean;
  reccurent?: boolean;
  demarrageASAP?: boolean;
  dateDeDemarrage?: string; // LocalDateTime as a string
  habilitable?: boolean;

  profilBesoins?: ProfilBesoin; // Array of ProfilBesoin objects
  qrCodeImage?: Media; // Media object for QR code image
  intimiteClient?: Rating[];
  referentiel?: Referentiel;
  besoinsTechnologies?: BesoinsTechnologies[];
  client?: Client;


}
