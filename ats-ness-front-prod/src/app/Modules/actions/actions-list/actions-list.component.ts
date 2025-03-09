import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ActionsService} from "../../../demo/service/actions.service";
import {ButtonModule} from "primeng/button";
import {DatePipe, NgIf} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {EncryptionServiceService} from "../../../demo/service/encryption-service.service";
import {DockModule} from "primeng/dock";
import {Actions} from "../../../demo/models/Actions";
import {CalendarModule} from "primeng/calendar";
import {CheckboxModule} from "primeng/checkbox";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {InputTextareaModule} from "primeng/inputtextarea";
import {PaginatorModule} from "primeng/paginator";
import {SidebarModule} from "primeng/sidebar";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DialogModule} from "primeng/dialog";
import {BesoinService} from "../../../demo/service/besoin.service";
import {profils, segments, sousSegmentsMap, technologiesMap} from "../../../../../ReferentielDefinition";

@Component({
  selector: 'app-actions-list',
  standalone: true,
    imports: [
        ButtonModule,
        DatePipe,
        InputTextModule,
        NgIf,
        SharedModule,
        TableModule,
        ToastModule,
        DockModule,
        CalendarModule,
        CheckboxModule,
        DropdownModule,
        FormsModule,
        InputTextareaModule,
        PaginatorModule,
        SidebarModule,
        ConfirmDialogModule,
        DialogModule
    ],
  templateUrl: './actions-list.component.html',
  styleUrl: './actions-list.component.scss'
})
export class ActionsListComponent implements OnInit{
    actions: any[] = [];
    page = 0;
    size = 2;
    totalElements = 0;
    isLoading = false;
    expandedRows: { [key: string]: boolean } = {};
    displaySidebar=false
    filteredBesoins: any[] = [];
    isAdmin: boolean = false;
    selectedAction:any
    displayActionsDetailsDialog=false
    displayBesoinDetailsDialog=false
    sousSegmentsMap = sousSegmentsMap;
    technologiesMap = technologiesMap;
    profils = profils;
    segments = segments;




    selectedBesoin:any
    actionSelected: Actions = {
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
    types = [
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

    constructor(private actionsService: ActionsService,
                private router: Router,
                private encryptionService: EncryptionServiceService,
                private actionService: ActionsService,
                private messageService: MessageService,
                private confirmationService: ConfirmationService,
                private besoinService: BesoinService,
    ) {}

    ngOnInit(): void {
        const userRole = localStorage.getItem('role');
        this.isAdmin = userRole === 'ADMIN';
        this.loadActions()
    }
    // Méthode pour charger les clients
    loadActions(): void {
        if (this.isLoading) return; // Empêcher les appels simultanés
        this.isLoading = true;

        this.actionsService.getActions(this.page, this.size).subscribe(
            (response) => {
                this.actions = [...this.actions, ...response.content]; // Ajouter les nouveaux clients
                this.totalElements = response.totalElements; // Mettre à jour le total
                this.isLoading = false;

                // Vérifiez si la page est complète et s'il reste d'autres données à charger
                if (
                    this.actions.length < this.totalElements && // Tous les clients ne sont pas encore chargés
                    response.content.length === this.size // La page actuelle est complète
                ) {
                    this.loadMore(); // Charger automatiquement la page suivante
                }
                console.warn(this.actions)

            },
            (error) => {
                console.error('Erreur lors du chargement des clients :', error);
                this.isLoading = false;
            }
        );
    }

    // Charger la page suivante
    loadMore(): void {
        this.page++;
        this.loadActions();
    }


    navigateToAddAction(): void {
        this.router.navigate(['/back-office/actions/add']);
    }

    loadActionDataAndDisplaySidebar(actionId: number) {
        this.actionService.getActionById(actionId).subscribe({
            next: (actionData: any) => {
                // Convertir les dates en objets Date
                this.actionSelected = {
                    ...actionData,
                    dateDeCreation: actionData.dateDeCreation ? new Date(actionData.dateDeCreation) : null,
                    dateProchainRdvPlanifie: actionData.dateProchainRdvPlanifie ?
                        new Date(actionData.dateProchainRdvPlanifie) : null
                };

                if (this.actionSelected.besoin) {
                    // Si l'action a un besoin, on s'assure que le dropdown affiche le titre
                    const besoinOption = {
                        label: this.actionSelected.besoin.titre,
                        value: this.actionSelected.besoin
                    };
                    this.filteredBesoins = [besoinOption];
                }
                this.displaySidebar = true;
            },
            error: (error) => {
                console.error('Erreur lors du chargement de l\'action:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Une erreur s\'est produite lors du chargement des données.'
                });
            }
        });
    }




    // Méthode pour vérifier si un champ doit être affiché
    shouldShowField(fieldName: string): boolean {
        if (!this.actionSelected) return false;

        switch (fieldName) {
            case 'besoin':
                // Afficher si l'action a un besoin OU si le type nécessite un besoin
                return Boolean(this.actionSelected.besoin) ||
                    ['Positionnement présenti', 'Positionnement', 'Entretien partenaire', 'Entretien client'].includes(this.actionSelected.type);
            case 'relance':
                return true; // Toujours affiché
            case 'prochainRdvPlanifie':
                return ['Appel', 'E-mail', 'Appel + Mail', 'Echange téléphonique', 'RDV'].includes(this.actionSelected.type);
            case 'dateProchainRdvPlanifie':
                return this.actionSelected.prochainRdvPlanifie === true;
            case 'commentaires':
                return true; // Toujours affiché
            default:
                return false;
        }
    }



    updateAction(id: number) {


        this.actionService.updateAction(id, this.actionSelected).subscribe({
            next: (updatedAction) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Action modifiée',
                    detail: 'L\'action a été modifiée avec succès.'
                });
                this.displaySidebar = false;  // Fermer le sidebar après la mise à jour
            },
            error: (error) => {
                console.error('Erreur lors de la mise à jour de l\'action:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Une erreur s\'est produite lors de la mise à jour.'
                });
            }
        });
    }

    confirmDeleteAction(actionId: number): void {
        this.confirmationService.confirm({
            message: 'Êtes-vous sûr de vouloir supprimer cette action ?',
            header: 'Confirmation de suppression',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui', // Bouton "Yes" remplacé par "Oui"
            rejectLabel: 'Non', // Bouton "No" remplacé par "Non"
            accept: () => {
                this.deleteAction(actionId);
            },
            reject: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Action annulée',
                    detail: 'Vous avez annulé la suppression',
                });
            }
        });
    }


    deleteAction(actionId: number): void {
        this.actionService.deleteAction(actionId).subscribe({
            next: (response) => {

                // Update UI to reflect deletion
                // Show success toast
                this.messageService.add({
                    severity: 'success',
                    summary: 'Delete Successful',
                    detail: 'Action supprimée avec succès!',
                    life: 3000
                });
                // Mettre à jour la liste locale des actions
                this.actions = this.actions.filter(action => action.id !== actionId);

            },
            error: (err) => {

                // Show error toast
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: err.error?.message || 'Erreur suppression action',
                    life: 3000
                });
            }
        });
    }


    showViewActionDialog(id: number): void {
        this.actionService.getActionById(id).subscribe(
            (data) => {
                this.selectedAction = data; // Stocke les détails du besoin récupérés
                this.displayActionsDetailsDialog = true; // Affiche le dialog
            },
            (error) => {
                console.error('Erreur lors de la récupération des données du besoin:', error);
            }
        );
    }


    onEyeClick(event: MouseEvent, besoinId: number) {
        event.stopPropagation(); // Empêche la fermeture du dropdown
        this.showViewBesoinDialog(besoinId); // Affiche le besoin dans une boîte de dialogue
    }

    showViewBesoinDialog(id: number): void {
        this.besoinService.getBesoinById(id).subscribe(
            (data) => {
                this.selectedBesoin = data; // Stocke les détails du besoin récupérés
                this.displayBesoinDetailsDialog = true; // Affiche le dialog
            },
            (error) => {
                console.error('Erreur lors de la récupération des données du besoin:', error);
            }
        );
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
