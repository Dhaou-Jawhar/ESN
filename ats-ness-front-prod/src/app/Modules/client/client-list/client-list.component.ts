import {Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {ChartModule} from "primeng/chart";
import {CvUploadComponent} from "../../candidat/cv-upload/cv-upload.component";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {MultiSelectModule} from "primeng/multiselect";
import {NgxStarsModule} from "ngx-stars";
import {ReactiveFormsModule} from "@angular/forms";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "primeng/api";
import {SliderModule} from "primeng/slider";
import {TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {ClientService} from "../../../demo/service/client.service";
import {DividerModule} from "primeng/divider";
import {Router} from "@angular/router";
import {EncryptionServiceService} from "../../../demo/service/encryption-service.service";

@Component({
  selector: 'app-client-list',
  standalone: true,
    imports: [
        ButtonModule,
        CalendarModule,
        ChartModule,
        CvUploadComponent,
        DatePipe,
        DialogModule,
        DropdownModule,
        InputTextModule,
        MultiSelectModule,
        NgIf,
        NgxStarsModule,
        ReactiveFormsModule,
        RippleModule,
        SharedModule,
        SliderModule,
        TableModule,
        ToastModule,
        DividerModule,
        NgForOf
    ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss'
})
export class ClientListComponent implements OnInit{
    clients: any[] = [];
    page = 0;
    size = 2;
    totalElements = 0;
    isLoading = false;
    expandedRows: { [key: string]: boolean } = {};
    selectedClient: any = null;
    displayReferentielDialog: boolean = false;
    displayOrganigrammeDialog: boolean = false;
    displayLinkedInDialog: boolean = false;
    displayProspectionDialog: boolean = false;

    constructor(private clientService: ClientService, private router: Router,private encryptionService: EncryptionServiceService) {}


    ngOnInit(): void {
        this.loadClients()
    }

    // Méthode pour charger les clients
    loadClients(): void {
        if (this.isLoading) return; // Empêcher les appels simultanés
        this.isLoading = true;

        this.clientService.getClients(this.page, this.size).subscribe(
            (response) => {
                this.clients = [...this.clients, ...response.content]; // Ajouter les nouveaux clients
                this.totalElements = response.totalElements; // Mettre à jour le total
                this.isLoading = false;

                // Vérifiez si la page est complète et s'il reste d'autres données à charger
                if (
                    this.clients.length < this.totalElements && // Tous les clients ne sont pas encore chargés
                    response.content.length === this.size // La page actuelle est complète
                ) {
                    this.loadMore(); // Charger automatiquement la page suivante
                }
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
        this.loadClients();
    }

    // Charger une page spécifique
    loadPage(page: number): void {
        // Si l'utilisateur revient en arrière, évitez les doublons
        if (page < this.page) {
            this.page = page;
            this.clients = this.clients.slice(0, page * this.size);
        } else {
            this.page = page;
        }
        this.loadClients();
    }

    navigateToAddClient(): void {
        this.router.navigate(['/back-office/client/add']);
    }
    navigateToEditClient(clientId: number): void {
        try {
            console.log('Type de societeId:', typeof clientId);
            console.log('Valeur de societeId:', clientId);

            const encryptedId = this.encryptionService.encryptId(clientId);
            console.log('ID Encrypté:', encryptedId);

            const encodedId = encodeURIComponent(encryptedId);
            console.log('ID Encodé pour URL:', encodedId);

            this.router.navigate(['back-office/client/edit', encodedId]);

        } catch (error) {
            console.error('Erreur lors de la navigation:', error);
        }
    }

    showReferentiel(client: any): void {
        this.selectedClient = client;
        this.displayReferentielDialog = true;
    }
    showOrganigramme(client: any): void {
        this.selectedClient = client;
        this.displayOrganigrammeDialog = true;
    }

    showLinkedIn(client: any): void {
        this.selectedClient = client;
        this.displayLinkedInDialog = true;
    }
    showProspection(client: any): void {
        this.selectedClient = client;
        this.displayProspectionDialog = true;
    }

}
