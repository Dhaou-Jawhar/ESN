import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {CardModule} from "primeng/card";
import {CheckboxModule} from "primeng/checkbox";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DatePipe, DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {DialogModule} from "primeng/dialog";
import {DividerModule} from "primeng/divider";
import {DropdownModule} from "primeng/dropdown";
import {FieldsetModule} from "primeng/fieldset";
import {FileUploadModule} from "primeng/fileupload";
import {FormArray, FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {MultiSelectModule} from "primeng/multiselect";
import {PaginatorModule} from "primeng/paginator";
import {PanelModule} from "primeng/panel";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {SidebarModule} from "primeng/sidebar";
import {TabViewModule} from "primeng/tabview";
import {TagModule} from "primeng/tag";
import {ToastModule} from "primeng/toast";
import {TooltipModule} from "primeng/tooltip";
import {Societe} from "../../../demo/models/societe";
import {Besoin} from "../../../demo/models/besoin";
import {BesoinsTechnologies} from "../../../demo/models/BesoinsTechnologies";
import {Referentiel} from "../../../demo/models/Referentiel";
import {ProfilReferentiel} from "../../../demo/models/ProfilReferentiel";
import {ProfilBesoin} from "../../../demo/models/profileBesoin";
import {SocieteService} from "../../../demo/service/societe.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BesoinService} from "../../../demo/service/besoin.service";
import {EncryptionServiceService} from "../../../demo/service/encryption-service.service";
import {finalize} from "rxjs";
import {profils, segments, sousSegmentsMap, technologiesMap} from "../../../../../ReferentielDefinition";
import {TableModule} from "primeng/table";
import {ClientService} from "../../../demo/service/client.service";
import {SocieteClientsComponent} from "../societe-clients/societe-clients.component";

@Component({
  selector: 'app-societe-update',
  standalone: true,
    imports: [
        ButtonModule,
        CalendarModule,
        CardModule,
        CheckboxModule,
        ConfirmDialogModule,
        DatePipe,
        DecimalPipe,
        DialogModule,
        DividerModule,
        DropdownModule,
        FieldsetModule,
        FileUploadModule,
        FormsModule,
        InputNumberModule,
        InputTextModule,
        InputTextareaModule,
        MultiSelectModule,
        NgForOf,
        NgIf,
        PaginatorModule,
        PanelModule,
        ProgressSpinnerModule,
        ReactiveFormsModule,
        SharedModule,
        SidebarModule,
        TabViewModule,
        TagModule,
        ToastModule,
        TooltipModule,
        TableModule,
        SocieteClientsComponent
    ],
  templateUrl: './societe-update.component.html',
  styleUrl: './societe-update.component.scss'
})
export class SocieteUpdateComponent implements OnInit{
    profils = profils;
    segments = segments;
    sousSegmentsList = {};
    sousSegmentsMap = sousSegmentsMap;
    technologiesMap = technologiesMap;
    sousSegmentsOptions = [];
    technologiesOptions = [];
    segmentsOptions: any[] = [];
    filteredTechnologies = [];
    isLoading = false;
    progress: number = 0;
    societeForm: FormGroup;
    societe: Societe;
    besoins: Besoin[];
    selectedProfiles: string[] = [];
    logoFile: File;
    organigrammeFiles: File[] = [];
    societeId: number;
    originalProfils = profils;
    availableProfils: { label: string, value: string }[][] = [];
    originalTechnologies = technologiesMap
    availableTechnologies: any[][] = [];
    availableTechnologiesUpdate: { label: string, value: string }[][] = [];
    formReferentiel: FormGroup;

    isDialogVisible: boolean = false; // État du dialogue
    selectedClientId: number | null = null; // ID du client sélectionné


    clients: any[] = [];
    page = 0;
    size = 2;
    totalElements = 0;
    expandedRows: { [key: string]: boolean } = {};
    selectedClient: any = null;
    displayReferentielDialog: boolean = false;
    displayOrganigrammeDialog: boolean = false;
    displayLinkedInDialog: boolean = false;
    displayProspectionDialog: boolean = false;

    /*---------Besoin Update------------*/
    besoinForm: FormGroup;
    selectedBesoin: Besoin | null = null;
    displayBesoinSidebar: boolean = false;
    displayBesoinDialog: boolean = false;
    displayBesoinDetailsDialog:boolean=false;
    states = [
        { label: 'Priorité1', value: 'Priorité1' },
        { label: 'Priorité2', value: 'Priorité2' },
        { label: 'Priorité3', value: 'Priorité3' },
        { label: 'Stand By', value: 'Stand By' },
        { label: 'Fermé', value: 'Fermé' }
    ];

    seniorityLevels = [
        { label: 'Junior', value: 'Junior' },
        { label: 'Intermédiaire', value: 'Intermédiaire' },
        { label: 'Confirmé', value: 'Confirmé' },
        { label: 'Senior', value: 'Senior' },
        { label: 'Expert', value: 'Expert' },
        { label: 'Maitre', value: 'Maitre' },
        { label: 'Lead', value: 'Lead' }
    ];
    niveauxTechnos = [
        { label: 'Notions', value: 'Notions' },
        { label: 'Pratique', value: 'Pratique' },
        { label: 'Maitrise', value: 'Maitrise' },
        { label: 'Senior', value: 'Senior' },
        { label: 'Expert', value: 'Expert' },
    ];
    importanceOptions = [
        { label: 'Optionnel', value: 'Optionnel' },
        { label: 'Important', value: 'Important' },
        { label: 'Indispensable', value: 'Indispensable' },
    ];
    besoin: Besoin = {
        titre: '',
        etat: '',
        besoinEnAvanceDePhase: false,
        reccurent: false,
        demarrageASAP: false,
        dateDeDemarrage: '',
        habilitable: false,
        profilBesoins: {},
        referentiel: this.createDefaultReferentiel(), // Ajouter un élément par défaut ici
        besoinsTechnologies:[this.createDefaultBesoinsTechnologies()],
    };
    createDefaultBesoinsTechnologies(): BesoinsTechnologies {
        return {
            id: undefined,
            technologie: '',
            niveau:'',
            importance:'',
            anneesExperience:null,
            besoin: undefined,
        };
    }

    createDefaultReferentiel(): Referentiel {
        return {
            id: undefined,
            segments: [],
            sousSegments: [],
            profilReferentiels: [this.createDefaultProfilReferentiel()],
            technologie: [],
            besoin: undefined,
            candidat:undefined,
        };
    }

    createDefaultProfilReferentiel(): ProfilReferentiel {
        return {
            id: undefined,
            profil: '',
            niveau: '',
            referentiel: undefined,
        };
    }

    profilBesoin: ProfilBesoin = {
        difficultes: '',
        seniorite: null,
        anneesExperienceTotales: 0,
        tjmMinEstime: 0,
        tjmMaxEstime: 0,
        tjmMin: 0,
        tjmMax: 0,
        tjmSouhaite: 0,
        commentaire: '',
        avantages:'',

    };



    senioriteOptions = [
        { label: 'Junior', value: 'Junior' },
        { label: 'Intermédiaire', value: 'Intermédiaire' },
        { label: 'Confirmé', value: 'Confirmé' },
        { label: 'Senior', value: 'Senior' },
        { label: 'Expert', value: 'Expert' },
        { label: 'Maitre', value: 'Maitre' },
        { label: 'Lead', value: 'Lead' }
    ];


    constructor(
        private formBuilder: FormBuilder,
        private societeService: SocieteService,
        private route: ActivatedRoute,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private cdref: ChangeDetectorRef,
        private besoinService:BesoinService,
        private encryptionService: EncryptionServiceService,
        private clientService: ClientService,
        private router: Router,

    ) { }

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    ngOnInit() {
        // this.getSocieteIdFromUrl();
        this.initForm();
        this.initBesoinForm();
        this.subscribeToReferentielChanges();
        this.initializeFilteredTechnologies();
        this.updateAvailableTechnologies();
        this.filterTechnoUpdate();

        // Mettre à jour les technologies disponibles
//      this.updateAvailableTechnologiesUpdate(0);
        this.formReferentiel = this.formBuilder.group({
            besoinsTechnologies: this.formBuilder.array([]),
        });

        if (!this.besoin.referentiel?.profilReferentiels ||
            this.besoin.referentiel.profilReferentiels.length === 0) {
            // @ts-ignore
            this.besoin.referentiel.profilReferentiels = [{}];
        }
        // Initialize available profils for the first dropdown
        this.updateAvailableProfilsUpdate();


        try {
            const id = this.getDecryptedId();
            this.loadSocieteData(id);
        } catch (error) {
            // Gérer l'erreur (redirection, message d'erreur, etc.)
            console.error('Erreur:', error);
        }





        this.societe = {
            nom: '',
            societeMere: '',
            adresse: '',
            siret:null,
            capitalSocial: null,
            rcs: '',
            villeRcs: '',
            secteur:'',
            logo: null
        };

    }
    getDecryptedId(): number {
        try {
            // Récupérer l'ID crypté depuis l'URL
            const encryptedId = this.route.snapshot.paramMap.get('id');

            if (!encryptedId) {
                throw new Error('ID manquant dans l\'URL');
            }

            // Décoder l'URL puis décrypter
            const decodedId = decodeURIComponent(encryptedId);
            const decryptedId = this.encryptionService.decryptId(decodedId);

            // Convertir en nombre
            const idAsNumber = parseInt(decryptedId, 10);

            if (isNaN(idAsNumber)) {
                throw new Error('ID invalide après décryption');
            }

            return idAsNumber;

        } catch (error) {
            console.error('Erreur lors de la récupération de l\'ID:', error);
            throw error; // Propager l'erreur pour la gérer au niveau supérieur
        }
    }
    getSocieteIdFromUrl() {
        this.societeId = +this.route.snapshot.paramMap.get('id');

        if (!this.besoin.referentiel) {
            this.besoin.referentiel = this.createDefaultReferentiel();
        }
        // Définir initialement les options
        this.segments = segments; // Assurez-vous que `segments` est défini ailleurs dans votre composant ou service
        this.sousSegmentsList = this.sousSegmentsList; // Assurez-vous que `sousSegmentsList` est défini ailleurs dans votre composant ou service
        this.technologiesMap = technologiesMap;
    }



    initForm() {
        this.societeForm = this.formBuilder.group({
            nom: ['', Validators.required],
            societeMere: [''],
            adresse: [''],
            capitalSocial: ['', Validators.required],
            rcs: [''],
            villeRcs: [''],
            secteur: ['', Validators.required],
            besoins: [[]]
        });
    }

    loadSocieteData(id:number) {
        this.societeService.getSocieteByid(id).subscribe({
            next: (societe) => {
                this.societe = societe;
                this.clients=societe.clients
                console.warn("data",societe)
                this.populateForm();
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Load Error',
                    detail: 'Failed to load société information',
                    life: 3000
                });
                console.error('Error loading societe:', error);
            }
        });
    }

    populateForm() {
        this.societeForm.patchValue({
            nom: this.societe.nom,
            societeMere: this.societe.societeMere,
            adresse: this.societe.adresse,
            capitalSocial: this.societe.capitalSocial,
            rcs: this.societe.rcs,
            villeRcs: this.societe.villeRcs,
            secteur:this.societe.secteur

        });
        console.warn("secteur",this.societe.secteur);
        //this.selectedBesoinsTitles = this.besoins?.map(b => b.titre) || [];
        this.societe.logo = this.societe.logo || '';
        this.societe.organigramme = this.societe.organigramme || [];
    }

    onLogoChange(event: any) {
        if (event.files && event.files.length > 0) {
            this.logoFile = event.files[0];
            this.messageService.add({
                severity: 'info',
                summary: 'Logo Selected',
                detail: `File "${this.logoFile.name}" selected`,
                life: 3000
            });
        }
    }

    onOrganigrammeChange(event: any) {
        if (event.files && event.files.length > 0) {
            this.organigrammeFiles = Array.from(event.files);
            this.messageService.add({
                severity: 'info',
                summary: 'Files Selected',
                detail: `${this.organigrammeFiles.length} file(s) selected`,
                life: 3000
            });
        }
    }

    getFileNameFromUrl(url: string): string {
        return url.substring(url.lastIndexOf('/') + 1);
    }

    downloadOrganigramme(organigrammeUrl: string): void {
        fetch(organigrammeUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = this.getFileNameFromUrl(organigrammeUrl); // Nom du fichier
                link.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => console.error('Error downloading file:', error));
    }


    onSubmit(societeForm: NgForm) {
        if (societeForm.valid) {
            this.societeService.updateSociete(
                this.getDecryptedId(),
                societeForm.value, // Données soumises ici
                this.logoFile,
                this.organigrammeFiles
            ).subscribe({
                next: (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Mise à jour réussie',
                        detail: 'Les informations de la société ont été mises à jour avec succès',
                        life: 3000
                    });

                    this.loadSocieteData(this.getDecryptedId());


                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur de mise à jour',
                        detail: 'Impossible de mettre à jour les informations de la société',
                        life: 3000
                    });
                    console.error('Erreur :', error);
                }
            });
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Erreur de validation',
                detail: 'Veuillez remplir correctement tous les champs obligatoires.',
                life: 3000
            });
        }
    }




    // Helper method to mark all form controls as touched
    private markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();

            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }


    onFileSelect(event: any, field: string) {
        if (field === 'organigrammes') {
            if (event.files) {
                this.organigrammeFiles = Array.from(event.files);
                this.messageService.add({
                    severity: 'info',
                    summary: 'Files Selected',
                    detail: `${this.organigrammeFiles.length} organization chart(s) selected`
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

    deleteOrganigram(societeId: number, organigrammeUrl: string): void {
        this.societeService.deleteOrganigram(societeId, organigrammeUrl).subscribe({
            next: (response) => {
                console.log('Organigramme supprimé avec succès:', response);

                // Mettre à jour l'interface pour refléter la suppression
                this.societe.organigramme = this.societe.organigramme.filter(url => url !== organigrammeUrl);

                // Afficher la notification de succès
                this.messageService.add({
                    severity: 'success',
                    summary: 'Suppression réussie',
                    detail: 'L\'organigramme a été supprimé avec succès',
                    life: 3000
                });
            },
            error: (err) => {
                console.error('Erreur lors de la suppression de l\'organigramme:', err);

                // Afficher la notification d\'erreur
                this.messageService.add({
                    severity: 'error',
                    summary: 'Échec de la suppression',
                    detail: err.error?.message || 'Échec de la suppression de l\'organigramme',
                    life: 3000
                });
            }
        });
    }


    confirmDeleteOrganigram(societeId: number, organigrammeUrl: string): void {
        this.confirmationService.confirm({
            message: 'Êtes-vous sûr de vouloir supprimer cet organigramme ?',
            header: 'Confirmation de suppression',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui', // Bouton "Yes" remplacé par "Oui"
            rejectLabel: 'Non', // Bouton "No" remplacé par "Non"
            accept: () => {
                this.deleteOrganigram(societeId, organigrammeUrl);
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


    openImageInNewTab(imageUrl: string): void {
        const newTab = window.open();
        if (newTab) {
            newTab.document.write(`
        <html>
          <head>
            <title>Organigramme Fullscreen - Ness Tech -</title>
            <style>
              body {
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #000;
              }
              img {
                max-width: 100%;
                max-height: 100%;
              }
            </style>
          </head>
          <body>
            <img src="${imageUrl}" alt="Organigramme Fullscreen">
          </body>
        </html>
      `);
            newTab.document.close();
        } else {
            console.error("Failed to open new tab");
        }
    }


    /*---------------Edit Besoin-----------------------*/
    createBesoinTechnologie(): FormGroup {
        return this.formBuilder.group({
            id: [null], // Vous pouvez initialiser à null ou à une valeur par défaut
            technologie: ['', Validators.required], // Technologie est obligatoire
            niveau: ['', Validators.required], // Niveau est obligatoire
            importance: ['', Validators.required], // Importance est obligatoire
            besoin: ['', Validators.required], // Besoin est obligatoire (ajoutez ou ajustez selon votre modèle)
        });
    }

    initBesoinForm() {
        this.besoinForm = this.formBuilder.group({
            titre: ['', Validators.required],
            reference: [''],
            etat: [''],
            dateDeDemarrage: ['', Validators.required],
            plateforme: [''],
            besoinEnAvanceDePhase: [false],
            // Vérifiez que ce champ est bien initialisé
            reccurent: [false],
            habilitable: [false],
            referentiel: this.formBuilder.group({
                profilReferentiels: this.formBuilder.array([this.createProfilReferentielFormGroup()]),
                segments: [[], Validators.required],
                sousSegments: [[], Validators.required],
                technologie: [[], Validators.required], // Assurez-vous que ce contrôle est bien présent ici
            }),
            besoinsTechnologies: this.formBuilder.array([]),

            profilBesoins: this.formBuilder.group({
                difficultes: [''],
                seniorite: [''],
                anneesExperienceTotales: [0],
                tjmMinEstime: [0],
                tjmMaxEstime: [0],
                tjmMin: [0],
                tjmMax: [0],
                tjmSouhaite: [0],
                avantages: [''],
                commentaire: ['']
            }),

        });
    }
    get profilReferentiels(): FormArray {
        return this.besoinForm.get('referentiel.profilReferentiels') as FormArray;
    }


    editBesoin(besoin: Besoin) {
        this.selectedBesoin = besoin;
        console.warn("besoin",besoin)
        console.warn("ccccccc",this.availableTechnologies)

        // Patch des valeurs du formulaire
        this.besoinForm.patchValue({
            ...besoin,
            profilBesoins: besoin.profilBesoins || {
                difficultes: '',
                seniorite: '',
                anneesExperienceTotales: 0,
                tjmMinEstime: 0,
                tjmMaxEstime: 0,
                tjmMin: 0,
                tjmMax: 0,
                tjmSouhaite: 0,
                commentaire: '',
                avantages: '',
            },
            referentiel: besoin.referentiel || {
                profilReferentiels: besoin.referentiel.profilReferentiels || [],
                segments: [],
                sousSegments: [],
                technologie: []
            },

        });

        // Clear and repopulate the FormArray
        this.besoinsTechnologiesArray.clear();
        console.warn(besoin.besoinsTechnologies)
        if (besoin.besoinsTechnologies) {
            besoin.besoinsTechnologies.forEach((tech: any) => {
                this.besoinsTechnologiesArray.push(
                    this.formBuilder.group({
                        technologie: [tech.technologie || '', Validators.required],
                        niveau: [tech.niveau || '', Validators.required],
                        importance: [tech.importance || '', Validators.required],
                        anneesExperience: [tech.anneesExperience || undefined, Validators.required]

                    })
                );
            });
        } else {
            this.addBesoinTechnologies();
        }
        // Charger les options des segments, sous-segments et technologies en fonction du besoin
        this.initializeSelections(besoin.referentiel);

        // Afficher le sidebar
        this.displayBesoinSidebar = true;
        this.filterTechnoUpdate()
    }
    get besoinsTechnologiesArray(): FormArray {
        return this.besoinForm.get('besoinsTechnologies') as FormArray;
    }

    createProfilReferentielFormGroup() {
        return this.formBuilder.group({
            profil: ['', Validators.required],
            niveau: ['', Validators.required],
            anneesExperience: ['', Validators.required],
        });
    }

    addBesoinTechnologies() {
        if (this.besoin.besoinsTechnologies.length < 5) {
            const besoinsTechnologiesArray = this.besoinForm.get('besoinsTechnologies') as FormArray;
            besoinsTechnologiesArray.push(this.formBuilder.group({
                technologie: ['', Validators.required],
                niveau: ['', Validators.required],
                importance: ['', Validators.required]
            }));
        }
    }



    saveBesoin() {
        this.isLoading = true;
        this.simulateProgress(); // Simule une progression parallèle au traitement

        const updatedBesoin = {
            ...this.selectedBesoin,
            ...this.besoinForm.value,
        };

        this.societeService
            .updateSocieteBesoin(this.getDecryptedId(), updatedBesoin)
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
                    console.log('Besoin updated successfully:', response);

                    // Logique de mise à jour de la liste des besoins
                    if (this.besoins) {
                        const index = this.besoins.findIndex(
                            (b) => b.id === updatedBesoin.id
                        );
                        if (index !== -1) {
                            this.besoins[index] = updatedBesoin;
                        }
                    }

                    this.displayBesoinSidebar = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Besoin mis à jour',
                        detail: 'Le besoin a bien été mis à jour!',
                    });
                    console.warn(this.getDecryptedId())

                    this.loadSocieteData(this.getDecryptedId());

                },
                (error) => {
                    console.error('Error updating besoin:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Update Failed',
                        detail: 'Erreur de mise à jour réessayez plus tard !',
                    });
                }
            );

    }

    simulateProgress() {
        this.progress = 0; // Démarrer à 0 %
        const interval = setInterval(() => {
            if (this.progress < 95) {
                this.progress += Math.random() * 10; // Simule une progression
                console.log('Progress:', this.progress); // Débogage
            } else {
                clearInterval(interval); // Arrêter après 90 %
                console.log('Progress complete');
            }
        }, 175); // Mise à jour toutes les 300ms
    }


    confirmDeleteBesoin(besoinId: number): void {
        this.confirmationService.confirm({
            message: 'Êtes-vous sûr de vouloir supprimer ce besoin ?',
            header: 'Confirmation de suppression',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui', // Bouton "Yes" remplacé par "Oui"
            rejectLabel: 'Non', // Bouton "No" remplacé par "Non"
            accept: () => {
                this.deleteBesoin(besoinId);
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


    deleteBesoin(besoinId: number): void {
        this.societeService.deleteBesoin(besoinId).subscribe({
            next: (response) => {
                console.log('Besoin deleted successfully:', response);

                // Update UI to reflect deletion
                this.societe.besoins = this.societe.besoins.filter((besoin: any) => besoin.id !== besoinId);

                // Show success toast
                this.messageService.add({
                    severity: 'success',
                    summary: 'Delete Successful',
                    detail: 'Besoin deleted successfully',
                    life: 3000
                });
            },
            error: (err) => {
                console.error('Error deleting besoin:', err);

                // Show error toast
                this.messageService.add({
                    severity: 'error',
                    summary: 'Delete Failed',
                    detail: err.error?.message || 'Failed to delete besoin',
                    life: 3000
                });
            }
        });
    }
    /*----View Besoin------*/
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


    /*----Add Besoin------*/
    showAddBesoinDialog(): void {
        this.displayBesoinDialog = true;
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
    onSubmitBesoin(form: any): void {
        if (form.valid) {
            this.besoin.dateDeDemarrage = new Date(this.besoin.dateDeDemarrage).toISOString();
            this.besoin.profilBesoins = this.profilBesoin;
            this.isLoading = true;
            this.simulateProgress1();
            this.societeService.createBesoinAndAssignToSociete(this.getDecryptedId(), this.besoin)
                .pipe(
                    finalize(() => {
                        this.isLoading = false; // Cache le spinner
                        this.progress = 100; // Terminer à 100 %
                        this.cdref.detectChanges(); // Force la mise à jour de la vue
                        setTimeout(() => (this.progress = 0), 1000); // Réinitialise après 1s
                    })
                )
                .subscribe({
                    next: (response) => {
                        console.log('Success:', response);
                        this.displayBesoinDialog = false;

                        // Success toast
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'Le besoin a été créé avec succès',
                            life: 3000
                        });

                        this.loadSocieteData(this.getDecryptedId());

                    },
                    error: (error) => {
                        console.error('Error:', error);

                        // Error toast
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Erreur lors de la création du besoin. Veuillez réessayer.',
                            life: 5000
                        });
                    }
                });
        } else {
            // Form validation error toast
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Veuillez remplir tous les champs obligatoires',
                life: 5000
            });
        }
    }

    getEtatSeverity(etat: string): string {
        switch (etat?.toLowerCase()) {
            case 'priorité1': // All values are lowercase
                return 'success';
            case 'priorité2':
                return 'warning';
            case 'priorité3':
                return 'info';
            case 'stand by':
                return 'secondary';
            case 'fermé':
                return 'danger';
            default:
                return 'secondary';
        }
    }



    initializeSelections(referentiel: any): void {
        const selectedSegments = referentiel?.segments || [];
        this.segmentsOptions = [...this.segments]; // Charger toutes les options possibles des segments

        // Charger les sous-segments et technologies basés sur les segments sélectionnés
        this.loadOptionsForSegments(selectedSegments);
    }
    // Fonction qui charge automatiquement les sous-segments et les technologies
    // Charger les sous-segments et technologies basés sur les segments sélectionnés
    loadOptionsForSegments(selectedSegments: string[]): void {
        this.sousSegmentsOptions = [];
        this.technologiesOptions = [];

        if (selectedSegments.length === 0) {
            this.besoinForm.get('referentiel.sousSegments')?.setValue([]);
            this.besoinForm.get('referentiel.technologie')?.setValue([]);
            return;
        }

        // Charger les sous-segments
        const allSousSegments = new Set<any>();
        selectedSegments.forEach((segment: string) => {
            const sousSegmentsForSegment = this.sousSegmentsMap[segment] || [];
            sousSegmentsForSegment.forEach((sousSegment: any) => allSousSegments.add(sousSegment));
        });
        this.sousSegmentsOptions = Array.from(allSousSegments);

        // Charger les technologies basées sur les sous-segments sélectionnés
        const selectedSousSegments = this.besoinForm.get('referentiel.sousSegments')?.value || [];
        this.updateTechnologies(selectedSousSegments);
    }

// Mettre à jour les options de technologies basées sur les sous-segments sélectionnés
    updateTechnologies(selectedSousSegments: string[]): void {
        if (selectedSousSegments.length === 0) {
            this.technologiesOptions = [];
            return;
        }

        const allTechnologies = new Set<any>();
        selectedSousSegments.forEach((sousSegment: string) => {
            const technologiesForSousSegment = this.technologiesMap[sousSegment] || [];
            technologiesForSousSegment.forEach((tech: any) => allTechnologies.add(tech));
        });

        this.technologiesOptions = Array.from(allTechnologies);
    }


    // Les événements onChange peuvent être utilisés pour mettre à jour les valeurs dynamiquement
    onSegmentChange(event: any): void {
        const selectedSegments = event.value;
        this.loadOptionsForSegments(selectedSegments);
    }

    onTechnoChange(event: any): void {
        const selectedSousSegments = event.value;
        this.updateTechnologies(selectedSousSegments);
    }
    filterTechno(): void {
        this.filteredTechnologies = this.technologiesOptions.filter(option =>
            this.besoin.referentiel.technologie.includes(option.value)
        );
        console.warn(this.filteredTechnologies)
        this.updateAvailableTechnologies();


    }

    //////////////////////// Mapping des valeurs de segments,sous-segments et technologies///////////////////////////

    // Fonction générique pour mapper un tableau de valeurs vers leurs labels
    mapValuesToLabels(values: string[], mapping: { label: string, value: string }[]): string[] {
        return values.map(value => {
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

// Fonction pour mapper les segments
    mapSegmentsToLabels(values: string[], segmentsMap: { label: string, value: string }[]): string[] {
        return this.mapValuesToLabels(values, segmentsMap);
    }

    // Convertir les valeurs en labels
    getSegmentsLabels(): string[] {
        return this.mapValuesToLabels(this.selectedBesoin.referentiel.segments, this.segments);
    }

    getSousSegmentsLabels(): string[] {
        return this.mapSousSegmentsToLabels(this.selectedBesoin.referentiel.sousSegments, this.sousSegmentsMap);
    }

    getProfilLabels(): string[] {
        if (
            this.selectedBesoin.referentiel &&
            this.selectedBesoin.referentiel.profilReferentiels.length > 0
        ) {
            const firstProfil = this.selectedBesoin.referentiel.profilReferentiels[0].profil;
            return this.mapValuesToLabels([firstProfil], this.profils); // Convertit `firstProfil` en tableau
        } else {
            return [];
        }
    }

    getTechnologiesLabels(): string[] {
        return this.mapTechnologiesToLabels(this.selectedBesoin.referentiel.technologie, this.technologiesMap);
    }
    getDecryptedIdFromRoute(): number | null {
        const encryptedId = this.route.snapshot.paramMap.get('id');
        if (encryptedId) {
            const decryptedIdString = this.encryptionService.decryptId(encryptedId);
            console.log('Decrypted ID String:', decryptedIdString);

            // Vérification que la chaîne décryptée est valide et convertir en nombre
            if (decryptedIdString && typeof decryptedIdString === 'string') {
                const decryptedId = parseInt(decryptedIdString, 10);
                if (!isNaN(decryptedId)) {
                    return decryptedId;  // Retourner l'ID déchiffré
                } else {
                    console.error('L\'ID déchiffré est invalide');
                }
            } else {
                console.error('Erreur de déchiffrement, la valeur obtenue n\'est pas une chaîne valide');
            }
        } else {
            console.error('L\'ID chiffré est manquant dans l\'URL');
        }
        return null; // Retourner null si décryptage échoue
    }

/////////////////////////////// Beoins technologies //////////////////////////////////
    initializeFilteredTechnologies(): void {
        const technologies = this.besoinForm.get('referentiel')?.get('technologie')?.value || [];
        this.updateFilteredTechnologies(technologies);
    }
    updateFilteredTechnologies(technologies: any[]): void {
        this.filteredTechnologies = technologies.map(tech => ({
            label: tech, // Adaptez selon votre structure
            value: tech
        }));
    }
    subscribeToReferentielChanges(): void {
        this.besoinForm.get('referentiel')?.get('technologie')?.valueChanges.subscribe((technologies: any[]) => {
            this.updateFilteredTechnologies(technologies);
            this.resetInvalidTechnologies(technologies);
        });
    }
    resetInvalidTechnologies(validTechnologies: any[]): void {
        this.besoinsTechnologiesArray.controls.forEach(group => {
            const selectedTech = group.get('technologie')?.value;
            if (selectedTech && !validTechnologies.includes(selectedTech)) {
                group.get('technologie')?.setValue(null); // Réinitialise si la technologie n'est plus valide
            }
        });
    }

    addBesoinTechnologie() {
        this.besoin.besoinsTechnologies.push(this.createDefaultBesoinsTechnologies());
        this.updateAvailableTechnologies();

    }

    addBesoinTechnologieUpdate() {
        const newGroup = this.formBuilder.group({
            technologie: [null], // Technologie obligatoire
            niveau: [null],      // Niveau obligatoire
            anneesExperience: [null],
            importance: [null]   // Importance obligatoire
        });

        this.besoinsTechnologiesArray.push(newGroup);

        // Appliquez les technologies filtrées si nécessaire
        // this.filterTechnoUpdate();
        this.besoinsTechnologiesArray.controls.forEach((group,i) => {
            this.updateAvailableTechnologiesUpdate(i);
        })
    }



    removeBesoinTechnologie(index: number) {
        this.besoin.besoinsTechnologies.splice(index, 1);
        this.updateAvailableTechnologies();
    }
    filterTechnoUpdate() {
        const referentielTechnologies = this.besoinForm.get('referentiel')?.get('technologie')?.value || [];

        // Mettre à jour les technologies filtrées pour chaque besoin
        this.filteredTechnologies = referentielTechnologies.map((tech: any) => ({
            label: tech, // Remplacez par `tech.label` si nécessaire
            value: tech // Remplacez par `tech.value` si nécessaire
        }));

        // Valider les sélections existantes
        this.besoinsTechnologiesArray.controls.forEach(group => {
            const selectedTech = group.get('technologie')?.value;
            if (selectedTech && !referentielTechnologies.includes(selectedTech)) {
                group.get('technologie')?.setValue(null); // Réinitialiser la sélection
            }
        });

        // Mettre à jour les technologies disponibles
        //  this.updateAvailableTechnologiesUpdate();
        this.besoinsTechnologiesArray.controls.forEach((group,i) => {
            this.updateAvailableTechnologiesUpdate(i);
        })
    }

    removeBesoinTechnologieUpdate(index: number): void {
        this.besoinsTechnologiesArray.removeAt(index);
        this.updateAvailableTechnologiesUpdate();

    }

/////////////////////////////PROFIL REFERENTIELS////////////////////
    addProfilReferentiel() {
        this.besoin.referentiel?.profilReferentiels.push(this.createDefaultProfilReferentiel());
        this.updateAvailableProfils()

    }
    removeProfilReferentiel(index: number): void {
        if (this.besoin.referentiel.profilReferentiels.length > 1) {
            this.besoin.referentiel.profilReferentiels.splice(index, 1);
            this.updateAvailableProfils()
        }
    }

    addProfilReferentielUpdate() {
        this.profilReferentiels.push(this.createProfilReferentielFormGroup());
        this.updateAvailableProfilsUpdate()
    }
    removeProfilReferentielUpdate(index: number) {
        this.profilReferentiels.removeAt(index);
        this.updateAvailableProfilsUpdate()
    }

    // Update available profils based on current selections
    updateAvailableProfilsUpdate() {
        // Reset available profils array
        this.availableProfils = [];

        // Get all currently selected profils
        const selectedProfils = this.profilReferentiels.controls
            .map(control => control.get('profil').value)
            .filter(value => value !== null);

        // Generate available profils for each dropdown
        for (let i = 0; i < this.profilReferentiels.length; i++) {
            // Filter out already selected profils for this dropdown
            const availableProfilsForIndex = this.originalProfils.filter(
                profil => !selectedProfils.includes(profil.value) ||
                    profil.value === this.profilReferentiels.at(i).get('profil').value
            );

            this.availableProfils.push(availableProfilsForIndex);
        }
    }

    // Method to be called when a profil is selected
    onProfilChange(index: number) {
        this.updateAvailableProfilsUpdate();
    }

    updateAvailableProfils() {
        // Réinitialiser le tableau des profils disponibles
        this.availableProfils = [];

        // Récupérer tous les profils actuellement sélectionnés
        const selectedProfils = this.besoin.referentiel?.profilReferentiels
            .map(pr => pr.profil)
            .filter(profil => profil !== undefined && profil !== null);

        // Générer les profils disponibles pour chaque dropdown
        for (let i = 0; i < this.besoin.referentiel?.profilReferentiels.length; i++) {
            // Filtrer les profils
            const availableProfilsForIndex = this.originalProfils.filter(
                profil =>
                    !selectedProfils.includes(profil.value) ||
                    profil.value === this.besoin.referentiel?.profilReferentiels[i].profil
            );

            this.availableProfils.push(availableProfilsForIndex);
        }
    }

    onProfilChangeAdd(index: number) {
        this.updateAvailableProfils();
    }






    updateAvailableTechnologies() {
        // Récupérer les technologies sélectionnées
        const selectedTechnologies = this.besoin.besoinsTechnologies
            .map(bt => bt.technologie)
            .filter(techno => techno !== undefined && techno !== null);

        console.log('Technologies sélectionnées:', selectedTechnologies);

        // Générer les technologies disponibles pour chaque élément dans `besoinsTechnologies`
        this.availableTechnologies = this.besoin.besoinsTechnologies.map((besoinTech, index) =>
            this.filteredTechnologies.filter(techno => {
                // Vérifier si la technologie est sélectionnée ailleurs
                const isSelectedElsewhere = selectedTechnologies.some(selected =>
                    selected === techno.value &&
                    selected !== besoinTech.technologie // Exclure la technologie actuelle
                );

                console.log(`Tech ${techno.value}, Sélectionnée ailleurs: ${isSelectedElsewhere}`);

                // Inclure la technologie si elle n'est pas sélectionnée ailleurs ou si elle est la technologie actuelle
                return !isSelectedElsewhere || techno.value === besoinTech.technologie;
            })
        );

        console.log('Technologies disponibles:', this.availableTechnologies);
    }

    // Méthode appelée lors du changement de technologie
    onTechnologieChange(index: number) {
        console.warn('Technologies filtrées:', this.filteredTechnologies);

        this.updateAvailableTechnologies();
    }

    updateAvailableTechnologiesUpdate(i:number=0) {
        console.warn(this.filteredTechnologies)
        // Réinitialiser les technologies disponibles pour chaque besoin
        //this.availableTechnologies = this.besoin.besoinsTechnologies.map(() => [...this.filteredTechnologies]);

        // Récupérer les technologies sélectionnées
        const selectedTechnologies = this.besoinsTechnologiesArray.controls
            .map(group => group.get('technologie')?.value)
            .filter((tech): tech is string => tech != null); // Exclure null/undefined
        console.warn("selected technologies",selectedTechnologies);
        // Filtrer les options pour chaque technologie
        this.availableTechnologies[i] = this.besoin.besoinsTechnologies.map(() => [...this.filteredTechnologies])
            .map((options, index) =>

                options.filter(option => {
                    console.warn("optionnnn",option);
                    const currentTech = this.besoinsTechnologiesArray.at(i).get('technologie')?.value;
                    const optionValue = typeof option === 'object' ? option.value : option;

                    return !selectedTechnologies.some(selectedTech =>
                        selectedTech === optionValue && selectedTech !== currentTech
                    );
                })
            )[0];
        console.warn("avaaaaailable",this.availableTechnologies)
        console.warn("aaaaaaaaaaaa",this.besoinsTechnologiesArray.controls)
        console.log(this.besoin.besoinsTechnologies.map(() => [...this.filteredTechnologies])
        )
        console.error(this.besoinsTechnologiesArray.at(i).get('technologie')?.value)
    }

    onTechnologieChangeUpdate(index: number) {
        console.warn(index,this.availableTechnologies,this.besoinsTechnologiesArray.controls)
        this.updateAvailableTechnologiesUpdate(index);
        this.besoinsTechnologiesArray.controls.forEach((group,i) => {
            this.updateAvailableTechnologiesUpdate(i);
        })
    }

    isButtonDisabled(): boolean {
        return this.availableTechnologies && this.availableTechnologies.length
            ? this.availableTechnologies[this.availableTechnologies.length - 1].length === 1
            : true;
    }

    ////////////////////////////CLIENTS SOCI2T2 SECTION////////////////////////////////////////////
    openDialog(clientId: number): void {
        try {
            // Définir l'ID du client sélectionné
            this.selectedClientId = clientId;

            // Ouvrir le dialogue
            this.isDialogVisible = true;

            // // Mettre à jour l'URL avec le paramètre ID sans recharger
            // this.router.navigate(['back-office/societe/editSocieteClients', clientId], {
            //     skipLocationChange: true, // Ne pas afficher dans l'historique
            // });
        } catch (error) {
            console.error('Erreur lors de l’ouverture du dialogue:', error);
        }
    }

    closeDialog(): void {
        this.isDialogVisible = false;
        this.selectedClientId = null;

        // Retirer l'ID de l'URL si nécessaire
        this.router.navigate(['back-office/societe'], { skipLocationChange: true });
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
