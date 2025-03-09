import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AutoCompleteModule} from "primeng/autocomplete";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {DecimalPipe, NgIf} from "@angular/common";
import {FileUploadModule} from "primeng/fileupload";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {PaginatorModule} from "primeng/paginator";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ToastModule} from "primeng/toast";
import {SocieteService} from "../../../demo/service/societe.service";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {EncryptionServiceService} from "../../../demo/service/encryption-service.service";
import {finalize} from "rxjs";

@Component({
  selector: 'app-societe-form',
  standalone: true,
    imports: [
        AutoCompleteModule,
        ButtonModule,
        CardModule,
        DecimalPipe,
        FileUploadModule,
        InputNumberModule,
        InputTextModule,
        InputTextareaModule,
        NgIf,
        PaginatorModule,
        ProgressSpinnerModule,
        ReactiveFormsModule,
        ToastModule
    ],
  templateUrl: './societe-form.component.html',
  styleUrl: './societe-form.component.scss'
})
export class SocieteFormComponent implements OnInit{
    societeForm: FormGroup;
    organigrammesFiles: File[] = [];
    logoFile: File | null = null;
    submitting = false;
    isLoading = false;
    progress: number = 0;

    societeMereOptions: string[] = [];
    filteredSocieteMereOptions: string[] = [];
    selectedSocieteMere: string | null = null;
    constructor(
        private fb: FormBuilder,
        private societeService: SocieteService,
        private messageService: MessageService,
        private router: Router,
        private cdref: ChangeDetectorRef,
        private encryptionService: EncryptionServiceService

    ) {
        this.initializeForm();
    }

    ngOnInit() {
        this.loadSocieteMereOptions();
    }

    private initializeForm() {
        this.societeForm = this.fb.group({
            nom: ['',Validators.required],
            societeMere: [''],
            adresse: [''],
            capitalSocial: [null],
            rcs: [''],
            villeRcs: [''],
            secteur: ['', Validators.required],
            // besoins: this.fb.array([this.createBesoin()])
        });
    }



    onFileSelect(event: any, field: string) {
        if (field === 'organigrammes') {
            if (event.files) {
                this.organigrammesFiles = Array.from(event.files);
                this.messageService.add({
                    severity: 'info',
                    summary: 'Files Selected',
                    detail: `${this.organigrammesFiles.length} organization chart(s) selected`
                });
            }
        } else if (field === 'logo') {
            if (event.files?.[0]) {
                this.logoFile = event.files[0];
                this.messageService.add({
                    severity: 'info',
                    summary: 'Logo Selected',
                    detail: 'Company logo has been selected'
                });
            }
        }
    }

    clearFiles(field: string) {
        if (field === 'organigrammes') {
            this.organigrammesFiles = [];
        } else if (field === 'logo') {
            this.logoFile = null;
        }
    }

    validateFileSize(file: File): boolean {
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            this.messageService.add({
                severity: 'error',
                summary: 'File Too Large',
                detail: `${file.name} exceeds 5MB limit`
            });
            return false;
        }
        return true;
    }

    onSubmit() {
        if (this.societeForm.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please fill in all required fields correctly'
            });
            return;
        }

        // Validate file sizes
        if (this.logoFile && !this.validateFileSize(this.logoFile)) return;
        for (const file of this.organigrammesFiles) {
            if (!this.validateFileSize(file)) return;
        }

        const formData = new FormData();
        formData.append('societeData', JSON.stringify(this.societeForm.value));

        if (this.logoFile) {
            formData.append('logo', this.logoFile);
        }

        this.organigrammesFiles.forEach((file) => {
            formData.append('organigrammes', file);
        });

        this.isLoading = true;
        this.simulateProgress();

        this.societeService.createSociete(formData).pipe(
            finalize(() => {
                this.isLoading = false; // Cache le spinner
                this.progress = 100; // Terminer à 100 %
                this.cdref.detectChanges(); // Force la mise à jour de la vue
                setTimeout(() => (this.progress = 0), 1000); // Réinitialise après 1s
            })
        ).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Société crée avec succès'
                });
                const id = response.id; // Assurez-vous que 'id' est bien une chaîne valide
                if (id) {
                    const encryptedId = this.encryptionService.encryptId(id.toString());
                    this.redirectUpdate(encryptedId);
                    // Attendre 2 secondes avant de rediriger
                    setTimeout(() => {
                        this.redirectUpdate(encryptedId);
                    }, 2000);
                } else {
                    console.error('Invalid ID received');
                }

                this.resetForm();
            },
            error: (error) => {
                console.error('Error creating societe', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error?.message || 'Failed to create company. Please try again.'
                });
            },
            complete: () => {
                this.submitting = false;
            }
        });
    }
    redirectUpdate(id: string) {
        this.router.navigate([`/back-office/societe/societeList`]);
    }

    simulateProgress() {
        this.progress = 0; // Démarrer à 0 %
        const interval = setInterval(() => {
            if (this.progress < 90) {
                this.progress += Math.random() * 10; // Simule une progression
            } else {
                clearInterval(interval); // Arrêter après 90 %
            }
        }, 500); // Mise à jour toutes les 300ms
    }

    private resetForm() {
        this.initializeForm();
        this.organigrammesFiles = [];
        this.logoFile = null;
    }

    // Validation helpers
    isFieldInvalid(fieldName: string): boolean {
        const field = this.societeForm.get(fieldName);
        return field ? field.invalid && (field.dirty || field.touched) : false;
    }

    getErrorMessage(fieldName: string): string {
        const control = this.societeForm.get(fieldName);
        if (control?.errors) {
            if (control.errors['required']) return 'This field is required';
            if (control.errors['minlength']) return 'Input is too short';
            if (control.errors['min']) return 'Value must be greater than 0';
            if (control.errors['pattern']) return 'Invalid format';
        }
        return '';
    }

    /*----------Besoin Section No need For now--------------*/

    // get besoins(): FormArray {
    //   return this.societeForm.get('besoins') as FormArray;
    // }

    // createBesoin(): FormGroup {
    //   return this.fb.group({
    //     titre: ['', Validators.required]
    //   });
    // }

    // addBesoin() {
    //   if (this.besoins.length < 10) { // Limit the number of needs to 10
    //     this.besoins.push(this.createBesoin());
    //   } else {
    //     this.messageService.add({
    //       severity: 'warn',
    //       summary: 'Maximum Limit',
    //       detail: 'You can only add up to 10 needs'
    //     });
    //   }
    // }

    // removeBesoin(index: number) {
    //   if (this.besoins.length > 1) {
    //     this.besoins.removeAt(index);
    //   } else {
    //     this.messageService.add({
    //       severity: 'info',
    //       summary: 'Minimum Required',
    //       detail: 'At least one need is required'
    //     });
    //   }
    // }


    loadSocieteMereOptions() {
        this.societeService.getAllSocietes().subscribe({
            next: (societes) => {
                this.societeMereOptions = societes.map(societe => societe.nom);
            },
            error: (err) => {
                console.error('Erreur lors du chargement des sociétés :', err);
            }
        });
    }

    filterSocieteMere(event: any) {
        const query = event.query.toLowerCase();
        this.filteredSocieteMereOptions = this.societeMereOptions.filter(option =>
            option.toLowerCase().includes(query)
        );
    }
}
