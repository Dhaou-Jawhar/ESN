import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {PanelModule} from "primeng/panel";
import {CheckboxModule} from "primeng/checkbox";
import {ChipsModule} from "primeng/chips";
import {ButtonModule} from "primeng/button";
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {CalendarModule} from "primeng/calendar";
import {DropdownModule} from "primeng/dropdown";
import {profils, segments, technologiesMap} from "../../../../../ReferentielDefinition";
import {MultiSelectModule} from "primeng/multiselect";
import {InputTextareaModule} from "primeng/inputtextarea";
import {CardModule} from "primeng/card";
import {BesoinsTechnologies} from "../../../demo/models/BesoinsTechnologies";
import {Referentiel} from "../../../demo/models/Referentiel";
import {ProfilReferentiel} from "../../../demo/models/ProfilReferentiel";
import {AutoCompleteModule} from "primeng/autocomplete";
import {SocieteService} from "../../../demo/service/societe.service";
import {DialogModule} from "primeng/dialog";
import {FieldsetModule} from "primeng/fieldset";
import {FileUploadModule} from "primeng/fileupload";
import {MessageService} from "primeng/api";
import {finalize} from "rxjs";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ToastModule} from "primeng/toast";
import {NgxStarsModule} from "ngx-stars";
import {StarsInputComponentComponent} from "../stars-input-component/stars-input-component.component";
import {ClientService} from "../../../demo/service/client.service";
import {Router} from "@angular/router";
import {EncryptionServiceService} from "../../../demo/service/encryption-service.service";


@Component({
  selector: 'app-client-add',
  standalone: true,
    imports: [
        InputNumberModule,
        ReactiveFormsModule,
        PanelModule,
        CheckboxModule,
        FormsModule,
        ChipsModule,
        ButtonModule,
        NgIf,
        NgForOf,
        CalendarModule,
        DropdownModule,
        MultiSelectModule,
        InputTextareaModule,
        CardModule,
        AutoCompleteModule,
        DialogModule,
        FieldsetModule,
        FileUploadModule,
        DecimalPipe,
        ProgressSpinnerModule,
        ToastModule,
        NgxStarsModule,
        StarsInputComponentComponent
    ],
  templateUrl: './client-add.component.html',
  styleUrl: './client-add.component.scss'
})
export class ClientAddComponent implements OnInit{
    clientForm: FormGroup;
    availableProfils: { label: string, value: string }[][] = [];
    originalProfils = profils;
    filteredSocieteMereOptions: string[] = [];
    societeMereOptions: string[] = [];
    isValidSociete: boolean = true;
    displaySocieteDialog: boolean = false;
    societeForm: FormGroup;
    organigrammesFiles: File[] = [];
    logoFile: File | null = null;
    isLoading = false;
    progress: number = 0;
    technologiesMap = Object.values(technologiesMap).flat();
        statuts = [
        { label: 'Client', value: 'Client' },
        { label: 'Prospect', value: 'Prospect' },
        { label: 'Partenaire', value: 'Partenaire' },
    ];
    genre = [
        { label: 'Mr', value: 'Mr' },
        { label: 'Mme', value: 'Mme' },
        { label: 'NC', value: 'NC' },
        { label: 'Autres', value: 'Autres' },

    ];
    preferences = [
        { label: 'SMS', value: 'SMS' },
        { label: 'Mails', value: 'Mails' },
        { label: 'Appels', value: 'Appels' },
        { label: 'Teams', value: 'Teams' },
        { label: 'On site', value: 'On site' },
        { label: 'Fréquence rare', value: 'Fréquence rare' },
        { label: 'Fréquence moyenne', value: 'Fréquence moyenne' },
        { label: 'Fréquence élévée', value: 'Fréquence élévée' },

    ];
    states = [
        { label: 'Priorité1', value: 'Priorité1' },
        { label: 'Priorité2', value: 'Priorité2' },
        { label: 'Priorité3', value: 'Priorité3' },
        { label: 'Stand By', value: 'Stand By' },
        { label: 'Fermé', value: 'Fermé' }
    ];
    niveauxTechnos = [
        { label: 'Notions', value: 'Notions' },
        { label: 'Pratique', value: 'Pratique' },
        { label: 'Maitrise', value: 'Maitrise' },
        { label: 'Senior', value: 'Senior' },
        { label: 'Expert', value: 'Expert' },
    ];

    constructor(private fb: FormBuilder ,
                private societeService:SocieteService,
                private messageService: MessageService,
                private cdref: ChangeDetectorRef,
                private clientService: ClientService,
                private router:Router,
                private encryptionService:EncryptionServiceService,

    ) {}

    ngOnInit(): void {
        this.initForm();
        this.loadSocieteMereOptions();
        this.initializeForm();
    }


    initForm() {
        this.clientForm = this.fb.group({
            // Informations globales
            nom: [''],
            prenom: [''],
            email: ['', [Validators.email]],
            emailSecondaire: ['', [Validators.email]],
            telephonePrso:[''],
            telephonePro:[''],
            localisation: [''],
            secteur: [''],
            poste: [''],
            statut: [''],
            genre: [''],
            preferenceDeCommunication:[[]],
            isAmbassadeur: [false],
            commentaireProfilsRecherches:[''],
            personnalite:[''],
            modeDeFonctionnement:[''],
            intimiteClient:[''],
            societe:this.fb.group({
                nom:[''],
            }),

            // Organigramme
            organigramme: this.fb.group({
                tailleEquipe: [''],
                pourcentagePrestation: [''],
                serviceNiveau: this.fb.array([])
            }),

            // Référentiel
            // referentiel: this.fb.group({
            //     segments: [[]],
            //     sousSegments: [[]],
            //     technologies: [[]],
            //     profilReferentiels: this.fb.array([])
            // }),

            // LinkedIn
            linkedIn: this.fb.group({
                lien: [''],
                jobTitle: [''],
                jobLocation:[''],
                posteActuel:[''],
                localisationLinkedin:[''],
                jobDescription:[''],
                previousCompany:[''],
                previousJob:[''],
                previousJobDescription:[''],
                skillsJobActuel: [[]],
                skillsJobPrecedent:[[]],
                dureeDerniereSociete:[''],
                nbrPushCV:[''],
                motsCles: this.fb.array([]),
                libelleGeneral:[''],
                degreActiviteLinkedIn:[''],
                infos:[''],
                commentaires:['']

            }),

            // Liste des besoins
            besoins: this.fb.array([]),
        });
    }

    createDefaultBesoin(): FormGroup {
        return this.fb.group({
            titre: [''],
            etat: [''],
            besoinEnAvanceDePhase: [false],
            reccurent: [false],
            demarrageASAP: [false],
            dateDeDemarrage: [''],
            habilitable: [false],
            referentiel: this.fb.group({
                segments: [[]],
                sousSegments: [[]],
                profilReferentiels: this.fb.array([
                    this.createProfilReferentielFormGroup1()
                ]),
                technologie: [[]]
            })
        });
    }


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
            candidat: undefined,
        };
    }



    createDefaultProfilReferentiel(): ProfilReferentiel {
        return {
            id: undefined,
            profil: '',
            niveau: '',  // Assurez-vous que le champ `niveau` existe ici
            referentiel: undefined,
        };
    }

    createProfilReferentielFormGroup1(): FormGroup {
        return this.fb.group({
            profil: [''],
            niveau: ['']
        });
    }
    // Méthodes pour les besoins
    get besoinsControls() {
        return (this.clientForm.get('besoins') as FormArray).controls;
    }
    get besoinsReferentielControls() {
        return (this.clientForm.get('besoins.referentiel') as FormArray).controls;
    }
    get besoinsProfilsReferentielControls() {
        const besoins = this.clientForm.get('besoins') as FormArray;
        return besoins.controls.map(
            besoin => (besoin.get('referentiel.profilReferentiels') as FormArray)
        );
    }

    get ProfilsReferentielControls() {
        return (this.clientForm.get('besoins.referentiel.profilReferentiels') as FormArray).controls;

    }


        get skillsJobActuelControl(): FormArray {
        return this.clientForm.get('linkedIn.skillsJobActuel') as FormArray;
    }
    get skillsJobPrecedentControl(): FormArray {
        return this.clientForm.get('linkedIn.skillsJobPrecedent') as FormArray;
    }
    get serviceNiveauControl(): FormArray {
        return this.clientForm.get('organigramme.serviceNiveau') as FormArray;
    }
    get motsClesControl(): FormArray {
        return this.clientForm.get('linkedIn.motsCles') as FormArray;
    }

    // Méthodes pour les profils référentiels
    get profilReferentielsControls() {
        return (this.clientForm.get('referentiel.profilReferentiels') as FormArray).controls;
    }

    addProfil() {
        const control = this.clientForm.get('referentiel.profilReferentiels') as FormArray;
        control.push(
            this.fb.group({
                profil: [''],
                niveau: ['']
            })
        );
    }

    removeProfil(index: number) {
        const control = this.clientForm.get('referentiel.profilReferentiels') as FormArray;
        control.removeAt(index);
    }

    get besoins(): FormArray {
        return this.clientForm.get('besoins') as FormArray;
    }


    addBesoin(): void {
        const besoins = this.clientForm.get('besoins') as FormArray;
        besoins.push(this.createDefaultBesoin());
    }



    removeBesoin(index: number) {
        const control = this.clientForm.get('besoins') as FormArray;
        control.removeAt(index);
    }

    // Méthodes pour les technologies des besoins
    getTechnologiesControls(besoinIndex: number) {
        return (this.clientForm.get(`besoins.${besoinIndex}.besoinsTechnologies`) as FormArray).controls;
    }

    addTechnologie(besoinIndex: number) {
        const control = this.clientForm.get(`besoins.${besoinIndex}.besoinsTechnologies`) as FormArray;
        control.push(
            this.fb.group({
                technologie: [''],
                niveau: [''],
                anneesExperience: ['']
            })
        );
    }
    removeTechnologie(besoinIndex: number, technologieIndex: number) {
        const control = this.clientForm.get(`besoins.${besoinIndex}.besoinsTechnologies`) as FormArray;
        control.removeAt(technologieIndex);
    }

    // Méthode de soumission du formulaire
    // onSubmit() {
    //     if (this.clientForm.valid) {
    //         console.log(this.clientForm.value);
    //         // Ici, vous pouvez appeler votre service pour envoyer les données
    //         // this.clientService.createClient(this.clientForm.value)
    //     } else {
    //         // Marquer tous les champs comme touchés pour afficher les erreurs
    //         this.markFormGroupTouched(this.clientForm);
    //     }
    // }

    onSubmit() {
        if (this.clientForm.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur de validation',
                detail: 'Remplissez tous les champs SVP!'
            });
            return;
        }

        // Préparez les données pour correspondre au format attendu par le backend
        const formData = { ...this.clientForm.value };
        console.warn("formvalueaaaaaaaa",formData)
        // // Si certains champs nécessitent une transformation avant envoi
        // if (Array.isArray(formData.preferenceDeCommunication)) {
        //     formData.preferenceDeCommunication = formData.preferenceDeCommunication.join(', ');
        // }

        this.isLoading = true;
        this.simulateProgress();

        this.clientService.createClient(formData).pipe(
            finalize(() => {
                this.isLoading = false; // Cache le spinner
                this.progress = 100; // Progression complète
                this.cdref.detectChanges(); // Force la mise à jour de la vue
                setTimeout(() => (this.progress = 0), 1000); // Réinitialise après 1 seconde
            })
        ).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Client créé avec succès'
                });
                const id = response.id; // Assurez-vous que 'id' est bien une chaîne valide
                if (id) {
                    const encryptedId = this.encryptionService.encryptId(id.toString());
                    this.redirectUpdate(encryptedId);
                    // Attendre 2 secondes avant de rediriger
                    setTimeout(() => {
                        this.redirectUpdate(encryptedId);
                    }, 500);
                } else {
                    console.error('Invalid ID received');
                }            },
            error: (error) => {
                console.error('Erreur de création du client', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error?.message || 'Erreur de création du client. Réessayez plus tard SVP.'
                });
            }
        });
    }

    // Méthode utilitaire pour marquer tous les contrôles comme touchés
    markFormGroupTouched(formGroup: FormGroup | FormArray) {
        Object.values(formGroup.controls).forEach(control => {
            if (control instanceof FormGroup || control instanceof FormArray) {
                this.markFormGroupTouched(control);
            } else {
                control.markAsTouched();
            }
        });
    }


// Méthode pour ajouter un skill
    addSkill(skillInput: HTMLInputElement) {
        const skillValue = skillInput.value.trim();

        if (skillValue) {
            // Vérifier que le skill n'existe pas déjà
            const existingSkills = this.skillsJobActuelControl.value;
            if (!existingSkills.includes(skillValue)) {
                this.skillsJobActuelControl.push(
                    this.fb.control(skillValue)
                );

                // Réinitialiser l'input
                skillInput.value = '';
            }
        }
    }

// Méthode pour supprimer un skill
    removeSkill(index: number) {
        this.skillsJobActuelControl.removeAt(index);
    }





// Méthode pour ajouter un skill
    addPrevSkill(prevSkillInput: HTMLInputElement) {
        const skillValue = prevSkillInput.value.trim();

        if (skillValue) {
            // Vérifier que le skill n'existe pas déjà
            const existingSkills = this.skillsJobPrecedentControl.value;
            if (!existingSkills.includes(skillValue)) {
                this.skillsJobPrecedentControl.push(
                    this.fb.control(skillValue)
                );

                // Réinitialiser l'input
                prevSkillInput.value = '';
            }
        }
    }

// Méthode pour supprimer un skill
    removePrevSkill(index: number) {
        this.skillsJobPrecedentControl.removeAt(index);
    }





// Méthode pour ajouter un service/niveau
    addServ(servInput: HTMLInputElement) {
        const servValue = servInput.value.trim();

        if (servValue) {
            // Vérifier que le skill n'existe pas déjà
            const existingServ = this.serviceNiveauControl.value;
            if (!existingServ.includes(servValue)) {
                this.serviceNiveauControl.push(
                    this.fb.control(servValue)
                );

                // Réinitialiser l'input
                servInput.value = '';
            }
        }
    }

// Méthode pour supprimer un service/niveau
    removeServ(index: number) {
        this.serviceNiveauControl.removeAt(index);
    }



    // Méthode pour ajouter un service/niveau
    addMotCle(motCleInput: HTMLInputElement) {
        const motCleValue = motCleInput.value.trim();

        if (motCleValue) {
            // Vérifier que le skill n'existe pas déjà
            const existingServ = this.motsClesControl.value;
            if (!existingServ.includes(motCleValue)) {
                this.motsClesControl.push(
                    this.fb.control(motCleValue)
                );

                // Réinitialiser l'input
                motCleInput.value = '';
            }
        }
    }

// Méthode pour supprimer un service/niveau
    removeMotCle(index: number) {
        this.motsClesControl.removeAt(index);
    }


    updateAvailableProfils() {
        // Vérifier que besoinsProfilsReferentielControls retourne un tableau valide
        const profilsControls = this.besoinsProfilsReferentielControls || [];
        this.availableProfils = []; // Réinitialiser

        // Récupérer tous les profils actuellement sélectionnés
        const selectedProfils = profilsControls
            .map(control => (control as FormArray)?.get('profil')?.value) // Cast explicit pour AbstractControl -> FormGroup
            .filter(profil => profil !== undefined && profil !== null);

        // Générer les profils disponibles pour chaque dropdown
        profilsControls.forEach((control, index) => {
            const currentProfil = (control as FormArray)?.get('profil')?.value;

            const availableProfilsForIndex = this.originalProfils.filter(
                profil =>
                    !selectedProfils.includes(profil.value) || profil.value === currentProfil
            );

            // Ajouter les profils disponibles pour ce contrôle
            this.availableProfils[index] = availableProfilsForIndex;
        });
    }

    onProfilChangeAdd(index: number) {
        this.updateAvailableProfils();
    }
    createProfilReferentielFormGroup(profil: ProfilReferentiel): FormGroup {
        return this.fb.group({
            id: [profil.id],
            profil: [profil.profil],
            niveau: [profil.niveau],
            referentiel: [profil.referentiel]
        });
    }

    addProfilReferentiel(besoinIndex: number) {
        const besoinsArray = this.clientForm.get('besoins') as FormArray;
        const besoinGroup = besoinsArray.at(besoinIndex);
        const profilReferentielsArray = besoinGroup.get('referentiel.profilReferentiels') as FormArray;

        profilReferentielsArray.push(this.createProfilReferentielFormGroup1());
        this.updateAvailableProfils();
    }

    removeProfilReferentiel(besoinIndex: number, profilIndex: number) {
        const besoinsArray = this.clientForm.get('besoins') as FormArray;
        const besoinGroup = besoinsArray.at(besoinIndex);
        const profilReferentielsArray = besoinGroup.get('referentiel.profilReferentiels') as FormArray;

        if (profilReferentielsArray.length > 1) {
            profilReferentielsArray.removeAt(profilIndex);
            this.updateAvailableProfils();
        }
    }


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
        // Réinitialiser la validation
        this.isValidSociete = true;
    }

    checkValidity() {
        const enteredValue = this.clientForm.get('societe.nom')?.value;
        if (!this.societeMereOptions.includes(enteredValue)) {
            this.isValidSociete = false;
            this.clientForm.get('societe.nom')?.setValue('');
        }
    }

    handleClear() {
        this.isValidSociete = true;
    }
    createNewSociete() {
        console.log('Créer une nouvelle société');
    }

    /////////////////////////////////// SOCIETE //////////////////////

    showAddSocieteDialog(): void {
        this.displaySocieteDialog = true;
    }

    private initializeForm() {
        this.societeForm = this.fb.group({
            nom: ['', [Validators.required, Validators.minLength(2)]],
            societeMere: [''],
            adresse: ['', Validators.required],
            capitalSocial: [null, [Validators.required, Validators.min(0)]],
            rcs: ['', [Validators.required, Validators.pattern('[A-Z0-9]+')]],
            villeRcs: ['', Validators.required],
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

    private resetForm() {
        this.initializeForm();
        this.organigrammesFiles = [];
        this.logoFile = null;
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

    onSubmitSociete() {
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

                this.resetForm();
                this.loadSocieteMereOptions()
                this.displaySocieteDialog=false
            },
            error: (error) => {
                console.error('Error creating societe', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error?.message || 'Failed to create company. Please try again.'
                });
            },

        });
    }



    redirectUpdate(id: string) {
        this.router.navigate(['/back-office/client/edit', id]);
    }

}
