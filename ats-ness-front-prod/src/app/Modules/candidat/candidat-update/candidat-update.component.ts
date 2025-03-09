import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AutoCompleteModule} from "primeng/autocomplete";
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {CardModule} from "primeng/card";
import {CheckboxModule} from "primeng/checkbox";
import {ChipModule} from "primeng/chip";
import {DropdownModule} from "primeng/dropdown";
import {FileUploadModule} from "primeng/fileupload";
import {FormArray, FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {MultiSelectModule} from "primeng/multiselect";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {NgxStarsModule} from "ngx-stars";
import {PaginatorModule} from "primeng/paginator";
import {ConfirmationService, MenuItem, MessageService, SharedModule} from "primeng/api";
import {TabMenuModule} from "primeng/tabmenu";
import {TabViewModule} from "primeng/tabview";
import {ToastModule} from "primeng/toast";
import {Candidat} from "../../../demo/models/condidat";
import {ActivatedRoute} from "@angular/router";
import {CandidatService} from "../../../demo/service/candidat.service";
import {CountryService} from "../../../demo/service/country.service";
import {LanguageService} from "../../../demo/service/language.service";
import {HttpClient} from "@angular/common/http";
import {EncryptionServiceService} from "../../../demo/service/encryption-service.service";
import {Niveau} from "../../../demo/models/enums/Niveau";
import {catchError} from "rxjs/operators";
import {finalize, forkJoin, of, tap} from "rxjs";
import {Technology} from "../../../demo/models/Technology";
import {profils, segments, sousSegmentsMap, technologiesMap} from "../../../../../ReferentielDefinition";
import {ProfilReferentiel} from "../../../demo/models/ProfilReferentiel";
import {DialogModule} from "primeng/dialog";
import {InputTextareaModule} from "primeng/inputtextarea";
import {Actions} from "../../../demo/models/Actions";
import {Besoin} from "../../../demo/models/besoin";
import {ActionsService} from "../../../demo/service/actions.service";
import {DividerModule} from "primeng/divider";
import {BesoinService} from "../../../demo/service/besoin.service";
import {TagModule} from "primeng/tag";
import {SidebarModule} from "primeng/sidebar";
import {ConfirmDialogModule} from "primeng/confirmdialog";

@Component({
  selector: 'app-candidat-update',
  standalone: true,
    imports: [
        AutoCompleteModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CheckboxModule,
        ChipModule,
        DropdownModule,
        FileUploadModule,
        FormsModule,
        InputTextModule,
        MultiSelectModule,
        NgForOf,
        NgIf,
        NgxStarsModule,
        PaginatorModule,
        ReactiveFormsModule,
        SharedModule,
        TabMenuModule,
        TabViewModule,
        ToastModule,
        DialogModule,
        InputTextareaModule,
        NgClass,
        DividerModule,
        DatePipe,
        TagModule,
        SidebarModule,
        ConfirmDialogModule
    ],
  templateUrl: './candidat-update.component.html',
  styleUrl: './candidat-update.component.scss'
})
export class CandidatUpdateComponent implements OnInit{

    showError: boolean = false;
    profils = profils;
    segments = segments;
    sousSegmentsMap = sousSegmentsMap;
    technologiesMap = technologiesMap;
    sousSegmentsOptions: any[] = [];
    technologiesOptions: any[] = [];
    routeItems: MenuItem[] = [];
    activeStep: MenuItem | null = null;
    candidat: Candidat | null = null;
    stepIndex: number = 0;
    countries: any[] = []; // Array to hold country data
    languages: any[] = [];
    langues: any[] = [];
    experiences: any[] = [];
    otherTechnologies = [];
    technologies: any[] = [];
    formations: any[] = [];
    certifications: any[] = [];
    filteredCountries: any[] = [];
    filteredLanguages: any[] = [];
    profilePictureFiles: File | null = null;
    sectionsMap: { [key: string]: any[] } = {};
    isUploading = { imgFile: false, cvFile: false, cvNessFile: false };
    isFileSelected = { imgFile: false, cvFile: false, cvNessFile: false };
    uploadedFiles: File | null = null;
    cvNessFiles: File | null = null;
    NiveauOptions!: any;
    technoAEvaluerOptions = [];
    statut: any[];
    preavis: any[];
    encryptedId = this.route.snapshot.paramMap.get('id');
    loading: boolean = false;
    states: { label: string; value: string }[];
    job: { label: string; value: string }[];
    level: { label: string; value: string }[];
    myRating: { [key: number]: number } = {};
    myRatingLnag: { [key: number]: number } = {};
    myRatingTechs: { [key: number]: number } = {};
    selectedBesoin: Besoin | null = null;
    besoinsTitles: any[] = [];
    displayActionDialog    // Initialisez les tableaux filtrés
    filteredSegments: string[] = [];
    filteredSousSegments: string[] = [];
    filteredTechno: string[] = [];
    filteredBesoins: any[] = [];
    page1 = 0;
    size1 = 2;
    isLoading1 = false;
    allBesoinsLoaded = false;
    actions: Actions[] = [];
    displayBesoinDetailsDialog = false
    displayActionsDetailsDialog=false
    selectedAction:Actions
    actionToSubmit:any
    displaySidebar=false
    mainForm: FormGroup;
    isAdmin: boolean = false;
    availableProfils: { label: string, value: string }[][] = [];
    segmentsStats: { name: string; percentage: string }[] = [];
    sousSegmentsStats: { name: string; percentage: string }[] = [];
    technologiesStats: { name: string; percentage: string }[] = [];



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

    initAction(){
        this.action = {
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
    }
    formData1 = {
        id: null,
        formations: [
            {
                titre: '',
                etablissement: '',
                commentaire: '',
                pays: '',
                anneeObtention: null,
            },
        ], // Initialisé en tant qu'array d'objets Formations
        langues: [
            {
                name: '',
                lev: '',
                commentaire: '',
            },
        ], // Initialisé en tant qu'array d'objets Langues
        ratedTechnologies: [{ id: null, name: '', anneesExperiences: null ,candidat:undefined }],
        certifications: [
            {
                titreCertif: '',
                etablissementCertif: '',
                commentaireCertif: '',
                paysCertif: '',
                anneeObtentionCertif: '',
            },
        ], // Initialisé en tant qu'array d'objets Certifications
        experiences: [
            {
                titre: '',
                dateDeb: '',
                dateFin: '',
                client: '',
                description: '',
            },
        ],
        referentiels: [
            {
                id: null,
                segments: [],
                sousSegments: [],
                technologie: [],
                candidat: null,
                profilReferentiels: [
                    { id: null, profil: null, niveau: null },
                ],
            },
        ],

        dossierCompetences: false,
        dateMissions: false,
        formatWord: false,
        habilitable: false,
        jesaispas: false,
        infosAClarifier: '',
        comments: '',
        nom: '',
        prenom: '',
        email: '',
        titre: '',
        tjm: [100, 1500],
        referencesClients: [''],
        preavis: '',
        souhaitsCandidat: '',
        dureeGarePrincipale: '',
        commentaireGeneralite: '',
        departementTrajet: '',
        dureeTrajet: null,
        //justLogged: null,
        tjmMin: null, // Range for tjmMin
        tjmSouhaite: null, // Range for tjmSouhaite
        salaireMin: null, // Range for salaireMin
        salaireSouhaite: null, // Range for salaireSouhaite
        telephone: null,
        adresse: '',
        ville: '',
        statusCandidat: '',
        codePostal: null,
        nationalite: '',
        niveau: '',
        etat: '', // Assuming a string representation for the EtatCandidat enum
        responsable: '',
        disponibilite: null,
        departement: '',
        description: '',
        dateDeCreation: null,
        dateDerniereMiseAJour: null,
        emailSecondaire: '',
        complement: '',
        ambassadeur: false,
        ecouteDuMarche: false,
        cvAJour: false,
        jobboard: [], // Array for Jobboard
        salaire: null,
    };




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



    private initForm() {
        this.mainForm = this.formBuilder.group({
            referentiels: this.formBuilder.array([
                this.createReferentiel()
            ])
        });
    }


// Et le getter simple reste pour referentielsFormArray
    get referentielsFormArray(): FormArray {
        return this.formGroup.get('referentiels') as FormArray;
    }













    constructor(
        private route: ActivatedRoute,
        private candidatService: CandidatService,
        private countryService: CountryService,
        private languageService: LanguageService,
        private messageService: MessageService,
        private http: HttpClient,
        private encryptionService: EncryptionServiceService,
        private formBuilder: FormBuilder,
        private actionService: ActionsService,
        private cdref: ChangeDetectorRef,
        private besoinService:BesoinService,
        private confirmationService: ConfirmationService,


    ) {
        this.statut = [
            { label: 'Indépendant', value: 'Indépendant' },
            { label: 'Salarié', value: 'Salarié' },
            { label: 'Portage', value: 'Portage' },
            { label: 'Partenaire', value: 'Partenaire' },
            { label: 'Ouvert au CDI', value: 'Ouvert au CDI' },
        ];
        this.preavis = [
            { label: 'ASAP', value: 'ASAP' },
            { label: '< 1 Mois', value: '< 1 mois' },
            { label: 'Entre 2 et 3 mois', value: 'Entre 2 et 3 mois' },
            { label: '> 3 mois', value: '> 3 mois' },
        ];

    }
    formGroup: FormGroup = this.formBuilder.group({
        referentiels: this.formBuilder.array([]),
    });
    ngOnInit(): void {
        const userRole = localStorage.getItem('role');
        this.isAdmin = userRole === 'ADMIN';
        this.initForm()
        this.loadInitialBesoins()
        this.getCandidatActions()
        this.updateAvailableProfils()
        this.formGroup = this.formBuilder.group({
            referentiels: this.formBuilder.array([this.createReferentiel()]),
        });


        this.technoAEvaluerOptions = [];
        if (this.encryptedId) {
            const decryptedId = this.encryptionService.decryptId(
                this.encryptedId
            );
            const idAsNumber = parseInt(decryptedId, 10);
            this.getCandidatData(idAsNumber);
        }
        this.states = [
            { label: 'A Traiter', value: 'A Traiter' },
            {
                label: 'En cours de qualification',
                value: 'En cours de qualification',
            },
            { label: 'Vivier', value: 'Vivier' },
            { label: 'Top Vivier', value: 'Top Vivier' },
            { label: 'Validé', value: 'Validé' },
            { label: 'Ressource', value: 'Ressource' },
            { label: 'Sortie Prochaine', value: 'Sortie Prochaine' },
            { label: 'Sorti', value: 'Sorti' },
        ];

        this.job = [
            { label: 'TunoverIT', value: 'TunoverIT' },
            { label: 'FreelanceInfo', value: 'FreelanceInfo' },
            { label: 'Jean Miche IO', value: 'Jean Miche IO' },
            { label: 'LinkedIn', value: 'LinkedIn' },
            { label: 'paternaire', value: 'paternaire' },
        ];
        this.level = [
            { label: 'A1', value: 'A1' },
            { label: 'A2', value: 'A2' },
            { label: 'B1', value: 'B1' },
            { label: 'B2', value: 'B2' },
            { label: 'C1', value: 'C1' },
            { label: 'C2', value: 'C2' },
        ];
        // Initialize route items
        this.routeItems = [
            { label: 'Généralités' },
            { label: 'Informations' },
            { label: 'Formation et Langues' },
            { label: 'Expériences / Compétences' },
            { label: 'Financier' },
            { label: 'Interview' },
            { label: 'Notation finale' },
            { label: 'Actions' },
        ];
        this.activeStep = this.routeItems[this.stepIndex];
        this.NiveauOptions = this.mapEnumToOptions(Niveau);
        // Fetch countries from the service
        this.countryService.getCountries().then((data) => {
            this.countries = data.map((country) => ({
                label: country.name,
                value: country.code,
                code: country.code, // for flag display
            }));
        });
        // Fetch countries from the service
        this.languageService.getLanguage().then((data) => {
            this.languages = data.map((language) => ({
                label: language.name,
                value: language.code,
                code: language.code, // for flag display
            }));
        });
    }


    getCandidatActions(): void {
        this.candidatService.getCandidatActions(this.getDecryptedId()).subscribe(
            (response: any) => {
                this.actions = response;  // Assurez-vous que la réponse a la structure correcte
            },
            (error: any) => {
                console.error('Erreur lors de la récupération des actions:', error);
            }
        );
    }


    niveauxTechnos = [
        { label: 'Notions', value: 'Notions' },
        { label: 'Pratique', value: 'Pratique' },
        { label: 'Maitrise', value: 'Maitrise' },
        { label: 'Senior', value: 'Senior' },
        { label: 'Expert', value: 'Expert' },
    ];

    addFormation() {
        this.formData1.formations.push({
            titre: '',
            etablissement: '',
            commentaire: '',
            pays: '',
            anneeObtention: null,
        });
    }

    private createReferentiel(): FormGroup {
        return this.formBuilder.group({
            id: [null],
            segments: [[]],
            sousSegments: [[]],
            technologie: [[]],
            candidat: [null],
            profilReferentiels: this.formBuilder.array([
                this.createProfilReferentiel()
            ])
        });
    }
    // Créer un groupe de référentiel
    // Créer un groupe pour un profil référentiel
    createProfilReferentiel(): FormGroup {
        return this.formBuilder.group({
            profil: [null, Validators.required],
            niveau: [null, Validators.required],
        });
    }


    addCertification() {
        this.formData1.certifications.push({
            titreCertif: '',
            etablissementCertif: '',
            anneeObtentionCertif: null,
            paysCertif: null,
            commentaireCertif: '',
        });
    }

    addLangue() {
        // Génère un ID unique pour chaque nouvelle langue

        // Ajoute une nouvelle langue avec des champs vides
        this.formData1.langues.push({
            name: '', // Langue par défaut
            commentaire: '', // Champ commentaire vide
            lev: '', // Niveau par défaut
        });

        // Initialise la note de la langue nouvellement ajoutée
    }


    addExperience() {
        this.formData1.experiences.push({
            titre: '',
            client: '',
            dateDeb: '',
            dateFin: '',
            description: '',
        });
    }

    // Ajouter une nouvelle référence
    addReference() {
        this.formData1.referencesClients.push(''); // Ajoute une chaîne vide
    }

    addTechnologie() {
        this.formData1.ratedTechnologies.push({
            id: '',
            name: '',
            anneesExperiences: '',
            candidat: undefined,
        });
    }

    removeTechnologie(index: number, id: number) {
        this.formData1.ratedTechnologies.splice(index, 1);
        this.deleteTechnology(id);
    }

    removeLangue(index: number) {
        if (this.formData1.langues.length > 1) {
            this.formData1.langues.splice(index, 1);
        }
    }

    removeExperience(index: number) {
        if (this.formData1.experiences.length > 1) {
            this.formData1.experiences.splice(index, 1);
        }
    }

    // Supprimer une référence par index
    removeReference(index: number) {
        // Ne supprime que si la longueur est > 1
        if (this.formData1.referencesClients.length > 1) {
            this.formData1.referencesClients.splice(index, 1);
        }
    }
    trackByIndex(index: number, item: string): number {
        return index; // Retourne l'index pour que Angular suive chaque élément par son index
    }


    removeFormation(index: number) {
        if (this.formData1.formations.length > 1) {
            this.formData1.formations.splice(index, 1);
        }
    }

    removeCertification(index: number) {
        if (this.formData1.certifications.length > 1) {
            this.formData1.certifications.splice(index, 1);
        }
    }

    mapEnumToOptions(enumObj: any) {
        return Object.keys(enumObj).map((key) => ({
            label: enumObj[key],
            value: enumObj[key],
        }));
    }

    goToNextStep() {
        if (this.stepIndex < this.routeItems.length - 1) {
            this.stepIndex++;
            this.activeStep = this.routeItems[this.stepIndex];
        }
    }

    goToPreviousStep() {
        if (this.stepIndex > 0) {
            this.stepIndex--;
            this.activeStep = this.routeItems[this.stepIndex];
        }
    }




    mapStatistiquesProfil(): void {
        if (this.candidat?.statistiquesProfil) {
            const { segments, sousSegments, technologie } = this.candidat.statistiquesProfil;


            // Traiter les segments (sans tri)
            this.segmentsStats = (segments || []).map((segment) => ({
                name: segment.segmentKey, // Utilisation de `segmentKey` pour le nom
                percentage: segment.segmentValue // Extraction du pourcentage
            }));

            // Traiter les sous-segments (sans tri)
            this.sousSegmentsStats = (sousSegments || []).map((sousSegment) => ({
                name: sousSegment.sousSegmentKey, // Utilisation de `sousSegmentKey` pour le nom
                percentage: sousSegment.sousSegmentValue // Extraction du pourcentage
            }));

            // Traiter les technologies (sans tri)
            this.technologiesStats = (technologie || []).map((techno) => ({
                name: techno.technoKey, // Utilisation de `technoKey` pour le nom
                percentage: techno.technoValue // Extraction du pourcentage
            }));
        }
    }






    // Fonction pour récupérer le label d'un segment
    getSegmentLabel(value: string): string {
        const segment = segments.find(seg => seg.value === value);
        return segment ? segment.label : 'Autre'; // Retourne "Autre" si non trouvé
    }

// Fonction pour récupérer le label d'un sous-segment
    getSousSegmentLabel(value: string): string {
        for (const key in sousSegmentsMap) {
            const sousSegment = sousSegmentsMap[key].find(s => s.value === value);
            if (sousSegment) {
                return sousSegment.label;
            }
        }
        return 'Autre'; // Valeur par défaut si non trouvé
    }



    getCandidatData(id: number): void {
        this.candidatService.getCandidatById(id).subscribe({
            next: (response: Candidat) => {
                this.candidat = response;
                console.warn(response)
                if (this.candidat) {
                    this.populateFormData(); // Remplir les données du formulaire
                    this.initializeSectionsMap(); // Remplir les compétences
                    // Appel à mapTechnologies pour mapper les technologies à partir des référentiels du candidat
                     this.mapReferentielsFromCandidat();
                     this.mapStatistiquesProfil()
                    // Obtenir la note moyenne du candidat
                    this.candidatService
                        .getAverageRatingByCandidat(this.candidat.id)
                        .subscribe({
                            next: (data) => {
                                this.myRating[this.candidat.id] =
                                    data || 0;
                            },
                            error: (err) => {
                                console.error(
                                    `Erreur lors du chargement de la note pour le candidat ${this.candidat.id}:`,
                                    err
                                );
                                this.myRating[this.candidat.id] = 0;
                            },
                        });

                    // Appels pour chaque langue
                    const languageRequests = this.candidat.langues.map(
                        (language) =>
                            this.candidatService
                                .getAverageRatingByLanguage(language.id)
                                .pipe(
                                    catchError((err) => {
                                        console.error(
                                            `Erreur lors du chargement de la note pour la langue ${language.id}:`,
                                            err
                                        );
                                        return of(0); // Retourne 0 en cas d'erreur
                                    })
                                )
                    );
                    forkJoin(languageRequests).subscribe((ratings) => {
                        ratings.forEach((rating, index) => {
                            this.myRatingLnag[this.candidat.langues[index].id] =
                                rating || 0;
                        });
                    });

                    const technoRequests = this.candidat.ratedTechnologies.map(
                        (techno) =>
                            this.candidatService
                                .getAverageRatingForTechno(techno.id)
                                .pipe(
                                    catchError((err) => {
                                        console.error(
                                            `Erreur lors du chargement de la note pour la langue ${techno.id}:`,
                                            err
                                        );
                                        return of(0); // Retourne 0 en cas d'erreur
                                    })
                                )
                    );

                    forkJoin(technoRequests).subscribe((ratings) => {
                        ratings.forEach((rating, index) => {
                            this.myRatingTechs[
                                this.candidat.ratedTechnologies[index].id
                                ] = rating || 0;
                        });
                    });
                } else {
                    console.warn('Aucun candidat trouvé.');
                }
            },
            error: (err) => {
                console.error(
                    'Erreur lors du chargement des données du candidat:',
                    err
                );
            },
        });
    }

    mapReferentielsFromCandidat(): void {
        if (!this.candidat || !this.candidat.referentiels) return;
        const referentiels = this.candidat.referentiels;
        // Utiliser des Set pour éviter les doublons
        const uniqueSegments = new Set<string>();
        const uniqueSousSegments = new Set<string>();
        const uniqueTechnologies = new Set<any>();
        // Traiter chaque référentiel
        referentiels.forEach((referentiel) => {
            // S'assurer que segments et sousSegments sont initialisés
            referentiel.segments = [];
            referentiel.sousSegments = [];
            // Parcourir les technologies du référentiel
            referentiel.technologie.forEach((tech) => {
                this.technoAEvaluerOptions.push(tech);
                const mappedTech = this.mapSousSegmentFromTechnology(tech);
                if (mappedTech) {
                    // Vérifier et ajouter le sous-segment s'il n'a pas déjà été traité
                    if (!uniqueSousSegments.has(mappedTech.sousSegment)) {
                        uniqueSousSegments.add(mappedTech.sousSegment);

                        // Ajouter à technologiesOptions si le sous-segment est unique
                        this.technologiesOptions.push(
                            ...this.technologiesMap[mappedTech.sousSegment]
                        );

                        // Ajouter le sous-segment mappé
                        referentiel.sousSegments.push(mappedTech.sousSegment);

                        // Ajouter au tableau filtré pour éviter les doublons futurs
                        this.filteredSousSegments.push(mappedTech.sousSegment);
                    }

                    // Récupérer et ajouter le segment correspondant au sous-segment s'il est unique
                    const segment = this.getSegmentFromSousSegment(
                        mappedTech.sousSegment
                    );
                    if (segment && !uniqueSegments.has(segment)) {
                        uniqueSegments.add(segment);

                        // Ajouter à sousSegmentsOptions si le segment est unique
                        this.sousSegmentsOptions.push(
                            ...this.sousSegmentsMap[segment]
                        );
                        referentiel.segments.push(segment);

                        // Ajouter au tableau filtré pour éviter les doublons futurs
                        this.filteredSegments.push(segment);
                    }

                    // Ajouter la technologie si elle est unique
                    if (!uniqueTechnologies.has(tech)) {
                        uniqueTechnologies.add(tech);
                        this.filteredTechno.push(tech);
                    }
                }
            });
        });
    }

    getSegmentFromSousSegment(sousSegmentValue: string): string {
        // Normaliser la valeur du sous-segment
        const normalizedSousSegmentValue = sousSegmentValue
            .trim()
            .toLowerCase();

        // Parcourir chaque segment
        for (const segment of this.segments) {
            // Obtenir les sous-segments associés au segment actuel
            const sousSegments = this.sousSegmentsMap[segment.value];

            // Vérifier si des sous-segments existent pour ce segment
            if (sousSegments) {
                for (const sousSeg of sousSegments) {
                    // Comparer le label normalisé avec la valeur du sous-segment normalisée
                    if (sousSeg.value === normalizedSousSegmentValue) {
                        return segment.value; // Retourne la valeur du segment
                    }
                }
            }
        }

        return ''; // Retourne une chaîne vide si aucun segment n'est trouvé
    }

    mapSousSegmentFromTechnology(
        techName: string
    ): { sousSegment: string; label: string } | null {
        if (!techName) {
            return null;
        }
        const normalizedTechName = techName.trim().toLowerCase(); // Normaliser le nom de la technologie
        for (const key in this.technologiesMap) {
            if (this.technologiesMap.hasOwnProperty(key)) {
                const techs = this.technologiesMap[key];
                const foundTech = techs.find(
                    (t) => t.value.toLowerCase() === normalizedTechName
                );
                if (foundTech) {
                    const sousSegment = key;
                    return { sousSegment: sousSegment, label: sousSegment };
                }
            }
        }
        this.otherTechnologies.push(normalizedTechName);
        return null;
    }

    // Populate the form fields with candidate data
    populateFormData(): void {
        if (this.candidat) {
            this.formData1 = {
                id: this.candidat.id || null,
                nom: this.candidat.nom || '',
                prenom: this.candidat.prenom || '',
                email: this.candidat.email || '',
                comments: this.candidat.comments || '',
                jesaispas: this.candidat.jesaispas || null,
                referentiels : this.candidat.referentiels.map((referentiel) => ({
                    id: referentiel.id || null,
                    segments: referentiel.segments || [],
                    sousSegments: referentiel.sousSegments || [],
                    technologie: referentiel.technologie || [],
                    candidat: referentiel.candidat || null,
                    profilReferentiels: referentiel.profilReferentiels.map((profilRef) => ({
                        id: profilRef.id || null,
                        profil: profilRef.profil || null,
                        niveau: profilRef.niveau || null,
                    })),
                })),


                ratedTechnologies: this.candidat.ratedTechnologies
                    ? this.candidat.ratedTechnologies.map((ratedTechno) => ({
                        id: ratedTechno.id || null,
                        name: ratedTechno.name || [], // Remplis après le mapping
                        anneesExperiences:
                            ratedTechno.anneesExperiences || [],
                        candidat: ratedTechno.candidat || null,
                    }))
                    : [],

                formatWord: this.candidat.formatWord || null,
                infosAClarifier: this.candidat.infosAClarifier || '',
                habilitable: this.candidat.habilitable || null,
                referencesClients: this.candidat.referencesClients || null,
                formations: this.candidat.formations || null,
                langues: this.candidat.langues || null,
                certifications: this.candidat.certifications || null,
                experiences: this.candidat.experiences || null,
                dossierCompetences: this.candidat.dossierCompetences || null,
                dateMissions: this.candidat.dateMissions || null,
                departementTrajet: this.candidat.departementTrajet || '',
                dureeGarePrincipale: this.candidat.dureeGarePrincipale || '',
                dureeTrajet: this.candidat.dureeTrajet || '',
                souhaitsCandidat: this.candidat.souhaitsCandidat || '',
                preavis: this.candidat.preavis || '',
                ecouteDuMarche: this.candidat.ecouteDuMarche || null,
                salaire: this.candidat.salaire || '',
                cvAJour: this.candidat.cvAJour || null,
                commentaireGeneralite:
                    this.candidat.commentaireGeneralite || '',
                responsable: this.candidat.responsable || '',
                titre: this.candidat.titre || '',
                tjmMin: this.candidat.tjmSouhaite || null,
                tjmSouhaite: this.candidat.tjmSouhaite || null,
                salaireMin: this.candidat.salaireMin || null,
                salaireSouhaite: this.candidat.salaireSouhaite || null,
                tjm: this.candidat.tjm || null,
                telephone: this.candidat.telephone || null,
                adresse: this.candidat.adresse || '',
                etat: this.candidat.etat || '',
                ville: this.candidat.ville || '',
                codePostal: this.candidat.codePostal || null,
                nationalite: this.candidat.nationalite || '',
                niveau: this.candidat.niveau || null,
                jobboard: this.candidat.jobboard || '',
                statusCandidat: this.candidat.statusCandidat || null,
                disponibilite: this.candidat.disponibilite || null,
                departement: this.candidat.departement || '',
                description: this.candidat.description || '',
                dateDeCreation: this.candidat.dateDeCreation || null,
                dateDerniereMiseAJour:
                    this.candidat.dateDerniereMiseAJour || null,
                emailSecondaire: this.candidat.emailSecondaire || null,
                complement: this.candidat.complement || null,
                ambassadeur: this.candidat.ambassadeur || null,
            };
        }
    }

    onStepChange(event: MenuItem) {
        const index = this.routeItems.findIndex((item) => item === event);

        if (index !== -1) {
            this.stepIndex = index;
            this.activeStep = this.routeItems[index];
        }
    }

    filterCountries(event: any) {
        const query = event.query.toLowerCase();
        this.filteredCountries = this.countries.filter((country) =>
            country.label.toLowerCase().includes(query)
        );
    }

    filterLanguage(event: any) {
        const query = event.query.toLowerCase();
        this.filteredLanguages = this.languages.filter((language) =>
            language.label.toLowerCase().includes(query)
        );
    }

    onFileSelect(event: any, field: string): void {
        if (field === 'imgFile') {
            if (event.files?.[0]) {
                this.profilePictureFiles = event.files[0]; // Type File
                this.messageService.add({
                    severity: 'info',
                    summary: 'Image sélectionnée',
                    detail: 'Image candidat sélectionnée',
                });
            }
        } else if (field === 'cvFile') {
            if (event.files?.[0]) {
                this.uploadedFiles = event.files[0]; // Type File
                this.messageService.add({
                    severity: 'info',
                    summary: 'CV sélectionné',
                    detail: 'CV candidat sélectionné',
                });
            }
        } else if (field === 'cvNessFile') {
            if (event.files?.[0]) {
                this.cvNessFiles = event.files[0]; // Type File
                this.messageService.add({
                    severity: 'info',
                    summary: 'CV Ness sélectionné',
                    detail: 'CV Ness Technologies candidat sélectionné',
                });
            }
        }
    }



    onFileUpload(event: any, type: 'imgFile' | 'cvFile' | 'cvNessFile'): void {
        this.isUploading[type] = true;

        if (event.files?.[0]) {
            if (type === 'imgFile') {
                this.profilePictureFiles = event.files[0]; // Remplace directement
                console.log('Uploading Profile Picture:', this.profilePictureFiles);
            } else if (type === 'cvFile') {
                this.uploadedFiles = event.files[0]; // Remplace directement
                console.log('Uploading CV:', this.uploadedFiles);
            } else if (type === 'cvNessFile') {
                this.cvNessFiles = event.files[0]; // Remplace directement
                console.log('Uploading CV NESS:', this.cvNessFiles);
            }

            this.messageService.add({
                severity: 'info',
                summary: 'Success',
                detail: 'File Uploaded',
            });
        } else {
            console.warn('No file selected for upload');
        }

        // Simule la fin du téléchargement
        setTimeout(() => {
            this.isUploading[type] = false;
            this.isFileSelected[type] = false; // Réinitialisation après le téléchargement
        }, 2000);
    }

    onCountrySelect(event: any) {
        this.formData1.nationalite = event?.value.label || '';
        console.error(event?.value.label);
    }

    ///////////////////////RATING STARTS HERE/////////////////////
    addRating(rateValue: number, id: number) {
        console.log(rateValue);
        console.log('id', id);
        this.candidatService.addRating(rateValue, id).subscribe({
            next: (response: any) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail:
                        'Candidat ' +
                        this.candidat.nom +
                        ' ' +
                        this.candidat.prenom +
                        ' évalué avec succès !',
                });
            },
            error: (error: any) => {
                console.error('Error:', error);
            },
        });
    }
    addRatingLangue(rateValue: number, id: number) {
        console.log(rateValue);
        console.log('idLanguage', id);
        this.candidatService
            .addRatingLangue(rateValue, id)
            .subscribe((data) => {});
    }

    // Méthode appelée lors de la sélection de segments
    onSegmentChange(event: any, referentielIndex: number): void {
        const selectedSegments = event.value;
        const newSousSegments = new Set<any>();

        // Ajout des sous-segments liés aux segments sélectionnés
        selectedSegments.forEach((segment: any) => {
            const sousSegmentsForSegment = this.sousSegmentsMap[segment] || [];
            sousSegmentsForSegment.forEach((sousSegment: any) => {
                newSousSegments.add(sousSegment);
            });
        });

        // Mise à jour des options de sous-segments
        this.sousSegmentsOptions = Array.from(new Set([
            ...this.sousSegmentsOptions, // Conserver les options actuelles
            ...Array.from(newSousSegments) // Ajouter les nouvelles options
        ]));

        // Conserver les sous-segments existants et éviter les réinitialisations
        this.formData1.referentiels[referentielIndex].sousSegments = [
            ...this.formData1.referentiels[referentielIndex].sousSegments // Sous-segments existants
        ];

        // Mise à jour des options de technologies sans réinitialiser
        this.technologiesOptions = [
            ...this.technologiesOptions // Conserver les options actuelles
        ];
    }


    // Méthode appelée lors de la sélection de sous-segments
    onSousSegmentChange(event: any, referentielIndex: number): void {
        const selectedSousSegments = event.value;
        const newTechnologies = new Set<any>();

        // Ajout des technologies liées aux sous-segments sélectionnés
        selectedSousSegments.forEach((sousSegment: any) => {
            const technologiesForSousSegment = this.technologiesMap[sousSegment] || [];
            technologiesForSousSegment.forEach((techno: any) => {
                newTechnologies.add(techno);
            });
        });

        // Mise à jour des options de technologies
        this.technologiesOptions = Array.from(new Set([
            ...this.technologiesOptions, // Conserver les options actuelles
            ...Array.from(newTechnologies) // Ajouter les nouvelles options
        ]));

        // Conserver les technologies existantes
        this.formData1.referentiels[referentielIndex].technologie = [
            ...this.formData1.referentiels[referentielIndex].technologie // Technologies existantes
        ];
    }




    initializeSectionsMap() {
        console.log('Filtered Technologies:', this.filteredTechno); // Log de filteredTechno

        // Assurez-vous que sectionsMap est réinitialisé pour chaque appel
        this.sectionsMap = {};

        this.filteredTechno.forEach((tech) => {
            const normalizedTech = tech.toLowerCase(); // Normaliser la technologie

            Object.keys(this.technologiesMap).forEach((key) => {
                // Vérifiez si la technologie est dans les valeurs de technologiesMap
                const matchedTech = this.technologiesMap[key].find(
                    (item) => item.value.toLowerCase() === normalizedTech
                );

                if (matchedTech) {
                    // Si la clé n'existe pas encore dans sectionsMap, initialisez-la
                    if (!this.sectionsMap[key]) {
                        this.sectionsMap[key] = [];
                    }
                    // Ajoutez la technologie correspondante à sectionsMap
                    this.sectionsMap[key].push(matchedTech);
                    console.log(`Match found: ${matchedTech.label} in ${key}`); // Log si un match est trouvé
                }
            });
        });

        console.log('Final Sections Map:', this.sectionsMap); // Vérifiez la structure de sectionsMap
    }

    ////////////////////////////////////ADD AND RATE TECHNOLOGY STARTS HERE///////////////////////////////////////////
    addAndRateTechnology(id: number, value: number, technology: Technology) {
        if (!technology || !technology.name) {
            console.error('Invalid technology data:', technology);
            return;
        }

        this.candidatService
            .addAndRateTechnology(id, value, technology)
            .subscribe({
                next: (response: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail:
                            'Technologie ' +
                            technology.name +
                            ' évaluée avec succès !',
                    });
                },
                error: (error: any) => {
                    console.error('Error:', error);
                },
            });
    }

    // Méthode pour mettre à jour l'expérience
    updateExperience(id: number, experience: number): void {
        if (id) {
            this.candidatService
                .updateTechnologyExperience(id, experience)
                .subscribe({
                    next: (updatedTechnology: Technology) => {},
                    error: (error) => {
                        console.error('Erreur lors de la mise à jour :', error);
                    },
                });
        }
    }

    deleteTechnology(id: number) {
        this.candidatService.removeTechnology(id).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: "L'évaluation de la technologie a été suprimée correctement ! ",
                });
            },
            error: (error) => {
                console.error(
                    'Erreur lors de la suppression de la technologie:',
                    error
                );
            },
        });
    }

    // Ajout des formations sous forme de tableau d'objets
     normalizePays(pays: any): string {
        if (typeof pays === 'object' && pays !== null && pays.label) {
            console.warn("zzzzzzzzzzzzzzzzzzzzzzzzzz",pays.label)
            return pays.label;

        } else if (typeof pays === 'string') {
            return pays;
        }
        return ''; // Valeur par défaut si 'pays' est null ou d'un autre type
    }


    onSubmit(candidatureForm: NgForm): void {
        if (candidatureForm.valid) {
            const formData = new FormData();

            // Ajouter les données simples de formData1
            formData.append('nom', this.formData1.nom || '');
            formData.append('prenom', this.formData1.prenom || '');
            formData.append('email', this.formData1.email || '');
            formData.append(
                'emailSecondaire',
                this.formData1.emailSecondaire || ''
            );
            formData.append('titre', this.formData1.titre || '');
            formData.append('telephone', this.formData1.telephone || '');
            formData.append('adresse', this.formData1.adresse || '');
            formData.append('ville', this.formData1.ville || '');
            formData.append('niveau', this.formData1.niveau || '');
            console.warn(this.formData1.niveau);
            formData.append('codePostal', this.formData1.codePostal || '');
            formData.append('nationalite', this.formData1.nationalite || '');
            formData.append('departement', this.formData1.departement || '');

            // Ajouter la disponibilité + 1 jour
            const disponibiliteStr =
                this.formData1.disponibilite instanceof Date
                    ? new Date(
                        this.formData1.disponibilite.setDate(
                            this.formData1.disponibilite.getDate() + 1
                        )
                    )
                        .toISOString()
                        .split('T')[0]
                    : this.formData1.disponibilite || '';
            formData.append('disponibilite', disponibiliteStr);

            // Ajouter les fichiers
            if (this.profilePictureFiles) {
                formData.append('imgFile', this.profilePictureFiles); // Ajout d'un fichier unique
            }

            if (this.uploadedFiles) {
                formData.append('cvFile', this.uploadedFiles); // Ajout d'un fichier unique
            }

            if (this.cvNessFiles) {
                formData.append('cvNessFile', this.cvNessFiles); // Ajout d'un fichier unique
            }

            this.formData1.formations.forEach((formation, index) => {
                // Normalisation des données
                formData.append(`formations[${index}].titre`, formation.titre || '');
                formData.append(`formations[${index}].etablissement`, formation.etablissement || '');
                formData.append(`formations[${index}].commentaire`, formation.commentaire || '');

                // Vérifie et normalise le pays avant de l'ajouter à FormData
                if (formation.pays) {
                    const paysLabel = this.normalizePays(formation.pays);
                    formation.pays = paysLabel; // Met à jour l'objet avec une chaîne normalisée
                    formData.append(`formations[${index}].pays`, paysLabel);
                } else {
                    formData.append(`formations[${index}].pays`, ''); // Si null ou undefined
                }

                // Conversion et ajout de l'année d'obtention
                const anneeObtentionStr = formation.anneeObtention
                    ? new Date(formation.anneeObtention).getFullYear().toString()
                    : '';
                formation.anneeObtention = anneeObtentionStr;
                formData.append(`formations[${index}].anneeObtention`, anneeObtentionStr);
            });

            // Ajout des références clients
            this.formData1.referencesClients.forEach((reference, index) => {
                formData.append(`referencesClients[${index}]`, reference || '');
            });







            // Ajouter les langues
            this.formData1.langues.forEach((langue, index) => {

                if (langue.name) {
                    const paysLabel = this.normalizePays(langue.name)   ;
                    langue.name = paysLabel; // Met à jour l'objet avec une chaîne normalisée
                    formData.append(`langues[${index}].name`, paysLabel);
                } else {
                    formData.append(`langues[${index}].name`, ''); // Si null ou undefined
                }
                formData.append(`langues[${index}].lev`, langue.lev || '');
                formData.append(
                    `langues[${index}].commentaire`,
                    langue.commentaire || ''
                );
            });

            // Ajouter les certifications
            this.formData1.certifications.forEach((certification, index) => {

                formData.append(
                    `certifications[${index}].titreCertif`,
                    certification.titreCertif || ''
                );
                formData.append(
                    `certifications[${index}].etablissementCertif`,
                    certification.etablissementCertif || ''
                );
                formData.append(
                    `certifications[${index}].commentaireCertif`,
                    certification.commentaireCertif || ''
                );
            if (certification.paysCertif) {
                const paysLabel = this.normalizePays(certification.paysCertif);
                certification.paysCertif = paysLabel; // Met à jour l'objet avec une chaîne normalisée
                formData.append(`certifications[${index}].paysCertif`, paysLabel);
            } else {
                formData.append(`certifications[${index}].paysCertif`, ''); // Si null ou undefined
            }
                //     // Conversion et ajout de l'année d'obtention
                    const anneeObtentionStr = certification.anneeObtentionCertif
                        ? new Date(certification.anneeObtentionCertif).getFullYear().toString()
                        : '';
                certification.anneeObtentionCertif= anneeObtentionStr;
                    formData.append(`certifications[${index}].anneeObtentionCertif`, anneeObtentionStr);
                });



            // Ajouter les expériences
            this.formData1.experiences.forEach((experience, index) => {
                formData.append(
                    `experiences[${index}].titre`,
                    experience.titre || ''
                );
                // Conversion et ajout de l'année d'obtention
                const anneeEtMoisStr = experience.dateDeb
                    ? new Date(experience.dateDeb).getFullYear().toString() +
                    '-' +
                    (new Date(experience.dateDeb).getMonth() + 1).toString().padStart(2, '0')
                    : '';
                experience.dateDeb = anneeEtMoisStr;
                formData.append(`experiences[${index}].dateDeb`, anneeEtMoisStr);


                const anneeEtMoisStr1 = experience.dateFin
                    ? new Date(experience.dateFin).getFullYear().toString() +
                    '-' +
                    (new Date(experience.dateFin).getMonth() + 1).toString().padStart(2, '0')
                    : '';
                experience.dateFin = anneeEtMoisStr1;
                formData.append(`experiences[${index}].dateFin`, anneeEtMoisStr1);


                formData.append(
                    `experiences[${index}].client`,
                    experience.client || ''
                );
                formData.append(
                    `experiences[${index}].description`,
                    experience.description || ''
                );
            });

            // Ajouter les référentiels
            // S'assurer que formData1.referentiels est correctement peuplé
            this.formData1.referentiels.forEach((referentiel, index) => {
                console.warn('Référentiel actuel:', referentiel);

                // Ajouter les segments
                if (this.filteredSegments && this.filteredSegments.length > 0) {
                    this.filteredSegments.forEach((segment, segIndex) => {
                        if (segment) {
                            formData.append(
                                `referentiels[${index}].segments[${segIndex}]`,
                                segment.toString()
                            );
                            console.warn(
                                `Ajouté segment: referentiels[${index}].segments[${segIndex}] = ${segment.toString()}`
                            );
                        }
                    });
                } else {
                    console.warn(
                        `Aucun segment trouvé pour le référentiel à l'index ${index}`
                    );
                }

                // Ajouter les sousSegments
                if (
                    this.filteredSousSegments &&
                    this.filteredSousSegments.length > 0
                ) {
                    this.filteredSousSegments.forEach(
                        (sousSegments, segIndex) => {
                            if (sousSegments) {
                                formData.append(
                                    `referentiels[${index}].sousSegments[${segIndex}]`,
                                    sousSegments.toString()
                                );
                                console.warn(
                                    `Ajouté segment: referentiels[${index}].sousSegments[${segIndex}] = ${sousSegments.toString()}`
                                );
                            }
                        }
                    );
                } else {
                    console.warn(
                        `Aucun segment trouvé pour le référentiel à l'index ${index}`
                    );
                }

                // Ajouter les profils
                // if (referentiel.profilReferentiels.profil && referentiel.profil.length > 0) {
                //     referentiel.profil.forEach((prof, profIndex) => {
                //         if (prof) {
                //             formData.append(
                //                 `referentiels[${index}].profil[${profIndex}]`,
                //                 prof
                //             );
                //             console.warn(
                //                 `Ajouté profil: referentiels[${index}].profil[${profIndex}] = ${prof}`
                //             );
                //         }
                //     });
                // } else {
                //     console.warn(
                //         `Aucun profil trouvé pour le référentiel à l'index ${index}`
                //     );
                // }

                // Ajouter les technologies
                if (
                    referentiel.technologie &&
                    referentiel.technologie.length > 0
                ) {
                    referentiel.technologie.forEach((techno, techIndex) => {
                        if (techno) {
                            formData.append(
                                `referentiels[${index}].technologie[${techIndex}]`,
                                techno
                            );
                            console.warn(
                                `Ajouté technologie: referentiels[${index}].technologie[${techIndex}] = ${techno}`
                            );
                        }
                    });
                } else {
                    console.warn(
                        `Aucune technologie trouvée pour le référentiel à l'index ${index}`
                    );
                }
            });

            formData.forEach((value, key) => {
                console.warn(`Clé: ${key}, Valeur: ${value}`);
            });

            // Ajouter les fichiers
            if (this.profilePictureFiles) {
                formData.append('imgFile', this.profilePictureFiles); // Ajout d'un fichier unique
            }

            if (this.uploadedFiles) {
                formData.append('cvFile', this.uploadedFiles); // Ajout d'un fichier unique
            }

            if (this.cvNessFiles) {
                formData.append('cvNessFile', this.cvNessFiles); // Ajout d'un fichier unique
            }
            // Ajouter les autres champs
            formData.append(
                'dossierCompetences',
                this.formData1.dossierCompetences ? 'true' : 'false'
            );
            formData.append(
                'dateMissions',
                this.formData1.dateMissions ? 'true' : 'false'
            );
            formData.append(
                'formatWord',
                this.formData1.formatWord ? 'true' : 'false'
            );
            formData.append(
                'habilitable',
                this.formData1.habilitable ? 'true' : 'false'
            );
            formData.append(
                'jesaispas',
                this.formData1.jesaispas ? 'true' : 'false'
            );
            formData.append(
                'infosAClarifier',
                this.formData1.infosAClarifier || ''
            );
            formData.append('comments', this.formData1.comments || '');

            // Ajouter les champs relatifs aux gammes (tjm, salaire, etc.)
            if (this.formData1?.tjmMin) {
                formData.append('tjmMin', this.formData1.tjmMin);
            }
            if (this.formData1?.tjmSouhaite) {
                formData.append('tjmSouhaite', this.formData1.tjmSouhaite);
            }
            if (this.formData1?.salaireMin) {
                formData.append('salaireMin', this.formData1.salaireMin);
            }
            if (this.formData1?.salaireSouhaite) {
                formData.append(
                    'salaireSouhaite',
                    this.formData1.salaireSouhaite
                );
            }

            // Ajouter les données mises à jour de candidat comme une chaîne JSON
            formData.append(
                'updatedCandidatData',
                JSON.stringify(this.formData1)
        );
            console.warn('updatedCandidatData:', JSON.stringify(this.formData1));

            // Appeler le service pour créer le candidat
            this.candidatService
                .updateCandidat(formData, this.candidat.id)
                .subscribe({

                    next: (response: any) => {
                        console.warn('Form Dataaaaaaaaaaaaaa:', formData);

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Candidat modifié avec succès !',
                        });
                    },
                    error: (err: any) => {
                        console.warn('Form Dataaaaaaaaaaaaaa:', formData);

                        this.candidatService.showError(err);
                        this.showError = true;
                        setTimeout(() => {
                            this.showError = false;
                        }, 2000);
                    },
                });
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Error',
                detail: 'Form is invalid',
            });
        }
    }


    // Ajouter un profil référentiel dans un référentiel donné
    addProfilReferentiel() {
        // Initialiser les référentiels s'il n'existe pas
        if (!this.formData1.referentiels || this.formData1.referentiels.length === 0) {
            this.formData1.referentiels = [
                {
                    id: null,
                    segments: [],
                    sousSegments: [],
                    technologie: [],
                    candidat: null,
                    profilReferentiels: []
                }
            ];
        }

        // Ajouter un nouveau profil
        this.formData1.referentiels[0].profilReferentiels.push({
            id: null,
            profil: null,
            niveau: null
        });
        this.updateAvailableProfils()
    }

    removeProfilReferentiel(profilIndex: number): void {
        if (this.formData1.referentiels?.[0]?.profilReferentiels?.length > 0) {
            this.formData1.referentiels[0].profilReferentiels.splice(profilIndex, 1);
        }
        this.updateAvailableProfils()
    }


    get referentiels(): FormArray {
        return this.formGroup.get('referentiels') as FormArray;
    }


    showActionDialog(): void {
        this.displayActionDialog = true;
    }


    onSubmitActionCandidat() {
        if (this.action.besoin) {
            this.actionToSubmit = {
                ...this.action,
                besoin: {
                    id: this.action?.besoin?.id // Supposant que le besoin a une structure {value, label}
                }
            };
        } else {
            this.actionToSubmit = {
                ...this.action
            };
        }

        this.actionService.addActionToCandidat(this.getDecryptedId(), this.actionToSubmit)
            .pipe(
                finalize(() => {
                    this.cdref.detectChanges();
                    setTimeout(() => {
                        this.cdref.detectChanges();
                    }, 1000);
                }),
                tap(() => {
                    // Appeler getCandidatActions après la soumission
                    this.getCandidatActions();
                    this.displayActionDialog=false;
                    this.initAction()
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

    onEyeClick(event: MouseEvent, besoinId: number) {
        event.stopPropagation(); // Empêche la fermeture du dropdown
        this.showViewBesoinDialog(besoinId); // Affiche le besoin dans une boîte de dialogue
    }

    preventDropdownClose(event: MouseEvent) {
        event.stopPropagation(); // Empêche le clic de fermer le dropdown
        event.preventDefault(); // Empêche tout comportement par défaut (par sécurité)
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


    // Méthode pour formater les options du besoin pour le dropdown
    formatBesoinOptions(besoins: any[]): any[] {
        return besoins.map(besoin => ({
            label: besoin.titre,
            value: besoin
        }));
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


    shouldShowField1(fieldName: string): boolean {
        if (!this.selectedAction) return false;

        switch (fieldName) {
            case 'besoin':
                // Afficher si l'action a un besoin OU si le type nécessite un besoin
                return Boolean(this.selectedAction.besoin) ||
                    ['Positionnement présenti', 'Positionnement', 'Entretien partenaire', 'Entretien client'].includes(this.selectedAction.type);
            case 'relance':
                return true; // Toujours affiché
            case 'prochainRdvPlanifie':
                return ['Appel', 'E-mail', 'Appel + Mail', 'Echange téléphonique', 'RDV'].includes(this.selectedAction.type);
            case 'dateProchainRdvPlanifie':
                return this.selectedAction.prochainRdvPlanifie === true;
            case 'commentaires':
                return true; // Toujours affiché
            default:
                return false;
        }
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
                this.getCandidatActions();

                // Show success toast
                this.messageService.add({
                    severity: 'success',
                    summary: 'Delete Successful',
                    detail: 'Action supprimée avec succès!',
                    life: 3000
                });
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
    onProfilChangeAdd(index: number) {
        this.updateAvailableProfils();
    }

    updateAvailableProfils() {
        const profilReferentiels = this.formData1?.referentiels[0]?.profilReferentiels;

        if (!Array.isArray(profilReferentiels)) {
            console.error('profilReferentiels is not an array');
            return;
        }

        // Récupérer tous les profils actuellement sélectionnés
        const selectedProfils = profilReferentiels
            .map(profilRef => profilRef.profil)
            .filter(profil => profil !== null);

        // Mettre à jour les profils disponibles pour chaque dropdown
        this.availableProfils = profilReferentiels.map((profilRef, index) => {
            const currentProfil = profilRef.profil;

            // Filtrer les profils pour n'inclure que ceux qui :
            // - Ne sont pas sélectionnés dans d'autres dropdowns
            // - OU sont le profil actuellement sélectionné dans ce dropdown
            return this.profils.filter(profil =>
                !selectedProfils.includes(profil.value) ||
                profil.value === currentProfil
            );
        });

        this.cdref.detectChanges();
    }


}



