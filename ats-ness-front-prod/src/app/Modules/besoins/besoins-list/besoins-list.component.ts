import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { Besoin } from 'src/app/demo/models/besoin';
import { BesoinService } from 'src/app/demo/service/besoin.service';
import {profils, segments, sousSegmentsMap, technologiesMap} from "../../../../../ReferentielDefinition";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Client} from "../../../demo/models/Client";
import {Referentiel} from "../../../demo/models/Referentiel";
import {BesoinsTechnologies} from "../../../demo/models/BesoinsTechnologies";
import {ProfilReferentiel} from "../../../demo/models/ProfilReferentiel";

@Component({
  selector: 'app-besoin-list',
  templateUrl: './besoins-list.component.html',
  styleUrls: ['./besoins-list.component.scss']
})
export class BesoinListComponent implements OnInit {
  besoins: Besoin[] = [];
  selectedBesoin: Besoin | null = null;
  loading: boolean = true;
  expandedRows: { [key: string]: boolean } = {};
  displayDetails: boolean = false;
  displayEditSidebar: boolean = false;
  displayQRCode: boolean = false;
  besoinForm: FormGroup;
    displayBesoinSidebar: boolean = false;
    availableProfils: { label: string, value: string }[][] = [];
    originalProfils = profils;
    sousSegmentsOptions = [];
    technologiesOptions = [];
    sousSegmentsMap = sousSegmentsMap;
    technologiesMap = technologiesMap;
    filteredTechnologies = [];
    segmentsOptions: any[] = [];

    segments = segments;
  //  besoin: Besoin = {} as Besoin;
    availableTechnologies: any[][] = [];



    seniorityLevels = [
        { label: 'Junior', value: 'Junior' },
        { label: 'Intermédiaire', value: 'Intermédiaire' },
        { label: 'Confirmé', value: 'Confirmé' },
        { label: 'Senior', value: 'Senior' },
        { label: 'Expert', value: 'Expert' },
        { label: 'Maitre', value: 'Maitre' },
        { label: 'Lead', value: 'Lead' }
    ];
    importanceOptions = [
        { label: 'Optionnel', value: 'Optionnel' },
        { label: 'Important', value: 'Important' },
        { label: 'Indispensable', value: 'Indispensable' },
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
  constructor(
    private besoinService: BesoinService,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private fb:FormBuilder,

  ) {}

  ngOnInit(): void {
    this.loadBesoins();
    this.primengConfig.ripple = true;
    this.initForm()
  }
    initForm() {
        this.besoinForm = this.fb.group({
            // Informations générales
            titre: ['', Validators.required],
            reference: [''],
            aoSow: [''],
            descriptifUrl: [''],
            etat: [''],
            plateforme: [''],
            besoinEnAvanceDePhase: [false],
            reccurent: [false],
            demarrageASAP: [false],
            dateDeDemarrage: [''],
            habilitable: [false],

            // ProfilBesoins (FormGroup ou FormArray selon besoin)
            // profilBesoins: this.fb.array([this.createProfilBesoinFormGroup()]), // Initialisation avec un groupe vide

            // Media (QR Code)
            qrCodeImage: this.fb.group({
                url: [''],  // Par exemple, une URL ou un autre type de champ selon la structure de Media
                alt: ['']   // Autre champ que vous pouvez ajouter
            }),

            // IntimitéClient (FormArray)
            intimiteClient: this.fb.array([this.createRatingFormGroup()]), // Array pour gérer plusieurs ratings



            profilBesoins: this.fb.group({
                difficultes: [''],
                seniorite: [''],
                anneesExperienceTotales: [''],
                tjmMinEstime: [''],
                tjmMaxEstime: [''],
                tjmMax: [''],
                tjmMin: [''],
                tjmSouhaite: [''],
                commentaire: [''],
                avantages: ['']
            }),
            referentiel: this.fb.group({
                id: [undefined],
                segments: [[]],  // Changé en array simple pour p-multiSelect
                sousSegments: [[]], // Changé en array simple pour p-multiSelect
                profilReferentiels: this.fb.array([
                    this.fb.group({
                        id: [undefined],
                        profil: [''],
                        niveau: [''],
                        referentiel: [undefined]
                    })
                ]),
                technologie: [[]], // Changé en array simple pour p-multiSelect
                besoin: [undefined],
                candidat: [undefined]
            }),

            besoinsTechnologies: this.fb.array([]), // Initialisation d'un FormArray vide
        });
        this.addBesoinTechnologies();

    }
    get profilReferentielsBesoins() {
        return this.besoinForm.get('referentiel.profilReferentiels') as FormArray;
    }

    get referentielForm() {
        return this.besoinForm.get('referentiel') as FormGroup;
    }
// Fonction pour créer un ProfilBesoin FormGroup
    createProfilBesoinFormGroup() {
        return this.fb.group({
            // Ajoutez ici les champs de ProfilBesoin
            nom: [''],
            description: [''],
            // Ajoutez d'autres champs si nécessaire
        });
    }

// Fonction pour créer un Rating FormGroup
    createRatingFormGroup() {
        return this.fb.group({
            score: [''],
            commentaire: [''],
            // Ajoutez d'autres champs si nécessaire
        });
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

    createDefaultReferentiel(): Referentiel {
        return {
            id: undefined,
            segments: [],
            sousSegments: [],
            profilReferentiels: [{
                id: undefined,
                profil: '',
                niveau: '',
                referentiel: undefined,
            }],
            technologie: [],
            besoin: undefined,
            candidat:undefined,
        };
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
    // createDefaultProfilReferentiel(): FormGroup {
    //     return {
    //         id: undefined,
    //         profil: '',
    //         niveau: '',
    //         referentiel: undefined,
    //     };
    // }


    loadBesoins(): void {
    this.loading = true;
    this.besoinService.getAllBesoins().subscribe({
      next: (data) => {
        this.besoins = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching besoins:', err);
        this.loading = false;
      }
    });
  }

  getStateSeverity(state: string): string {
    switch(state?.toLowerCase()) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'inactive': return 'danger';
      default: return 'info';
    }
  }

  toggleRow(besoin: Besoin): void {
    this.expandedRows[besoin.reference] = !this.expandedRows[besoin.reference];
  }

  showDetails(besoin: Besoin): void {
    this.selectedBesoin = besoin;
    this.displayDetails = true;
  }

  showQRCode(besoin: Besoin): void {
    this.selectedBesoin = besoin;
    this.displayQRCode = true;
  }

    openEditSidebar(besoin: Besoin): void {
        this.selectedBesoin = besoin;
        console.warn("besoin", besoin);

        // Patch des valeurs du formulaire avec des valeurs par défaut si nécessaire
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
            referentiel: {
                id: besoin.referentiel?.id,
                segments: besoin.referentiel?.segments || [],
                sousSegments: besoin.referentiel?.sousSegments || [],
                technologie: besoin.referentiel?.technologie || [],
                besoin: null,
                candidat: null
            }
        });

        // Gestion des profilReferentiels
        const profilReferentielsArray = this.profilReferentielsBesoins;
        profilReferentielsArray.clear();

        if (besoin.referentiel?.profilReferentiels?.length) {
            besoin.referentiel.profilReferentiels.forEach(profil => {
                profilReferentielsArray.push(this.fb.group({
                    id: [profil.id],
                    profil: [profil.profil],
                    niveau: [profil.niveau],
                    referentiel: [profil.referentiel]
                }));
            });
        } else {
            // Ajouter au moins un profilReferentiel vide
            profilReferentielsArray.push(this.fb.group({
                id: [undefined],
                profil: [''],
                niveau: [''],
                referentiel: [undefined]
            }));
        }

        // Gestion des besoinsTechnologies
        this.besoinsTechnologiesArray.clear();
        if (besoin.besoinsTechnologies?.length) {
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

        // Initialisation des sélections et mise à jour des listes déroulantes
        this.initializeSelections1(besoin.referentiel);
        this.displayEditSidebar = true;
        this.updateAvailableProfilsUpdateBesoin();
        this.filterTechnoUpdate();
    }



    addBesoinTechnologies() {
        if (this.besoin.besoinsTechnologies.length < 5) {
            const besoinsTechnologiesArray = this.besoinForm.get('besoinsTechnologies') as FormArray;
            besoinsTechnologiesArray.push(this.fb.group({
                technologie: ['', Validators.required],
                niveau: ['', Validators.required],
                importance: ['', Validators.required],
                anneesExperience: [null, Validators.required]

            }));
        }
    }

    createProfilReferentielFormGroup() {
        return this.fb.group({
            profil: ['', Validators.required],
            niveau: ['', Validators.required],
            anneesExperience: ['', Validators.required],
        });
    }

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
    initProfilReferentiel() {
        if(this.profilReferentiels.length==0){
            this.profilReferentiels.push(this.createProfilReferentielFormGroup());

        }
        this.updateAvailableProfilsUpdate();
    }

    get profilReferentiels(): FormArray {
        return this.besoinForm.get('referentiel.profilReferentiels') as FormArray;
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


    addNewBesoin(): void {
    // Implement new besoin creation logic
    console.log('Adding new besoin...');
  }

  downloadQRCode(): void {
    if (this.selectedBesoin?.qrCodeImage?.imagenUrl) {
      const link = document.createElement('a');
      link.href = this.selectedBesoin.qrCodeImage.imagenUrl;
      link.download = `qr-code-${this.selectedBesoin.reference}.png`;
      link.click();
    }
  }

  navigateToAddBesoin() {
    this.router.navigateByUrl('/back-office/besoins/AddBesoin');
  }

  updateBesoin(): void {
    // if (this.selectedBesoin) {
    //   this.loading = true;
    //   this.besoinService.updateBesoin(this.selectedBesoin).subscribe({
    //     next: (updatedBesoin) => {
    //       const index = this.besoins.findIndex(b => b.reference === updatedBesoin.reference);
    //       if (index !== -1) {
    //         this.besoins[index] = updatedBesoin;
    //       }
    //       this.displayEditSidebar = false;
    //       this.loading = false;
    //     },
    //     error: (err) => {
    //       console.error('Error updating besoin:', err);
    //       this.loading = false;
    //     }
    //   });
    // }
  }


    onProfilChangeBesoin(index: number) {
        this.updateAvailableProfilsUpdateBesoin();
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

    addProfilReferentielUpdateBesoin() {
        this.profilReferentielsBesoins.push(this.createProfilReferentielFormGroup2());
    }

    createProfilReferentielFormGroup2() {
        return this.fb.group({
            profil: ['', Validators.required],
            niveau: ['', Validators.required],
        });
    }

    removeProfilReferentielUpdateBesoin(index: number) {
        this.profilReferentielsBesoins.removeAt(index);
        this.updateAvailableProfilsUpdateBesoin()
    }

    // Les événements onChange peuvent être utilisés pour mettre à jour les valeurs dynamiquement
    onSegmentChange(event: any): void {
        const selectedSegments = event.value;
        this.loadOptionsForSegments(selectedSegments);
    }

    loadOptionsForSegments(selectedSegments: string[]): void {
        // Ne pas réinitialiser les sous-segments et technologies lors de la modification des segments
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

    updateTechnologies(selectedSousSegments: string[]): void {
        // Récupérer les technologies de la BD
        const selectedTechnologies = this.besoin.referentiel?.technologie || [];

        // Mettre à jour les valeurs du formulaire
        this.besoinForm.patchValue({
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

    onTechnoChange(event: any): void {
        const selectedSousSegments = event.value;
        this.updateTechnologies(selectedSousSegments);
    }

    get besoinsTechnologiesArray(): FormArray {
        return this.besoinForm.get('besoinsTechnologies') as FormArray;
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


}
