import {Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {DialogModule} from "primeng/dialog";
import {DividerModule} from "primeng/divider";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import {MessageService, SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {Societe} from "../../../demo/models/societe";
import {SocieteService} from "../../../demo/service/societe.service";
import {Router} from "@angular/router";
import {EncryptionServiceService} from "../../../demo/service/encryption-service.service";

@Component({
  selector: 'app-societe-list',
  standalone: true,
    imports: [
        ButtonModule,
        DatePipe,
        DialogModule,
        DividerModule,
        InputTextModule,
        NgForOf,
        NgIf,
        RippleModule,
        SharedModule,
        TableModule,
        ToastModule
    ],
  templateUrl: './societe-list.component.html',
  styleUrl: './societe-list.component.scss'
})
export class SocieteListComponent implements OnInit{
    societes: Societe[] = [];
    loading: boolean = true;
    errorMessage: string = '';
    window = window; // To make window available in template
    expandedRows: { [key: string]: boolean } = {};
    displayDialog: boolean = false;
    selectedImage: string | null = null;

    constructor(private societeService: SocieteService, private messageService: MessageService, private router: Router,private encryptionService: EncryptionServiceService) {}

    ngOnInit(): void {
        this.fetchSocietes();
    }

    fetchSocietes(): void {
        this.loading = true;
        this.societeService.getAllSocietes().subscribe({
            next: (data) => {
                this.societes = data.map(societe => ({
                    ...societe,
                    besoin: societe.besoins || [] ,// Initialize as an empty array if undefined
                    besoinCount: (societe.besoins || []).length, // Calculate besoinCount
                    client: societe.clients || []
                }));
                this.loading = false;
            },
            error: (error) => {
                this.errorMessage = 'Failed to load Societe list.';
                this.loading = false;
                console.error(error);
            }
        });
    }


    openImage(url: string) {
        this.selectedImage = url;
        this.displayDialog = true;
    }

    downloadOrganigramme(organigrammeUrl: string): void {
        fetch(organigrammeUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = this.getFileNameFromUrl(organigrammeUrl);
                link.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('Error downloading file:', error);
                // Add error notification
                this.showErrorMessage('Failed to download file. Please try again.');
            });
    }

    getFileNameFromUrl(url: string): string {
        try {
            // First try to get the filename from the URL path
            const urlPath = new URL(url).pathname;
            let fileName = urlPath.split('/').pop() || 'organigramme';

            // Clean up the filename
            fileName = decodeURIComponent(fileName); // Handle URL encoded characters
            fileName = fileName.replace(/[^a-zA-Z0-9-_\.]]/g, '_'); // Replace invalid characters

            // If no extension, add .png as default
            if (!fileName.includes('.')) {
                fileName += '.png';
            }

            return fileName;
        } catch (error) {
            // Fallback if URL parsing fails
            return `organigramme-${Date.now()}.png`;
        }
    }

    showErrorMessage(message: string): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message
        });
        console.error(message);
    }

    navigateToEditSociete(societeId: number): void {
        try {
            console.log('Type de societeId:', typeof societeId);
            console.log('Valeur de societeId:', societeId);

            const encryptedId = this.encryptionService.encryptId(societeId);
            console.log('ID Encrypté:', encryptedId);

            const encodedId = encodeURIComponent(encryptedId);
            console.log('ID Encodé pour URL:', encodedId);

            this.router.navigate(['back-office/societe/editsociete', encodedId]);

        } catch (error) {
            console.error('Erreur lors de la navigation:', error);
        }
    }

    navigateToAddSociete(): void {
        this.router.navigate(['/back-office/societe/AddSociete']);
    }
}
