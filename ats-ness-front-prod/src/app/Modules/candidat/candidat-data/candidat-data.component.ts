import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {ChartModule} from "primeng/chart";
import {DatePipe, NgIf} from "@angular/common";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {MultiSelectModule} from "primeng/multiselect";
import {NgxStarsModule} from "ngx-stars";
import {PaginatorModule} from "primeng/paginator";
import {RippleModule} from "primeng/ripple";
import {MessageService, SharedModule} from "primeng/api";
import {SliderModule} from "primeng/slider";
import {TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {Router, RouterLink} from "@angular/router";
import {FileUpload} from "primeng/fileupload";
import {EncryptionServiceService} from "../../../demo/service/encryption-service.service";
import {CandidatService} from "../../../demo/service/candidat.service";
import {CvUploadComponent} from "../cv-upload/cv-upload.component";
interface UploadedFile {
    name: string;
    size: number;
    status: 'pending' | 'uploading' | 'complete' | 'error';
}
@Component({
  selector: 'app-candidat-data',
  standalone: true,
    imports: [
        ButtonModule,
        CalendarModule,
        ChartModule,
        DatePipe,
        DialogModule,
        DropdownModule,
        InputTextModule,
        MultiSelectModule,
        NgIf,
        NgxStarsModule,
        PaginatorModule,
        RippleModule,
        SharedModule,
        SliderModule,
        TableModule,
        ToastModule,
        CvUploadComponent,
        RouterLink
    ],
  templateUrl: './candidat-data.component.html',
  styleUrl: './candidat-data.component.scss'
})
export class CandidatDataComponent implements OnInit{
    page = 0;
    size = 2;
    displayProfileDialog: boolean = false;
    selectedCandidate: any = null;

    globalFilterValue: string = '';

    dateRange: Date[] = [];
    startDate: any
    endDate: any


    lastUpdate: Date;
    responsable: string = '';
    fullName: string;
    tjmMin: number;
    tjmSouhaite: number;
    title: string;
    selectedState: string;
    statut: any;
    selectedStatusCandidat: string;


    states: { label: string, value: string }[];
    statuses: { label: string, value: string }[];
    statuscandidat: { label: string, value: string }[];

    candidates: any[] = []; // Contiendra les candidats réels
    candidates1: any[] = []; // Initialisation correcte

    pieData: any;
    pieOptions: any;
    lineData: any;
    lineOptions: any;
    loading: boolean = true;
    myRating: { [key: number]: number } = {};

    totalElements = 0;
    isLoading = false;

    tjmRange: number[] = [0, 1000];
    rangeValues: number[] = [0, 1000];
    technologyTypes: { label: string, value: string }[] = [
        { label: 'Frontend', value: 'webFrontTechnologies' },
        { label: 'Backend', value: 'webBackTechnologies' },
        { label: 'API', value: 'apiTechnologies' },
        { label: 'DevOps', value: 'devOpsTechnologies' },
        { label: 'Mobile', value: 'mobileTechnologies' },
        { label: 'BLOCKCHAIN', value: 'blockchainTechnilogies' },
        { label: 'IA', value: 'iaTechnologies' },
        { label: 'IOT', value: 'iotTechnologies' },
        { label: 'LOW CODE / NO CODE', value: 'lowCodeNoCodeTechnologies' },

        // Add more technology types as needed
    ];
    specificTechnologies: { label: string, value: string }[] = [];
    selectedTechType: string;
    selectedSpecificTech: string[] = [];


    constructor(private route:Router,
                private candidatService: CandidatService,
                private messageService: MessageService,
                private encryptionService:EncryptionServiceService,
                private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.lastUpdate = null;
        this.fullName = '';
        this.responsable = '';
        this.title = '';
        this.selectedState = '';
        this.selectedStatusCandidat = '';
        this.getAllCandidats(); // Charger les candidats réels
        this.states = [
            { label: 'A Traiter', value: 'A Traiter' },
            { label: 'En cours de qualification', value: 'En cours de qualification' },
            { label: 'Vivier', value: 'Vivier' },
            { label: 'Top Vivier', value: 'Top Vivier' },
            { label: 'Validé', value: 'Validé' },
            { label: 'Ressource', value: 'Ressource' },
            { label: 'Sortie Prochaine', value: 'Sortie Prochaine' },
            { label: 'Sorti', value: 'Sorti' },

        ];
        this.statuscandidat = [
            { label: 'Indépendant', value: 'Indépendant' },
            { label: 'Salarié', value: 'Salarié' },
            { label: 'Portage', value: 'Portage' },
            { label: 'Partenaire', value: 'Partenaire' },
            { label: 'Ressource', value: 'Ressource' },
            { label: 'Ouvert au CDI', value: 'Ouvert au CDI' },
        ];
        this.initPieChart(); // Initialiser le graphique
        this.initializeTechnologyData();

    }

    initializeTechnologyData() {
        // This method would typically fetch technology data from a service
        // For now, we'll use hardcoded data
        this.technologyTypes = [
            { label: 'Frontend', value: 'frontend' },
            { label: 'Backend', value: 'backend' },
            { label: 'API', value: 'API' },
            { label: 'DevOps', value: 'DevOps' },
            { label: 'Mobile', value: 'Mobile' },
            { label: 'BLOCKCHAIN', value: 'BLOCKCHAIN' },
            { label: 'IA', value: 'IA' },
            { label: 'IOT', value: 'IOT' },
            { label: 'LOW CODE / NO CODE', value: 'LOW CODE / NO CODE' },
        ];
    }

    onTechTypeChange() {
        this.selectedSpecificTech = null;
    }

    onSpecificTechChange() {
        // This method can be used to trigger additional actions when a specific technology is selected
        this.filteredCandidates();
    }

    onTjmRangeChange() {
        this.filteredCandidates();
    }


    getAllCandidats(): void {
        this.candidatService.getAllCandidats(this.page, this.size).subscribe({
            next: (response) => {
                console.warn(response);
                this.totalElements = response.totalElements; // Mettre à jour le total
                this.isLoading = false;

                // Ajouter les nouveaux candidats récupérés
                const newCandidates = response.content.map(c => ({
                    id: c.id,
                    fullName: c.prenom + ' ' + c.nom,
                    titre: c.titre || 'N/A',
                    state: this.mapState(c.etat) || 'N/A',
                    statuscandidat: this.mapStatuscandidat(c.statusCandidat) || 'N/A',
                    lastUpdate: new Date(c.dateDerniereMiseAJour),
                    webFrontTechnologies: c.webFrontTechnologies || [],
                    webBackTechnologies: c.webBackTechnologies || [],
                    apiTechnologies: c.apiTechnologies || [],
                    mobileTechnologies: c.mobileTechnologies || [],
                    devOpsTechnologies: c.devOpsTechnologies || [],
                    blockchainTechnilogies: c.blockchainTechnilogies || [],
                    iotTechnologies: c.iotTechnologies || [],
                    lowCodeNoCodeTechnologies: c.lowCodeNoCodeTechnologies || [],
                    iaTechnologies: c.iaTechnologies || [],
                    cvurl: c.cvurl,
                    email: c.email,
                    telephone: c.telephone,
                    tjmmin: c.tjmMin || 0,
                    TJM: c.TJM || 0,
                    tjmsouhaite: c.tjmSouhaite || 0,
                    picture: c.pictureUrl,
                    responsable: c.responsable,
                }));

                this.candidates1 = [...this.candidates1, ...response.content]; // Concaténer les candidats
                this.candidates = [...this.candidates, ...newCandidates]; // Mettre à jour la liste des candidats

                // Charger les notes des candidats
                for (let candidat of response.content) {
                    this.candidatService.getAverageRatingByCandidat(candidat.id).subscribe({
                        next: (data) => {
                            this.myRating[candidat.id] = data || 0; // Si pas de rating, utiliser 0 par défaut
                        },
                        error: (err) => {
                            this.myRating[candidat.id] = 0; // En cas d'erreur, assigner 0
                            console.error(`Erreur lors du chargement de la note pour le candidat ${candidat.id}:`, err);
                        }
                    });
                }

                // Pagination automatique
                if (
                    this.candidates1.length < this.totalElements // Tous les candidats ne sont pas encore chargés
                ) {
                    this.loadMore(); // Charger automatiquement la page suivante
                }

                this.loading = false;
                this.initPieChart(); // Mettre à jour le graphique avec les nouvelles données
            },
            error: (err) => {
                this.loading = false;
                console.error('Erreur lors du chargement des candidats :', err);
            }
        });
    }

// Charger la page suivante
    loadMore(): void {
        this.page++;
        this.getAllCandidats();
    }

    // Fonction pour mapper le statut (enabled = active/inactive)
    mapStatus(enabled: boolean): string {
        return enabled ? 'active' : 'inactive';
    }

    // Fonction pour mapper l'état
    mapState(etat: string): string {
        const stateMapping = {
            'A Traiter': 'A Traiter',
            'En cours de qualification': 'En cours de qualification',
            'Vivier': 'Vivier',
            'Top Vivier': 'Top Vivier',
            'Validé': 'Validé',
            'Ressource': 'Ressource',
            'Sortie Prochaine': 'Sortie Prochaine',
            'Sorti': 'Sorti'
        };
        return stateMapping[etat] || 'unknown';
    }

    mapStatuscandidat(statuscandidat: string): string {
        const statusMapping = {
            'Independant': 'Indépendant',
            'Salarie': 'Salarié',
            'Portage': 'Portage',
            'Partenaire': 'Partenaire',
            'ouvertauCDI': 'ouvert au CDI'
        };
        return statusMapping[statuscandidat] || 'null';
    }

    initPieChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        const stateCounts = this.countStates();

        this.pieData = {
            labels: Object.keys(stateCounts),
            datasets: [
                {
                    data: Object.values(stateCounts),
                    backgroundColor: [
                        documentStyle.getPropertyValue('--indigo-500'),
                        documentStyle.getPropertyValue('--purple-500'),
                        documentStyle.getPropertyValue('--teal-500'),
                        documentStyle.getPropertyValue('--red-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--black-500'),
                        documentStyle.getPropertyValue('--orange-500'),

                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--indigo-400'),
                        documentStyle.getPropertyValue('--purple-400'),
                        documentStyle.getPropertyValue('--teal-400'),
                        documentStyle.getPropertyValue('--red-400'),
                        documentStyle.getPropertyValue('--yellow-400'),
                        documentStyle.getPropertyValue('--green-400'),
                        documentStyle.getPropertyValue('--black-400'),
                        documentStyle.getPropertyValue('--orange-400'),
                    ]
                }
            ]
        };

        this.pieOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };
    }

    countStates() {
        const stateCounts = {
            "Validé": 0,
            "Ressource": 0,
            "Sorti": 0,
            "A Traiter": 0,
            "En cours de qualification": 0,
            "Vivier": 0,
            "Top Vivier": 0,
            "Sortie Prochaine": 0,
        };

        this.candidates1?.forEach(candidate => {
            if (stateCounts[candidate.etat] !== undefined) {
                stateCounts[candidate.etat]++;
            }
        });

        return stateCounts;
    }

    onGlobalFilter(event: Event): void {
        this.globalFilterValue = (event.target as HTMLInputElement).value.toLowerCase();
        this.filterCandidates();
    }

    filterCandidates(): void {
        if (this.globalFilterValue) {
            this.candidates = this.candidates1.filter(candidate =>
                this.matchesFilter(candidate.fullName, this.globalFilterValue) ||
                this.matchesFilter(candidate.titre, this.globalFilterValue) ||
                this.matchesFilter(candidate.lastUpdate.toLocaleDateString(), this.globalFilterValue)
            );
        } else {
            this.candidates = [...this.candidates1];
        }
    }

    matchesFilter(value: string, filter: string): boolean {
        return value.toLowerCase().includes(filter);
    }

    // Filtrer les candidats selon les champs de recherche
    filteredCandidates() {
        return this.candidates.filter(candidate => {
            const candidateLastUpdate = new Date(candidate.lastUpdate);
            this.startDate = this.dateRange[0];
            this.endDate = this.dateRange.length === 2 ? this.dateRange[1] : this.dateRange[0];

            // Existing basic filters (full name, title, state, status, date range, responsable)
            const basicFiltersPassed = (
                (!this.fullName || candidate.fullName.toLowerCase().includes(this.fullName.toLowerCase())) &&
                (!this.title || candidate.titre.toLowerCase().includes(this.title.toLowerCase())) &&
                (!this.selectedState || candidate.state.toLowerCase() === this.selectedState.toLowerCase()) &&
                (!this.selectedStatusCandidat || candidate.statuscandidat.toLowerCase() === this.selectedStatusCandidat.toLowerCase()) &&
                (!this.responsable || (candidate.responsable && candidate.responsable.toLowerCase().includes(this.responsable.toLowerCase()))) &&
                (
                    (!this.startDate) ||
                    (this.startDate && this.endDate && candidateLastUpdate.toDateString() === this.startDate.toDateString()) ||
                    (this.startDate && this.endDate && candidateLastUpdate >= this.startDate && candidateLastUpdate <= this.endDate)
                )
            );

            const globalFilterPassed = !this.globalFilterValue ||
                this.matchesFilter(candidate.fullName, this.globalFilterValue) ||
                this.matchesFilter(candidate.titre, this.globalFilterValue) ||
                this.matchesFilter(candidate.lastUpdate.toLocaleDateString(), this.globalFilterValue);

            let techFilterPassed = true;
            if (this.selectedSpecificTech && this.selectedSpecificTech.length) {
                switch (this.selectedTechType) {
                    case 'frontend':
                        techFilterPassed = this.selectedSpecificTech.some(tech =>
                            (candidate.webFrontTechnologies || []).includes(tech));
                        break;
                    case 'backend':
                        techFilterPassed = this.selectedSpecificTech.some(tech =>
                            (candidate.webBackTechnologies || []).includes(tech));
                        break;
                    case 'API':
                        techFilterPassed = this.selectedSpecificTech.some(tech =>
                            (candidate.apiTechnologies || []).includes(tech));
                        break;
                    case 'DevOps':
                        techFilterPassed = this.selectedSpecificTech.some(tech =>
                            (candidate.devOpsTechnologies || []).includes(tech));
                        break;
                    case 'Mobile':
                        techFilterPassed = this.selectedSpecificTech.some(tech =>
                            (candidate.mobileTechnologies || []).includes(tech));
                        break;
                    case 'BLOCKCHAIN':
                        techFilterPassed = this.selectedSpecificTech.some(tech =>
                            (candidate.blockchainTechnilogies || []).includes(tech));
                        break;
                    case 'IA':
                        techFilterPassed = this.selectedSpecificTech.some(tech =>
                            (candidate.iaTechnologies || []).includes(tech));
                        break;
                    case 'IOT':
                        techFilterPassed = this.selectedSpecificTech.some(tech =>
                            (candidate.iotTechnologies || []).includes(tech));
                        break;
                    case 'LOW CODE / NO CODE':
                        techFilterPassed = this.selectedSpecificTech.some(tech =>
                            (candidate.lowCodeNoCodeTechnologies || []).includes(tech));
                        break;
                    default:
                        techFilterPassed = true;
                }
            }

            // TJM Range Filter (checks if candidate's tjmmin and tjmsouhaite are within the selected TJM range)
            const tjmFilterPassed = (
                candidate.tjmmin >= this.rangeValues[0] && candidate.tjmsouhaite <= this.rangeValues[1]
            );

            // Combine all filters (basic filters + TJM range filter)
            return basicFiltersPassed && tjmFilterPassed && techFilterPassed && globalFilterPassed;
        });
    }





    updateEtat(id: number, etat: string) {
        const formattedState = etat === "En cours de qualification"
            ? "EnCoursDeQualification"
            : etat.replace(/\s+/g, '');

        if (etat === "A Traiter") {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: "Attention : Vous ne pouvez pas revenir à l'état 'A traiter'!"
            });
        }

        if (etat !== "A Traiter") {
            this.candidatService.updateEtat(id, formattedState).subscribe({
                next: (response: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: "L'état du candidat est mis à jour: " + etat + " !"
                    });
                    this.getAllCandidats();
                    this.initPieChart();
                },
                error: (error: any) => {
                    console.error('Error:', error);
                }
            });
        }
    }


    getCandidatById(id: number) {
        this.candidatService.getCandidatById(id).subscribe(response => {
            console.warn("updated candidat:", response)
        }, error => {
            console.error('Error:', error);
        });
    }


    // Function to show profile dialog
    showProfile(candidate: any): void {
        this.selectedCandidate = candidate;
        this.displayProfileDialog = true;
    }

    onDateRangeChange() {
        if (this.dateRange.length > 0) {
            this.endDate = this.dateRange[1] || this.startDate;
            console.log('Start Date:', this.startDate);
            console.log('End Date:', this.endDate);
        }
        else {
            this.endDate = this.dateRange[0];
        }
    }
    ///////////////////////RATING STARTS HERE/////////////////////
    addRating(rateValue: number, id: number) {
        // Normaliser la valeur à 0.5 près
        const normalizedRating = Math.round(rateValue * 2) / 2;
        // Utiliser la valeur normalisée
        this.candidatService.addRating(normalizedRating, id).subscribe({
            next: (response: any) => {
                // Mettre à jour le state local
                this.myRating[id] = normalizedRating;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: "Candidat évalué avec succès !"
                });
            },
            error: (error: any) => {
                console.error('Error:', error);
            },
        });
    }



    ///////////////////////////RATING ENDS HERE/////////////////////////////////////////


    redirectUpdate(id: number) {
        if (id) {
            const encryptedId = this.encryptionService.encryptId(id);
            this.route.navigate(['/back-office/candidat/edit', encryptedId]);

        } else {
            console.error('Invalid ID received');
        }
    }


    @ViewChild('fileUpload') fileUpload!: FileUpload;

    displayUploadDialog: boolean = false;
    isDragging: boolean = false;
    uploadedFiles: UploadedFile[] = [];

    showUploadDialog() {
        this.displayUploadDialog = true;
    }

    hideUploadDialog() {
        this.displayUploadDialog = false;
        this.uploadedFiles = [];
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = true;
    }

    onDragLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = false;
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = false;

        const files = event.dataTransfer?.files;
        if (files) {
            Array.from(files).forEach(file => {
                this.addFile(file);
            });
        }
    }

    onUpload(event: any) {
        const files = event.files;
        files.forEach((file: File) => {
            this.addFile(file);
        });
        this.fileUpload.clear();
    }

    addFile(file: File) {
        const uploadedFile: UploadedFile = {
            name: file.name,
            size: file.size,
            status: 'pending'
        };
        this.uploadedFiles.push(uploadedFile);
    }

    removeFile(file: UploadedFile) {
        const index = this.uploadedFiles.indexOf(file);
        if (index !== -1) {
            this.uploadedFiles.splice(index, 1);
        }
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    hasFilesToUpload(): boolean {
        return this.uploadedFiles.some(file => file.status === 'pending');
    }

    uploadAll() {
        // Simulate file upload
        this.uploadedFiles.forEach(file => {
            if (file.status === 'pending') {
                file.status = 'uploading';
                // Simulate upload delay
                setTimeout(() => {
                    file.status = 'complete';
                }, 1500);
            }
        });
    }







}
