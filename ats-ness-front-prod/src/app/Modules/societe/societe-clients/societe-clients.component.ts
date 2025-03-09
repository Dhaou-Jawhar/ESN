import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AutoCompleteModule} from "primeng/autocomplete";
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {CardModule} from "primeng/card";
import {CheckboxModule} from "primeng/checkbox";
import {ChipModule} from "primeng/chip";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DatePipe, DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {DialogModule} from "primeng/dialog";
import {DividerModule} from "primeng/divider";
import {DropdownModule} from "primeng/dropdown";
import {FieldsetModule} from "primeng/fieldset";
import {FileUploadModule} from "primeng/fileupload";
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators
} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {MultiSelectModule} from "primeng/multiselect";
import {NgxStarsControlComponent} from "../../client/client-update/NgxStarsControlComponent";
import {PanelModule} from "primeng/panel";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {SidebarModule} from "primeng/sidebar";
import {TabViewModule} from "primeng/tabview";
import {TagModule} from "primeng/tag";
import {ToastModule} from "primeng/toast";
import {TooltipModule} from "primeng/tooltip";
import {Client} from "../../../demo/models/Client";
import {Besoin} from "../../../demo/models/besoin";
import {ActivatedRoute} from "@angular/router";
import {EncryptionServiceService} from "../../../demo/service/encryption-service.service";
import {ClientService} from "../../../demo/service/client.service";
import {SocieteService} from "../../../demo/service/societe.service";
import {BesoinService} from "../../../demo/service/besoin.service";
import {Referentiel} from "../../../demo/models/Referentiel";
import {finalize} from "rxjs";
import {BesoinsTechnologies} from "../../../demo/models/BesoinsTechnologies";
import {ProfilReferentiel} from "../../../demo/models/ProfilReferentiel";
import {ProfilBesoin} from "../../../demo/models/profileBesoin";
import {profils, segments, sousSegmentsMap, technologiesMap} from "../../../../../ReferentielDefinition";

@Component({
  selector: 'app-societe-clients',
  standalone: true,
    imports: [
        AutoCompleteModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CheckboxModule,
        ChipModule,
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
        NgxStarsControlComponent,
        PanelModule,
        ProgressSpinnerModule,
        ReactiveFormsModule,
        SharedModule,
        SidebarModule,
        TabViewModule,
        TagModule,
        ToastModule,
        TooltipModule
    ],
  templateUrl: './societe-clients.component.html',
  styleUrl: './societe-clients.component.scss'
})
export class SocieteClientsComponent implements OnInit{
    encryptedId = this.route.snapshot.paramMap.get('id');
    client: Client = {} as Client;
    clientForm:FormGroup;
    isLoading = false;
    progress: number = 0;
    profils = profils;
    technologiesMap = technologiesMap;
    technologiesMap1 = Object.values(technologiesMap).flat();

    availableProfils: { label: string, value: string }[][] = [];
    originalProfils = profils;
    sousSegmentsOptions = [];
    technologiesOptions = [];
    sousSegmentsMap = sousSegmentsMap;

    segments = segments;
    segmentsOptions: any[] = [];

    filteredSocieteMereOptions: string[] = [];
    societeMereOptions: string[] = [];
    isValidSociete: boolean = true;
    displaySocieteDialog: boolean = false;
    societeForm: FormGroup;
    organigrammesFiles: File[] = [];
    logoFile: File | null = null;
    displayBesoinDialog: boolean = false;
    selectedBesoin: Besoin | null = null;
    displayBesoinDetailsDialog:boolean=false;
    besoinForm: FormGroup;
    displayBesoinSidebar: boolean = false;
    filteredTechnologies = [];
    availableTechnologies: any[][] = [];
    besoins: Besoin[];
    allSkills: string[] = [];


    genre = [
        { label: 'Mr', value: 'Mr' },
        { label: 'Mme', value: 'Mme' },
        { label: 'NC', value: 'NC' },
        { label: 'Autres', value: 'Autres' },

    ];

    statuts = [
        { label: 'Client', value: 'Client' },
        { label: 'Prospect', value: 'Prospect' },
        { label: 'Partenaire', value: 'Partenaire' },
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
    seniorityLevels = [
        { label: 'Junior', value: 'Junior' },
        { label: 'Intermédiaire', value: 'Intermédiaire' },
        { label: 'Confirmé', value: 'Confirmé' },
        { label: 'Senior', value: 'Senior' },
        { label: 'Expert', value: 'Expert' },
        { label: 'Maitre', value: 'Maitre' },
        { label: 'Lead', value: 'Lead' }
    ];
    states = [
        { label: 'Priorité1', value: 'Priorité1' },
        { label: 'Priorité2', value: 'Priorité2' },
        { label: 'Priorité3', value: 'Priorité3' },
        { label: 'Stand By', value: 'Stand By' },
        { label: 'Fermé', value: 'Fermé' }
    ];
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
        private route: ActivatedRoute,
        private encryptionService: EncryptionServiceService,
        private clientService: ClientService,
        private messageService: MessageService,
        private fb:FormBuilder,
        private societeService:SocieteService,
        private cdref: ChangeDetectorRef,
        private besoinService:BesoinService,
        private confirmationService: ConfirmationService,




    ) {}
    ngOnInit(): void {

        try {
            const id = this.getDecryptedId();  // Récupérer l'ID décrypté
            this.loadClientData(id);  // Charger les données du client
        } catch (error) {
            // Gérer l'erreur (redirection, message d'erreur, etc.)
            console.error('Erreur:', error);
        }
        this.initForm();  // Initialiser le formulaire
        this.updateAvailableProfilsUpdate();
        this.populateForm();
        this.loadSocieteMereOptions();
        this.initializeForm();
        this.initBesoinForm();
        this.updateAvailableTechnologies();
        this.filterTechnoUpdate();
        this.initializeFilteredTechnologies();
        this.subscribeToReferentielChanges();
        this.initializeSelections(this.client?.referentiel)




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

    loadClientData(id: number) {
        this.clientService.getClientByid(id).subscribe({
            next: (clientData) => {
                this.client = clientData;

                // Assurez-vous que besoins est un tableau
                if (!Array.isArray(this.client.besoins)) {
                    this.client.besoins = [];
                }
                console.warn("data", clientData);  // Afficher les données du client
                this.populateForm();  // Remplir le formulaire avec les données du client après la réception
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Load Error',
                    detail: 'Failed to load client information',
                    life: 3000
                });
                console.error('Error loading client:', error);
            }
        });
    }


    transformDate(dateString: string): Date {
        return dateString ? new Date(dateString) : null;
    }

    // Méthode pour initialiser le formulaire
    initForm() {
        this.clientForm = this.fb.group({
            // Informations globales
            nom: [''],
            prenom: [''],
            email: ['', [Validators.email]],
            emailSecondaire: ['', [Validators.email]],
            telephonePrso: [''],
            telephonePro: [''],
            localisation: [''],
            secteur: [''],
            statut: [''],
            genre: [''],
            preferenceDeCommunication: [[]],
            isAmbassadeur: [false],
            commentaireProfilsRecherches: [''],
            personnalite: [''],
            modeDeFonctionnement: [''],
            intimiteClient: [null],

            // Societe (FormGroup)
            societe: this.fb.group({
                nom: [''],
            }),

            // Organigramme (FormGroup)
            organigramme: this.fb.group({
                tailleEquipe: [''],
                pourcentageDePrestation: [''],
                serviceNiveau: this.fb.array([])  // FormArray
            }),

            prospection: this.fb.group({
                nbrAppels: [''],
                nbrMails: [''],
                datePremiereAction: {value: '', disabled: true},
                dateDerniereAction: {value: '', disabled: true},
                nbrJoursDepuisDerniereAction: [''],
                ajoutLinkedIn: null,
                dateajoutLinkedIn: {value: '', disabled: true},
                linkedInAccepte: null,
                dateAcceptationLinkedIn:{value: '', disabled: true},
                mailLinkedInEnvoye: null,
                dateEnvoiMailLinkedIn: {value: '', disabled: true},
            }),

            referentiel:this.fb.group({
                profilReferentiels: this.fb.array([this.createProfilReferentielFormGroup()]), // Initialiser avec un groupe vide
                segments: [[], Validators.required],
                sousSegments: [[], Validators.required],
                technologie: [[], Validators.required],

            }),
            // LinkedIn (FormGroup)
            // LinkedIn (FormGroup)
            linkedIn: this.fb.group({
                lien: [''],
                jobTitle: [''],
                jobLocation: [''],
                posteActuel: [''],
                secteur: [''],
                localisationLinkedin: [''],
                jobDescription: [''],
                previousCompany: [''],
                previousJob: [''],
                previousJobDescription: [''],
                skillsJobActuel: new FormControl([], Validators.required),
                skillsJobPrecedent: new FormControl([], Validators.required),
                allSkills: this.fb.array([]),  // FormArray pour toutes les compétences
                dureeDerniereSociete: [''],
                nbrPushCV: [''],
                motsCles: this.fb.array([]),  // FormArray pour les mots-clés
                libelleGeneral: [''],
                degreActiviteLinkedIn: [''],
                infos: [''],
                commentaires: ['']
            }),


            // Liste des besoins (FormArray)
            besoins: [[]]
        });
    }

// Méthode pour mettre à jour le formulaire avec les données du client
    populateForm() {
        if (!this.client || !this.clientForm) {
            console.error("Client data or client form is not available");
            return;
        }

        const referentiel: Referentiel = this.client.referentiel || {
            id: undefined,
            segments: [],
            sousSegments: [],
            technologie: [],
            profilReferentiels: [],
            candidat:null,
            besoin:null
        };
        const profilReferentielsArray = this.clientForm.get('referentiel.profilReferentiels') as FormArray;

        // Nettoyer le FormArray
        profilReferentielsArray.clear();

        // Vérifier et ajouter les profils existants
        if (referentiel.profilReferentiels.length > 0) {
            referentiel.profilReferentiels.forEach(profil => {
                profilReferentielsArray.push(this.createProfilReferentielFormGroup1(profil));
            });
        } else {
            // Ajouter un profil vide si aucun n'est disponible
            profilReferentielsArray.push(this.createProfilReferentielFormGroup());
        }


        // Mise à jour des champs simples
        this.clientForm.patchValue({
            nom: this.client.nom || '',
            prenom: this.client.prenom || '',
            email: this.client.email || '',
            emailSecondaire: this.client.emailSecondaire || '',
            telephonePrso: this.client.telephonePrso || '',
            telephonePro: this.client.telephonePro || '',
            localisation: this.client.localisation || '',
            secteur: this.client.secteur || '',
            statut: this.client.statut || '',
            genre: this.client.genre || '',
            preferenceDeCommunication: Array.isArray(this.client.preferenceDeCommunication)
                ? this.client.preferenceDeCommunication
                : (this.client.preferenceDeCommunication
                    ? this.client.preferenceDeCommunication.split(',').map(pref => pref.trim())
                    : []),
            isAmbassadeur: this.client.isAmbassadeur || false,
            commentaireProfilsRecherches: this.client.commentaireProfilsRecherches || '',
            personnalite: this.client.personnalite || '',
            modeDeFonctionnement: this.client.modeDeFonctionnement || '',
            intimiteClient: this.client.intimiteClient || null,
            societe: {
                nom: this.client.societe?.nom || ''
            },
            organigramme: {
                tailleEquipe: this.client.organigramme?.tailleEquipe || '',
                pourcentageDePrestation: this.client.organigramme?.pourcentageDePrestation || '',
            },


            prospection: {
                nbrAppels: this.client.prospection?.nbrAppels || '',
                nbrMails: this.client.prospection?.nbrMails || '',
                datePremiereAction: this.client.prospection?.datePremiereAction || '',
                dateDerniereAction: this.client.prospection?.dateDerniereAction || '',
                nbrJoursDepuisDerniereAction: this.client.prospection?.nbrJoursDepuisDerniereAction || '',
                ajoutLinkedIn: this.client.prospection?.ajoutLinkedIn || false,
                dateajoutLinkedIn: this.client.prospection?.dateajoutLinkedIn || '',
                linkedInAccepte: this.client.prospection?.linkedInAccepte || false,
                dateAcceptationLinkedIn: this.client.prospection?.dateAcceptationLinkedIn || '',
                mailLinkedInEnvoye: this.client.prospection?.mailLinkedInEnvoye || false,
                dateEnvoiMailLinkedIn: this.client.prospection?.dateEnvoiMailLinkedIn || ''
            },



            linkedIn: this.client.linkedIn || {},

            referentiel: {
                segments: referentiel.segments,
                sousSegments: referentiel.sousSegments,
                technologie: referentiel.technologie
            }
        });
        // Affecter les skills à la liste `allSkills`
        const skillsJobActuel = this.client.linkedIn?.skillsJobActuel || [];
        const skillsJobPrecedent = this.client.linkedIn?.skillsJobPrecedent || [];
        this.allSkills = [...skillsJobActuel, ...skillsJobPrecedent];

        if (!Array.isArray(this.client.besoins)) {
            this.client.besoins = [];
            console.warn("La propriété besoins était undefined, elle a été initialisée à un tableau vide.");
        }

        const besoinsArray = this.fb.array(this.client.besoins.map(b => this.fb.control(b)));
        this.clientForm.setControl('besoins', besoinsArray);



        if (Array.isArray(referentiel.profilReferentiels) && referentiel.profilReferentiels.length > 0) {
            referentiel.profilReferentiels.forEach(profil => {
                profilReferentielsArray.push(this.createProfilReferentielFormGroup1(profil));
            });
        } else {
            profilReferentielsArray.push(this.createProfilReferentielFormGroup2());
        }


        //    this.initProfilReferentiel()
        this.initializeSelections(this.client.referentiel);



        // Mise à jour de 'serviceNiveau' dans le FormArray
        const serviceNiveauArray = this.clientForm.get('organigramme.serviceNiveau') as FormArray;
        serviceNiveauArray.clear();
        if (this.client.organigramme?.serviceNiveau) {
            this.client.organigramme.serviceNiveau.forEach(service => {
                serviceNiveauArray.push(this.fb.control(service));
            });
        }

        // Mise à jour des compétences LinkedIn
        const motsCles = this.clientForm.get('linkedIn.motsCles') as FormArray;
        motsCles.clear();
        if (Array.isArray(this.client.linkedIn?.motsCles) && this.client.linkedIn.motsCles.length > 0) {
            this.client.linkedIn.motsCles.forEach(skill => {
                motsCles.push(this.fb.control(skill));
            });
        }

        // Récupérer les compétences du job actuel (FormControl)
        const skillsJobActuelControl = this.clientForm.get('linkedIn.skillsJobActuel') as FormControl;

        // Vérifier que skillsJobActuelControl est bien un FormControl
        if (skillsJobActuelControl instanceof FormControl) {
            // Remplacer la valeur actuelle du FormControl par un tableau des compétences
            if (this.client.linkedIn?.skillsJobActuel) {
                skillsJobActuelControl.setValue(this.client.linkedIn.skillsJobActuel);
            }
        } else {
            console.error('skillsJobActuelControl n\'est pas un FormControl');
        }

        // Faire de même pour les compétences du job précédent
        const skillsJobPrecedentControl = this.clientForm.get('linkedIn.skillsJobPrecedent') as FormControl;

        // Vérifier que skillsJobPrecedentControl est bien un FormControl
        if (skillsJobPrecedentControl instanceof FormControl) {
            // Remplacer la valeur actuelle du FormControl par un tableau des compétences
            if (this.client.linkedIn?.skillsJobPrecedent) {
                skillsJobPrecedentControl.setValue(this.client.linkedIn.skillsJobPrecedent);
            }
        } else {
            console.error('skillsJobPrecedentControl n\'est pas un FormControl');
        }



        console.log("Formulaire mis à jour avec les données du client :", this.clientForm.value);
    }

    get profilReferentiels(): FormArray {
        return this.clientForm.get('referentiel.profilReferentiels') as FormArray;
    }
    get profilReferentielsBesoins(): FormArray {
        return this.besoinForm.get('referentiel.profilReferentiels') as FormArray;
    }
    // Méthode pour ajouter un service/niveau
    addServ(servInput: HTMLInputElement) {
        const servValue = servInput.value.trim();

        if (servValue) {
            const serviceNiveauArray = this.clientForm.get('organigramme.serviceNiveau') as FormArray;

            // Vérifiez que la valeur n'existe pas déjà dans le FormArray
            if (!serviceNiveauArray.value.includes(servValue)) {
                // Ajoutez la valeur au FormArray
                serviceNiveauArray.push(this.fb.control(servValue));

                // Synchronisez les données avec `client.organigramme.serviceNiveau`
                this.client.organigramme.serviceNiveau = serviceNiveauArray.value;

                // Réinitialisez l'input
                servInput.value = '';
            } else {
                console.error('Service/Niveau déjà ajouté.');
            }
        }
    }

    removeServ(index: number) {
        const serviceNiveauArray = this.clientForm.get('organigramme.serviceNiveau') as FormArray;

        if (index >= 0 && index < serviceNiveauArray.length) {
            // Retirez l'élément à l'index donné
            serviceNiveauArray.removeAt(index);

            // Synchronisez les données avec `client.organigramme.serviceNiveau`
            this.client.organigramme.serviceNiveau = serviceNiveauArray.value;
        } else {
            console.error('Index invalide pour suppression.');
        }
    }


    get linkedInMotsCles() {
        return (this.clientForm.get('linkedIn.motsCles') as FormArray).controls;
    }

    addMotCle(motCleInput: HTMLInputElement) {
        const motCleValue = motCleInput.value.trim();

        if (motCleValue) {
            const motsClesArray = this.clientForm.get('linkedIn.motsCles') as FormArray;

            // Vérifier si le mot-clé existe déjà
            if (!motsClesArray.value.includes(motCleValue)) {
                // Ajouter le mot-clé au FormArray
                motsClesArray.push(this.fb.control(motCleValue));

                // Réinitialiser l'input
                motCleInput.value = '';
            } else {
                console.warn('Le mot-clé existe déjà:', motCleValue);
            }
        }
    }

    removeMotCle(index: number) {
        const motsClesArray = this.clientForm.get('linkedIn.motsCles') as FormArray;

        // Vérifier que l'index est valide
        if (index >= 0 && index < motsClesArray.length) {
            // Supprimer le mot-clé à l'index donné
            motsClesArray.removeAt(index);
        } else {
            console.error('Index invalide pour supprimer un mot-clé:', index, motsClesArray.length);
        }
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


    updateAvailableProfilsUpdateBesoin() {
        // Reset available profils array
        this.availableProfils = [];

        // Get all currently selected profils
        const selectedProfils = this.profilReferentielsBesoins.controls
            .map(control => control.get('profil').value)
            .filter(value => value !== null);

        // Generate available profils for each dropdown
        for (let i = 0; i < this.profilReferentielsBesoins.length; i++) {
            // Filter out already selected profils for this dropdown
            const availableProfilsForIndex = this.originalProfils.filter(
                profil => !selectedProfils.includes(profil.value) ||
                    profil.value === this.profilReferentielsBesoins.at(i).get('profil').value
            );

            this.availableProfils.push(availableProfilsForIndex);
        }
    }

    onProfilChange(index: number) {
        this.updateAvailableProfilsUpdate();
    }

    onProfilChangeBesoin(index: number) {
        this.updateAvailableProfilsUpdateBesoin();
    }

    createProfilReferentielFormGroup1(profil?: any): FormGroup {
        return this.fb.group({
            profil: [profil?.profil || '', Validators.required],
            niveau: [profil?.niveau || '', Validators.required],
        });
    }


    createProfilReferentielFormGroup() {
        return this.fb.group({
            profil: ['', Validators.required],
            niveau: ['', Validators.required],
            anneesExperience: ['', Validators.required],
        });
    }

    createProfilReferentielFormGroup2() {
        return this.fb.group({
            profil: ['', Validators.required],
            niveau: ['', Validators.required],
        });
    }


    addProfilReferentielUpdate() {
        this.profilReferentiels.push(this.createProfilReferentielFormGroup());
        this.updateAvailableProfilsUpdate()
    }
    addProfilReferentielUpdateBesoin() {
        this.profilReferentielsBesoins.push(this.createProfilReferentielFormGroup2());
        this.updateAvailableProfilsUpdateBesoin()
    }
    removeProfilReferentielUpdate(index: number) {
        this.profilReferentiels.removeAt(index);
        this.updateAvailableProfilsUpdate()
    }
    removeProfilReferentielUpdateBesoin(index: number) {
        this.profilReferentielsBesoins.removeAt(index);
        this.updateAvailableProfilsUpdateBesoin()
    }
    updateTechnologies(selectedSousSegments: string[]): void {
        // Récupérer les technologies de la BD
        const selectedTechnologies = this.client.referentiel?.technologie || [];

        // Mettre à jour les valeurs du formulaire
        this.clientForm.patchValue({
            referentiel: {
                sousSegments: selectedSousSegments,
                technologie: selectedTechnologies
            }
        });

        if (selectedSousSegments.length === 0) {
            // Ne pas vider la liste des technologies si elle est déjà remplie
            return;
        }

        const allTechnologies = new Set<any>();
        selectedSousSegments.forEach((sousSegment: string) => {
            const technologiesForSousSegment = this.technologiesMap[sousSegment] || [];
            technologiesForSousSegment.forEach((tech: any) => allTechnologies.add(tech));
        });

        this.technologiesOptions = Array.from(allTechnologies);
    }

    initializeSelections(referentiel: any): void {
        this.initProfilReferentiel()
        const selectedSegments = referentiel?.segments || [];
        this.segmentsOptions = [...this.segments]; // Charger toutes les options possibles des segments

        // Charger les sous-segments et technologies basés sur les segments sélectionnés
        this.loadOptionsForSegments(selectedSegments);

        // Sélectionner les segments récupérés
        this.clientForm.get('referentiel.segments')?.setValue(selectedSegments);

        // Initialiser les profils sélectionnés
        const profilReferentielsArray = this.clientForm.get('referentiel.profilReferentiels') as FormArray;

        // Nettoyer les groupes existants uniquement si nécessaire
        profilReferentielsArray.clear();

        // Ajouter les groupes provenant des données ou un groupe vide par défaut
        const profilReferentiels = referentiel?.profilReferentiels || [];
        profilReferentiels.forEach(profil => {
            profilReferentielsArray.push(this.createProfilReferentielFormGroup1(profil));
        });

        if (profilReferentielsArray.length === 0) {
            profilReferentielsArray.push(this.createProfilReferentielFormGroup());
        }

    }


    // Fonction qui charge automatiquement les sous-segments et les technologies
    loadOptionsForSegments(selectedSegments: string[]): void {
        // Ne pas réinitialiser les sous-segments et technologies lors de la modification des segments
        this.sousSegmentsOptions = [];
        this.technologiesOptions = [];

        if (selectedSegments.length === 0) {
            this.clientForm.get('referentiel.sousSegments')?.setValue([]);
            this.clientForm.get('referentiel.technologie')?.setValue([]);
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
        const selectedSousSegments = this.clientForm.get('referentiel.sousSegments')?.value || [];
        this.updateTechnologies(selectedSousSegments);
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

    initProfilReferentiel() {
        if(this.profilReferentiels.length==0){
            this.profilReferentiels.push(this.createProfilReferentielFormGroup());

        }
        this.updateAvailableProfilsUpdate();
    }


    // S'assurer que le FormArray contient le bon nombre de contrôles
    onSkillsJobActuelChange(event: { value: string[] }) {
        const skillsJobActuel = this.clientForm.get('linkedIn.skillsJobActuel');

        // If it's a FormControl, use setValue
        if (skillsJobActuel instanceof FormControl) {
            skillsJobActuel.setValue(event.value || []);
        }
        // If it's unexpectedly a different type of control
        else {
            console.error('skillsJobActuel is not a FormControl');
        }
    }




    getLinkedInControl(controlName: string): FormControl {
        const control = this.clientForm.get(`linkedIn.${controlName}`);
        if (!(control instanceof FormControl)) {
            throw new Error(`Expected FormControl for linkedIn.${controlName}`);
        }
        return control;
    }

    //////////////////////////////////SELECTION DE SOCIETE/////////////////////////////////////////
    filterSocieteMere(event: any) {
        const query = event.query.toLowerCase();
        this.filteredSocieteMereOptions = this.societeMereOptions.filter(option =>
            option.toLowerCase().includes(query)
        );
        // Réinitialiser la validation
        this.isValidSociete = true;
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
    showAddSocieteDialog(): void {
        this.displaySocieteDialog = true;
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
    private initializeForm() {
        this.societeForm = this.fb.group({
            nom: ['', [Validators.required, Validators.minLength(2)]],
            societeMere: [''],
            adresse: ['', Validators.required],
            capitalSocial: [null, [Validators.required, Validators.min(0)]],
            rcs: ['', [Validators.required, Validators.pattern('[A-Z0-9]+')]],
            villeRcs: ['', Validators.required],
            // besoins: this.fb.array([this.createBesoin()])
        });
    }
    private resetForm() {
        this.initializeForm();
        this.organigrammesFiles = [];
        this.logoFile = null;
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
    ///////////////////////////////////////////////////////////////////////////////////////


    ///////////////////////////SUBMIT CLIENT FORM///////////////////////////////////

    onSubmit(): void {
        // Remove any undefined or null values
        const formValue = Object.fromEntries(
            Object.entries(this.clientForm.value)
                .filter(([_, v]) => v != null && v !== '')
        );

        console.log('Cleaned Form Value:', JSON.stringify(formValue));

        this.clientService.updateClient(
            this.getDecryptedId(),
            formValue
        ).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Mise à jour réussie',
                    detail: 'Les informations de la société ont été mises à jour avec succès',
                    life: 3000
                });
                this.loadClientData(this.getDecryptedId());
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur de mise à jour',
                    detail: 'Impossible de mettre à jour les informations du client',
                    life: 3000
                });
                console.error('Erreur :', error);
            }
        });

    }


    /////////////////////////////////////////////////////////////////////////////////////////////








    ///////////////////////////PARTIE BESOINS/////////////////////////////////

    showAddBesoinDialog(): void {
        this.displayBesoinDialog = true;
    }
    loadOptionsForSegments1(selectedSegments: string[]): void {
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

    initializeSelections1(referentiel: any): void {
        this.initProfilReferentiel()
        const selectedSegments = referentiel?.segments || [];
        this.segmentsOptions = [...this.segments]; // Charger toutes les options possibles des segments

        // Charger les sous-segments et technologies basés sur les segments sélectionnés
        this.loadOptionsForSegments1(selectedSegments);

        // Sélectionner les segments récupérés
        this.besoinForm.get('referentiel.segments')?.setValue(selectedSegments);

        // Initialiser les profils sélectionnés
        const profilReferentiels = referentiel?.profilReferentiels || [];
        const profilReferentielsArray = this.besoinForm.get('referentiel.profilReferentiels') as FormArray;
        profilReferentielsArray.clear();

        // Ajouter les profils au FormArray
        profilReferentiels.forEach((profil: any) => {
            profilReferentielsArray.push(
                this.fb.group({
                    profil: [profil.profil || ''],
                    niveau: [profil.niveau || '']
                })
            );
        });
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

    get besoinsTechnologiesArray(): FormArray {
        return this.besoinForm.get('besoinsTechnologies') as FormArray;
    }

    addBesoinTechnologies() {
        if (this.besoin.besoinsTechnologies.length < 5) {
            const besoinsTechnologiesArray = this.besoinForm.get('besoinsTechnologies') as FormArray;
            besoinsTechnologiesArray.push(this.fb.group({
                technologie: ['', Validators.required],
                niveau: ['', Validators.required],
                importance: ['', Validators.required]
            }));
        }
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
    editBesoin(besoin: Besoin) {
        this.selectedBesoin = besoin;
        console.warn("besoin",besoin)

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
                    this.fb.group({
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
        this.initializeSelections1(besoin.referentiel);

        // Afficher le sidebar
        this.displayBesoinSidebar = true;
        this.updateAvailableProfilsUpdateBesoin();
        this.filterTechnoUpdate()
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
                this.client.besoins = this.client.besoins.filter((besoin: any) => besoin.id !== besoinId);

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






    saveBesoin() {
        this.isLoading = true;
        this.simulateProgress(); // Simule une progression parallèle au traitement

        const updatedBesoin = {
            ...this.selectedBesoin,
            ...this.besoinForm.value,
        };

        this.clientService
            .updateClientBesoin(this.getDecryptedId(), updatedBesoin)
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

                    this.loadClientData(this.getDecryptedId());

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



    removeBesoinTechnologieUpdate(index: number): void {
        this.besoinsTechnologiesArray.removeAt(index);
        this.updateAvailableTechnologiesUpdate();

    }

    onTechnologieChangeUpdate(index: number) {
        console.warn(index,this.availableTechnologies,this.besoinsTechnologiesArray.controls)
        this.updateAvailableTechnologiesUpdate(index);
        this.besoinsTechnologiesArray.controls.forEach((group,i) => {
            this.updateAvailableTechnologiesUpdate(i);
        })
    }


    addBesoinTechnologieUpdate() {
        const newGroup = this.fb.group({
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

    isButtonDisabled(): boolean {
        return this.availableTechnologies && this.availableTechnologies.length
            ? this.availableTechnologies[this.availableTechnologies.length - 1].length === 1
            : true;
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
            this.clientService.createBesoinAndAssignToClient(this.getDecryptedId(), this.besoin)
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

                        this.loadClientData(this.getDecryptedId());

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

    filterTechno(): void {
        this.filteredTechnologies = this.technologiesOptions.filter(option =>
            this.besoin.referentiel.technologie.includes(option.value)
        );
        console.warn("dddddddddddddddddddddddddddddddddd",this.filteredTechnologies)
        this.updateAvailableTechnologies();


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

    removeBesoinTechnologie(index: number) {
        this.besoin.besoinsTechnologies.splice(index, 1);
        this.updateAvailableTechnologies();
    }

    // Méthode appelée lors du changement de technologie
    onTechnologieChange(index: number) {
        console.warn('Technologies filtrées:', this.filteredTechnologies);

        this.updateAvailableTechnologies();
    }

    addBesoinTechnologie() {
        this.besoin.besoinsTechnologies.push(this.createDefaultBesoinsTechnologies());
        this.updateAvailableTechnologies();

    }

    initBesoinForm() {
        this.besoinForm = this.fb.group({
            titre: ['', Validators.required],
            reference: [''],
            etat: [''],
            dateDeDemarrage: ['', Validators.required],
            plateforme: [''],
            besoinEnAvanceDePhase: [false],
            // Vérifiez que ce champ est bien initialisé
            reccurent: [false],
            habilitable: [false],
            referentiel: this.fb.group({
                profilReferentiels: this.fb.array([this.createProfilReferentielFormGroup()]),
                segments: [[], Validators.required],
                sousSegments: [[], Validators.required],
                technologie: [[], Validators.required], // Assurez-vous que ce contrôle est bien présent ici
            }),
            besoinsTechnologies: this.fb.array([]),

            profilBesoins: this.fb.group({
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

}
