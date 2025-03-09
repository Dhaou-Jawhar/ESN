import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { BesoinService } from '../../../demo/service/besoin.service';
import {ClientService} from "../../../demo/service/client.service";
import {profils, segments, sousSegmentsMap, technologiesMap} from "../../../../../ReferentielDefinition";
import {ProfilReferentiel} from "../../../demo/models/ProfilReferentiel";
import {Besoin} from "../../../demo/models/besoin";
import {BesoinsTechnologies} from "../../../demo/models/BesoinsTechnologies";

interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

@Component({
  selector: 'app-besoins-form',
  templateUrl: './besoins-form.component.html',
  styleUrls: ['./besoins-form.component.scss'],
  providers: [MessageService, ConfirmationService]
})


export class BesoinsFormComponent implements OnInit {
  besoinForm: FormGroup;
  isLoading = false;
  progress = 0;
    filteredClientsOptions: string[] = [];
    isValidClient: boolean = true;
    ClientOptions: { nom: string; prenom: string }[] = [];
    page = 0;
    size = 2;
    totalElements = 0;
    availableProfils: { label: string, value: string }[][] = [];
    originalProfils = profils;
    segments = segments;
    segmentsOptions: any[] = [];
    sousSegmentsOptions = [];
    technologiesOptions = [];
    sousSegmentsMap = sousSegmentsMap;
    technologiesMap = technologiesMap;
    filteredTechnologies = [];
    availableTechnologies: any[][] = [];


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
  constructor(
    private fb: FormBuilder,
    private besoinService: BesoinService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private clientServices:ClientService,
  ) {
    this.besoinForm = this.fb.group({
      titre: ['', Validators.required],
      besoinEnAvanceDePhase: [false],
      reccurent: [false],
      demarrageASAP: [false],
      dateDeDemarrage: ['', Validators.required],
      etat: ['', Validators.required],

        habilitable: [false],
      profilBesoins: this.fb.group({
        difficultes: [''],
        seniorite: ['', Validators.required],
        anneesExperienceTotales: ['', Validators.required],
        tjmMinEstime: ['', Validators.required],
        tjmMaxEstime: ['', Validators.required],
        tjmMax: ['', Validators.required],
        tjmMin: ['', Validators.required],
        tjmSouhaite: ['', Validators.required],
        commentaire: [''],
          avantages: ['']

      }),
        referentiel:this.fb.group({
            profilReferentiels: this.fb.array([this.createProfilReferentielFormGroup()]), // Initialiser avec un groupe vide
            segments: [[], Validators.required],
            sousSegments: [[], Validators.required],
            technologie: [[], Validators.required],

        }),
        besoinsTechnologies: this.fb.array([this.createBesoinsTechnologiesFormGroup()]), // Initialiser avec un FormArray

        client: this.fb.group({
        nom: ['', Validators.required],
        prenom: ['', Validators.required]

      })
    });
  }

  ngOnInit() {
      this.loadClients()
  }
    createBesoinsTechnologiesFormGroup() {
        return this.fb.group({
            technologie: ['', Validators.required],
            niveau: ['', Validators.required],
            importance: ['', Validators.required],
            anneesExperience: ['', Validators.required]
        });
    }

    createProfilReferentielFormGroup() {
        return this.fb.group({
            profil: ['', Validators.required],
            niveau: ['', Validators.required],
            // anneesExperience: ['', Validators.required],
        });
    }



  resetForm() {
    this.confirmationService.confirm({
      message: 'Voulez-vous vraiment réinitialiser le formulaire ?',
      header: 'Confirmation de réinitialisation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.besoinForm.reset({
          etat: 'Ouvert',
          besoinEnAvanceDePhase: false,
          reccurent: false,
          demarrageASAP: false,
          habilitable: false
        });

        this.messageService.add({
          severity: 'info',
          summary: 'Information',
          detail: 'Le formulaire a été réinitialisé'
        });
      }
    });
  }

  onSubmit() {
    if (this.besoinForm.valid) {
      this.isLoading = true;
      this.progress = 0;

      const progressInterval = setInterval(() => {
        this.progress += 10;
        if (this.progress >= 90) clearInterval(progressInterval);
      }, 200);

      this.besoinService.createBesoin(this.besoinForm.value).subscribe({
        next: (response) => {
          this.progress = 100;
          this.isLoading = false;
          clearInterval(progressInterval);
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Besoin créé avec succès'
          });
          this.besoinForm.reset();
        },
        error: (error) => {
          this.isLoading = false;
          clearInterval(progressInterval);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la création du besoin'
          });
        }
      });
    } else {
      Object.keys(this.besoinForm.controls).forEach(key => {
        const control = this.besoinForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });

      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez remplir tous les champs obligatoires'
      });
    }
  }


    filterClients(event: any): void {
        const query = event.query.toLowerCase();
        this.filteredClientsOptions = this.ClientOptions
            .map(option => `${option.nom} ${option.prenom}`) // Combiner nom et prénom
            .filter(fullName => fullName.toLowerCase().includes(query)); // Filtrer par le texte saisi
    }



    handleClear() {
        this.isValidClient = true;
    }

    processFullName(): void {
        const fullName = this.besoinForm.get('client.nom')?.value?.trim(); // Récupérer la valeur combinée

        if (fullName) {
            const [nom, ...prenomParts] = fullName.split(' '); // Diviser par espace
            const prenom = prenomParts.join(' '); // Rassembler les morceaux restants pour le prénom

            // Mettre à jour les champs `nom` et `prenom` séparément
            this.besoinForm.patchValue({
                client: {
                    nom: nom || '',
                    prenom: prenom || ''
                }
            });
        }
    }



    loadClients(): void {
        if (this.isLoading) return; // Empêcher les appels simultanés
        this.isLoading = true;

        this.clientServices.getClients(this.page, this.size).subscribe(
            (response: Page<any>) => {
                // Ajouter les clients avec leurs noms et prénoms
                this.ClientOptions = [
                    ...this.ClientOptions,
                    ...response.content.map(client => ({
                        nom: client.nom,
                        prenom: client.prenom
                    }))
                ];

                this.totalElements = response.totalElements;

                this.isLoading = false;

                if (this.ClientOptions.length < this.totalElements) {
                    this.loadMore(); // Charger plus de données
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


    onProfilChangeAdd(index: number) {
        this.updateAvailableProfils();
    }

    updateAvailableProfils() {
        // Réinitialiser le tableau des profils disponibles
        this.availableProfils = [];

        // Récupérer le FormArray 'profilReferentiels' depuis le FormGroup 'referentiel'
        const profilReferentiels = this.besoinForm.get('referentiel.profilReferentiels') as FormArray;

        if (profilReferentiels instanceof FormArray) {
            // Récupérer tous les profils actuellement sélectionnés
            const selectedProfils = profilReferentiels.controls
                .map(control => (control as FormGroup).get('profil')?.value)
                .filter(profil => profil !== undefined && profil !== null);

            // Générer les profils disponibles pour chaque dropdown
            for (let i = 0; i < profilReferentiels.length; i++) {
                const currentControl = profilReferentiels.at(i) as FormGroup;
                const currentProfil = currentControl.get('profil')?.value;

                // Filtrer les profils
                const availableProfilsForIndex = this.originalProfils.filter(
                    profil => !selectedProfils.includes(profil.value) || profil.value === currentProfil
                );

                this.availableProfils.push(availableProfilsForIndex);
            }
        } else {
            console.error('profilReferentiels is not a FormArray');
        }
    }

    getProfilReferentiels(): FormArray {
        return this.besoinForm.get('referentiel.profilReferentiels') as FormArray;
    }
    addProfilReferentiel(): void {
        const profilReferentiels = this.getProfilReferentiels();

        if (profilReferentiels instanceof FormArray) {
            profilReferentiels.push(this.createDefaultProfilReferentiel());
            this.updateAvailableProfils();
        } else {
            console.error('profilReferentiels is not a FormArray');
        }
    }



    createDefaultProfilReferentiel(): FormGroup {
        return this.fb.group({
            profil: ['', Validators.required],   // Assurez-vous que ce contrôle est bien initialisé
            niveau: ['', Validators.required]    // De même pour 'niveau'
        });
    }


    removeProfilReferentiel(index: number): void {
        const profilReferentiels = this.getProfilReferentiels();

        if (profilReferentiels.length > 1) {
            profilReferentiels.removeAt(index);
            this.updateAvailableProfils();
        }
    }

    // Les événements onChange peuvent être utilisés pour mettre à jour les valeurs dynamiquement
    onSegmentChange(event: any): void {
        const selectedSegments = event.value;
        this.loadOptionsForSegments(selectedSegments);
    }

    // Fonction qui charge automatiquement les sous-segments et les technologies
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
        const selectedTechnologies = this.besoinForm.get('referentiel.technologie')?.value || [];

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

    filterTechno(): void {
        const selectedTechnologies = this.besoinForm.get('referentiel.technologie')?.value || [];

        this.filteredTechnologies = this.technologiesOptions.filter(option =>
            selectedTechnologies.includes(option.value)
        );

        console.warn("Filtered Technologies:", this.filteredTechnologies);
        this.updateAvailableTechnologies();
    }
    updateAvailableTechnologies(): void {
        // Récupérer les technologies sélectionnées dans le FormArray
        const besoinsTechnologiesArray = this.besoinForm.get('besoinsTechnologies') as FormArray;

        if (!besoinsTechnologiesArray) {
            console.error('Le FormArray besoinsTechnologies est introuvable.');
            return;
        }

        const selectedTechnologies = besoinsTechnologiesArray.controls
            .map(control => control.get('technologie')?.value)
            .filter(techno => techno !== undefined && techno !== null);

        console.log('Technologies sélectionnées:', selectedTechnologies);

        // Générer les technologies disponibles pour chaque élément du FormArray
        this.availableTechnologies = besoinsTechnologiesArray.controls.map((control, index) =>
            this.filteredTechnologies.filter(techno => {
                // Vérifier si la technologie est sélectionnée ailleurs
                const currentTechnology = control.get('technologie')?.value;
                const isSelectedElsewhere = selectedTechnologies.some(
                    selected => selected === techno.value && selected !== currentTechnology
                );

                console.log(`Tech ${techno.value}, Sélectionnée ailleurs: ${isSelectedElsewhere}`);

                // Inclure la technologie si elle n'est pas sélectionnée ailleurs ou si elle est la technologie actuelle
                return !isSelectedElsewhere || techno.value === currentTechnology;
            })
        );

        console.log('Technologies disponibles:', this.availableTechnologies);
    }


    removeBesoinTechnologie(index: number): void {
        const besoinsTechnologiesArray = (this.besoinForm.get('besoinsTechnologies') as FormArray);
        besoinsTechnologiesArray.removeAt(index); // Supprimer l'élément à l'index spécifié
        this.updateAvailableTechnologies(); // Mettre à jour les technologies disponibles
    }
    onTechnologieChange(index: number) {
        console.warn('Technologies filtrées:', this.filteredTechnologies);

        this.updateAvailableTechnologies();
    }


    get besoinsTechnologies(): FormArray {
        return this.besoinForm.get('besoinsTechnologies') as FormArray;
    }

    getBesoinsTechnologiesControl(index: number, controlName: string): FormControl {
        return (this.besoinForm.get('besoinsTechnologies') as FormArray).at(index).get(controlName) as FormControl;
    }

    addBesoinTechnologie() {
        (this.besoinForm.get('besoinsTechnologies') as FormArray).push(this.createDefaultBesoinsTechnologies());
        this.updateAvailableTechnologies();
    }

    createDefaultBesoinsTechnologies(): FormGroup {
        return this.fb.group({
            technologie: ['', Validators.required],
            niveau: ['', Validators.required],
            importance: ['', Validators.required],
            anneesExperience: [null, Validators.required], // Si vous attendez un nombre
            besoin: [undefined] // Par défaut, vous pouvez laisser undefined ou un autre initial
        });
    }

}
