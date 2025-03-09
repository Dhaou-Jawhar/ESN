import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {RadioButtonModule} from "primeng/radiobutton";
import {FormsModule} from "@angular/forms";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {CheckboxModule} from "primeng/checkbox";
import {DropdownModule} from "primeng/dropdown";
import {MessageService, SharedModule} from "primeng/api";
import {Actions} from "../../../demo/models/Actions";
import {ClientService} from "../../../demo/service/client.service";
import {Router} from "@angular/router";
import {EncryptionServiceService} from "../../../demo/service/encryption-service.service";
import {AutoCompleteModule} from "primeng/autocomplete";
import {finalize} from "rxjs";
import {ActionsService} from "../../../demo/service/actions.service";
import {BesoinService} from "../../../demo/service/besoin.service";
import {Besoin} from "../../../demo/models/besoin";
import {DialogModule} from "primeng/dialog";
import {profils, segments, sousSegmentsMap, technologiesMap} from "../../../../../ReferentielDefinition";
import {InputTextareaModule} from "primeng/inputtextarea";

@Component({
  selector: 'app-actions-add',
  standalone: true,
    imports: [
        RadioButtonModule,
        FormsModule,
        NgForOf,
        NgIf,
        ButtonModule,
        CalendarModule,
        CheckboxModule,
        DropdownModule,
        SharedModule,
        NgClass,
        AutoCompleteModule,
        DatePipe,
        DialogModule,
        InputTextareaModule
    ],
  templateUrl: './actions-add.component.html',
  styleUrl: './actions-add.component.scss'
})
export class ActionsAddComponent implements OnInit{
    // Options à afficher
    actionOptions: string[] = ['Candidat/Ressource', 'Client/Prospection', 'Ambassadeur'];

    // Variable pour stocker l'option sélectionnée
    selectedAction: string = '';
    clients: any[] = [];
    candidats: any[] = [];
    allCandidatsLoaded = false;
    besoins:any[]=[];
    allBesoinsLoaded = false;
    selectedBesoin: Besoin | null = null;
    displayBesoinDetailsDialog:boolean=false;
    sousSegmentsMap = sousSegmentsMap;
    profils = profils;
    technologiesMap = technologiesMap;
    segments = segments;


    page = 0;
    size = 2;
    page1 = 0;
    size1 = 2;
    totalElements = 0;
    totalPages = 0;
    isLoading = false;
    isLoading1 = false;

    filteredClients: any[] = []; // Clients filtrés pour l'auto-complétion
    selectedClient: any;
    allClientsLoaded = false;
    progress: number = 0;
    filteredCandidats: any[] = []; // Clients filtrés pour l'auto-complétion
    selectedCandidat: any;
    besoinsTitles: any[] = [];
    filteredBesoins: any[] = [];
    totalBesoins = 0;

    clientTypes = [
        { label: 'Appel', value: 'Appel' },
        { label: 'E-mail', value: 'E-mail' },
        { label: 'Appel + Mail', value: 'Appel + Mail' },
        { label: 'Echange téléphonique', value: 'Echange téléphonique' },
        { label: 'RDV', value: 'RDV' }
    ];

    candidattTypes = [
        { label: 'Appel', value: 'Appel' },
        { label: 'E-mail', value: 'E-mail' },
        { label: 'Appel + Mail', value: 'Appel + Mail' },
        { label: 'Echange téléphonique', value: 'Echange téléphonique' },
        { label: 'RDV', value: 'RDV' },
        { label: 'Positionnement présenti', value: 'Positionnement présenti' },
        { label: 'Positionnement', value: 'Positionnement' },
        { label: 'Entretien partenaire', value: 'Entretien partenaire' },
        { label: 'Entretien client', value: 'Entretien client' },
    ];

    action: Actions = {
        id: null,
        dateMiseAJour: '',
        dateDeCreation: '',
        manager: '',
        type: '',
        relance: null,
        etatPersonneConcerne: '',
        prochainRdvPlanifie: null,
        dateProchainRdvPlanifie: '',
        satisfactionMission: null,
        commentaires: '',
        satisfactionNessTechnologies: null,
        commentairesNessTechnologies: '',
        client: null, // Référence à l'identifiant du Client
        candidat: null,
        besoin:null,
    };

    constructor(        private cdref: ChangeDetectorRef,
                        private messageService: MessageService,
                        private actionService:ActionsService,
                        private clientService: ClientService,
                        private router: Router,
                        private besoinsService: BesoinService,
                        ) {}

    ngOnInit(): void {
        this.loadInitialClients()
        this.loadInitialCandidat()
        this.loadInitialBesoins()
    }

////////////////Partie CLIENT////////////////////////////

    loadInitialClients(): void {
        this.page = 0;
        this.clients = [];
        this.allClientsLoaded = false;
        this.loadMoreClients();
    }

    loadMoreClients(): void {
        if (this.isLoading || this.allClientsLoaded) return;

        this.isLoading = true;
        this.clientService.getClients(this.page, this.size).subscribe({
            next: (response) => {
                const mappedClients = response.content.map((client: any) => ({
                    ...client,
                    fullDisplay: `${client.nom} ${client.prenom} : ${client.poste || 'Non défini'}`,
                }));

                this.clients = [...this.clients, ...mappedClients];
                this.allClientsLoaded = this.page >= response.totalPages - 1;

                if (!this.allClientsLoaded) {
                    this.page++;
                }

                this.isLoading = false;
            },
            error: (error) => {
                console.error('Erreur chargement clients:', error);
                this.isLoading = false;
            }
        });
    }


    filterClients(event: any): void {
        const searchTerm = event?.query || '';
        if (!searchTerm) {
            this.filteredClients = [];
            return;
        }

        this.page = 0;
        this.allClientsLoaded = false;
        this.filteredClients = [];
        this.loadFilteredPage(searchTerm);
    }

    private loadFilteredPage(searchTerm: string): void {
        if (this.allClientsLoaded) return;
        this.isLoading = true;

        this.clientService.getClients(this.page, this.size).subscribe({
            next: (response) => {
                const filteredResults = response.content
                    .filter(client => {
                        const fullName = `${client.nom} ${client.prenom}`.toLowerCase();
                        return fullName.includes(searchTerm.toLowerCase());
                    })
                    .map(client => ({
                        ...client,
                        fullDisplay: `${client.nom} ${client.prenom} : ${client.poste || 'Non défini'}`
                    }));

                this.filteredClients = [...this.filteredClients, ...filteredResults];

                if (this.page < response.totalPages - 1) {
                    this.page++;
                    this.loadFilteredPage(searchTerm);
                } else {
                    this.allClientsLoaded = true;
                }
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Erreur:', error);
                this.isLoading = false;
            }
        });
    }
    simulateProgress1() {
        this.progress = 0; // Démarrer à 0 %
        const interval = setInterval(() => {
            if (this.progress < 90) {
                this.progress += Math.random() * 10; // Simule une progression
                console.log('Progress:', this.progress); // Débogage
            } else {
                clearInterval(interval); // Arrêter après 90 %
            }
        }, 170); // Mise à jour toutes les 300ms
    }
    onSubmitAction() {
        this.simulateProgress1();

        this.actionService.addActionToClient(this.selectedClient.id, this.action)
            .pipe(
                finalize(() => {
                    this.isLoading = false; // Cache le spinner
                    this.progress = 100; // Terminer à 100 %
                    this.cdref.detectChanges(); // Force la mise à jour de la vue
                    setTimeout(() => (this.progress = 0), 1000); // Réinitialise après 1s
                })
            )
            .subscribe(
                (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Action ajoutée',
                        detail: 'L\'action a été ajoutée avec succès au client.',
                    });
                    console.log('Réponse du serveur :', response);
                    // this.displayActionDialog = false
                    // this.resetActionsForm()
                    // this.loadClientData(this.getDecryptedId())
                },
                (error) => {
                    if (error.status === 404) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Client introuvable.',
                        });
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Une erreur s\'est produite lors de l\'ajout de l\'action.',
                        });
                    }
                    console.error('Erreur du serveur :', error);
                }
            );
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////



    /////////////////////////////PARTIE CANDIDAT//////////////////////////////////////////

    onSubmitActionCandidat() {
        // Vérification que le besoin est bien sélectionné
        if (!this.action.besoin) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez sélectionner un besoin'
            });
            return;
        }

        this.simulateProgress1();

        // Création d'une copie de l'action pour le backend
        const actionToSubmit = {
            ...this.action,
            besoin: {
                id: this.action.besoin.id // Supposant que le besoin a une structure {value, label}
            }
        };

        this.actionService.addActionToCandidat(this.selectedCandidat.id, actionToSubmit)
            .pipe(
                finalize(() => {
                    this.isLoading = false;
                    this.progress = 100;
                    this.cdref.detectChanges();
                    setTimeout(() => {
                        this.progress = 0;
                        this.cdref.detectChanges();
                    }, 1000);
                })
            )
            .subscribe({
                next: (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Action ajoutée',
                        detail: 'L\'action a été ajoutée avec succès.'
                    });
                },
                error: (error) => {
                    console.error('Erreur du serveur :', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Une erreur est survenue lors de l\'ajout de l\'action.'
                    });
                }
            });
    }


    loadInitialCandidat(): void {
        this.page = 0;
        this.candidats = [];
        this.allCandidatsLoaded = false;
        this.loadMoreCandidats();
    }

    loadMoreCandidats(): void {
        if (this.isLoading || this.allCandidatsLoaded) return;

        this.isLoading = true;
        this.actionService.getCandidatsActions(this.page, this.size).subscribe({
            next: (response) => {
                const mappedCandidats = response.content.map((client: any) => ({
                    ...client,
                    fullDisplay: `${client.nom} ${client.prenom} : ${client.titre || 'Non défini'}`,
                }));

                this.candidats = [...this.candidats, ...mappedCandidats];
                this.allCandidatsLoaded = this.page >= response.totalPages - 1;

                if (!this.allClientsLoaded) {
                    this.page++;
                }

                this.isLoading = false;
            },
            error: (error) => {
                console.error('Erreur chargement clients:', error);
                this.isLoading = false;
            }
        });
    }


    filterCandidats(event: any): void {
        const searchTerm = event?.query || '';
        if (!searchTerm) {
            this.filteredCandidats = [];
            return;
        }

        this.page = 0;
        this.allCandidatsLoaded = false;
        this.filteredCandidats = [];
        this.loadFilteredPage1(searchTerm);
    }

    private loadFilteredPage1(searchTerm: string): void {
        if (this.allCandidatsLoaded) return;
        this.isLoading = true;

        this.actionService.getCandidatsActions(this.page, this.size).subscribe({
            next: (response) => {
                const filteredResults = response.content
                    .filter(client => {
                        const fullName = `${client.nom} ${client.prenom}`.toLowerCase();
                        return fullName.includes(searchTerm.toLowerCase());
                    })
                    .map(client => ({
                        ...client,
                        fullDisplay: `${client.nom} ${client.prenom} : ${client.titre || 'Non défini'}`
                    }));

                this.filteredCandidats = [...this.filteredCandidats, ...filteredResults];

                if (this.page < response.totalPages - 1) {
                    this.page++;
                    this.loadFilteredPage1(searchTerm);
                } else {
                    this.allCandidatsLoaded = true;
                }
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Erreur:', error);
                this.isLoading = false;
            }
        });
    }



















                     // PARTIE BESOIN/CANDIDAT


    loadInitialBesoins(): void {
        this.page1 = 0;
        this.besoinsTitles = [];
        this.filteredBesoins = [];
        this.allBesoinsLoaded = false;
        this.loadAllBesoins();
    }

    loadAllBesoins(): void {
        if (this.isLoading1) return;
        this.isLoading1 = true;

        const loadPage = (page: number) => {
            this.actionService.getBesoinsActions(page, this.size1).subscribe({
                next: (response) => {
                    const mappedBesoins = response.content.map((besoin: any) => ({
                        label: besoin.titre,
                        value: besoin,
                        id: besoin.id
                    }));

                    this.besoinsTitles = [...this.besoinsTitles, ...mappedBesoins];
                    this.filteredBesoins = [...this.besoinsTitles];

                    if (page < response.totalPages - 1) {
                        loadPage(page + 1);
                    } else {
                        this.allBesoinsLoaded = true;
                        this.isLoading1 = false;
                    }
                },
                error: (error) => {
                    console.error('Erreur chargement besoins:', error);
                    this.isLoading1 = false;
                }
            });
        };

        loadPage(0);
    }

    filterBesoins(event: any): void {
        const query = event.filter?.toLowerCase() || '';

        // Log pour debug
        console.log('Filtering with query:', query);
        console.log('Available besoins:', this.besoinsTitles);

        if (!query.trim()) {
            this.filteredBesoins = [...this.besoinsTitles];
        } else {
            this.filteredBesoins = this.besoinsTitles.filter(besoin =>
                besoin.label && besoin.label.toLowerCase().includes(query)
            );
        }

        // Log pour debug
        console.log('Filtered results:', this.filteredBesoins);
    }


    preventDropdownClose(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
    }

    onEyeClick(event: MouseEvent, besoinId: number) {
        event.stopPropagation(); // Empêche la fermeture du dropdown
        this.preventDropdownClose(event);

        this.showViewBesoinDialog(besoinId); // Affiche le besoin dans une boîte de dialogue
    }
    showViewBesoinDialog(id: number): void {
        this.besoinsService.getBesoinById(id).subscribe(
            (data) => {
                this.selectedBesoin = data; // Stocke les détails du besoin récupérés
                this.displayBesoinDetailsDialog = true; // Affiche le dialog
            },
            (error) => {
                console.error('Erreur lors de la récupération des données du besoin:', error);
            }
        );
    }

    onDialogClose(dropdown: any) {
        this.displayBesoinDetailsDialog = false; // Ferme le dialog
        setTimeout(() => {
            // Maintenir l'état du dropdown
            dropdown.overlayVisible = true; // Ouvre le dropdown manuellement après la fermeture du dialog
        }, 0);
    }




    // Convertir les valeurs en labels
    getSegmentsLabels(): string[] {
        return this.mapValuesToLabels(this.selectedBesoin?.referentiel?.segments, this.segments);
    }

    getSousSegmentsLabels(): string[] {
        return this.mapSousSegmentsToLabels(this.selectedBesoin?.referentiel?.sousSegments, this.sousSegmentsMap);
    }

    getProfilLabels(): string[] {
        if (
            this.selectedBesoin?.referentiel &&
            this.selectedBesoin?.referentiel?.profilReferentiels.length > 0
        ) {
            const firstProfil = this.selectedBesoin?.referentiel?.profilReferentiels[0].profil;
            return this.mapValuesToLabels([firstProfil], this.profils); // Convertit `firstProfil` en tableau
        } else {
            return [];
        }
    }

    getTechnologiesLabels(): string[] {
        return this.mapTechnologiesToLabels(this.selectedBesoin?.referentiel?.technologie, this.technologiesMap);
    }
    // Fonction générique pour mapper un tableau de valeurs vers leurs labels
    mapValuesToLabels(values: string[], mapping: { label: string, value: string }[]): string[] {
        return values?.map(value => {
            const found = mapping.find(item => item.value === value);
            return found ? found.label : value; // Retourne le label ou la valeur si introuvable
        });
    }


// Fonction pour mapper les sous-segments
    mapSousSegmentsToLabels(values: string[], sousSegmentsMap: Record<string, { label: string, value: string }[]>): string[] {
        const allSousSegments = Object.values(sousSegmentsMap).flat(); // Regroupe tous les sous-segments
        return this.mapValuesToLabels(values, allSousSegments);
    }

// Fonction pour mapper les technologies
    mapTechnologiesToLabels(values: string[], technologiesMap: Record<string, { label: string, value: string }[]>): string[] {
        const allTechnologies = Object.values(technologiesMap).flat(); // Regroupe toutes les technologies
        return this.mapValuesToLabels(values, allTechnologies);
    }
}
