import { Component } from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {FileUploadModule} from "primeng/fileupload";
import {NgIf, NgStyle} from "@angular/common";
import {ToastModule} from "primeng/toast";
import {CandidatService} from "../../../demo/service/candidat.service";
import {MessageService} from "primeng/api";
import {EncryptionServiceService} from "../../../demo/service/encryption-service.service";
import {HttpClient, HttpEvent, HttpEventType} from "@angular/common/http";
import {Router} from "@angular/router";
import {profils, segments, sousSegmentsMap, technologiesMap} from "../../../../../ReferentielDefinition";

@Component({
  selector: 'app-cv-upload',
  standalone: true,
    imports: [
        ButtonModule,
        DialogModule,
        FileUploadModule,
        NgIf,
        ToastModule,
        NgStyle
    ],
  templateUrl: './cv-upload.component.html',
  styleUrl: './cv-upload.component.scss'
})
export class CvUploadComponent {

    uploadedFiles: any[] = [];
    isUploading = { imgFile: false, cvFile: false, cvNessFile:false };
    isFileSelected = { imgFile: false, cvFile: false, cvNessFile:false };
    loadingPercentage: number = 0;
    loading: boolean = false;
    profils = profils;
    segments = segments;
    sousSegmentsMap = sousSegmentsMap;
    technologiesMap = technologiesMap;
    showError: boolean = false;
    uploadDialogVisible: boolean = false; // New state variable for dialog visibility


    formData = {
        id: null,
        formations: [
            {
                titre: '',
                etablissement: '',
                commentaire: '',
                pays: '',
                anneeObtention: '',
            }
        ], // Initialisé en tant qu'array d'objets Formations
        langues: [
            {
                name: '',
                lev: '',
                commentaire: '',
            }
        ], // Initialisé en tant qu'array d'objets Langues
        certifications: [
            {
                titreCertif: '',
                etablissementCertif: '',
                commentaireCertif: '',
                paysCertif: '',
                anneeObtentionCertif: '',
            }
        ], // Initialisé en tant qu'array d'objets Certifications
        experiences: [
            {
                titre: '',
                dateDeb: '',
                dateFin:'',
                client: '',
                description: '',
            }
        ],
        referentiels: [
            {
                id: null,
                segments: [],
                sousSegments: [],
                profil: [],
                technologie: [],
                candidat: null // Lien avec Candidat
            }
        ],
        statistiquesProfil: {
            id: null, // Correspond à l'identifiant du profil
            candidat: null, // Représente l'objet candidat lié au profil
            segments: [], // Doit être un tableau de segments
            sousSegments: [], // Doit être un tableau de sous-segments
            technologie: [], // Doit être un tableau de technologies
        },
        dossierCompetences: false,
        dateMissions: false,
        formatWord: false,
        habilitable: false,
        jesaispas:false,
        infosAClarifier: '',
        comments: '',
        nom: '',
        prenom: '',
        email: '',
        password: '',
        titre: '',
        tjm:     null ,
        referencesClients: [],
        preavis: '',
        souhaitsCandidat: '',
        dureeGarePrincipale: 0,
        commentaireGeneralite: '',
        departementTrajet: '',
        dureeTrajet: 0,
        justLogged: null,
        tjmMin: null, // Range for tjmMin
        tjmSouhaite: null, // Range for tjmSouhaite
        salaireMin: null, // Range for salaireMin
        salaireSouhaite: null, // Range for salaireSouhaite
        telephone: null,
        adresse: '',
        ville: '',
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
        isAmbassadeur: false,
        ecouteDuMarche: false,
        cvAJour: false,
        Jobboard: [], // Array for Jobboard
        level: [], // Assuming this is an array of levels
        salaire: 0
    };


    constructor(
        private candidatService: CandidatService,
        private messageService: MessageService,
        private encryptionService:EncryptionServiceService,
        private http: HttpClient ,
        private router:Router,
    ){}

    // Method to show the dialog
    showUploadDialog(): void {
        this.uploadDialogVisible = true;
    }


    onFileSelect(event: any, type: 'cvFile' | 'cvNessFile'): void {
        this.isFileSelected[type] = true;
        if (event && event.files && event.files.length > 0) {
            const selectedFile = event.files[0];
            if (type === 'cvFile') {
                this.uploadedFiles = [selectedFile];
            }
            else if (type === 'cvNessFile') {
                this.uploadedFiles = [selectedFile];
            }
        }
    }

    onFileUpload(event: any, type:'cvFile' | 'cvNessFile'): void {
        this.isUploading[type] = true;

        // Vérification et traitement pour le CV
        if (type === 'cvFile') {
            // Vérifie si les fichiers existent et si c'est un PDF
            const file = event.files[0];
            if (file && file.type === 'application/pdf') {
                console.log('Uploading CV:', file);

                // Crée FormData et envoie le fichier au backend
                const formData = new FormData();
                formData.append('file', file);
                this.uploadCV(formData);  // Appelle la méthode pour télécharger et analyser le CV
            } else {
                // Affiche un message d'erreur si ce n'est pas un PDF valide
                this.messageService.add({ severity: 'warn', summary: 'Invalid File', detail: 'Please upload a valid PDF file.' });
                this.isUploading[type] = false;
                return;
            }
        }

        // Vérification et traitement pour le CV NESS
        if (type === 'cvNessFile' && this.uploadedFiles && this.uploadedFiles.length > 0) {
            console.log('Uploading CV NESS:', this.uploadedFiles[0]);
        }

        // Ajout des fichiers uploadés à la liste (pour tous les types)
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });

        // Simuler la fin de l'upload après 2 secondes
        setTimeout(() => {
            this.isUploading[type] = false;
            this.isFileSelected[type] = false; // Réinitialisation après l'upload
            // Mettre à jour la validité du formulaire
        }, 2000);
    }


    uploadCV(formData: FormData) {
        const apiUrl = '/api/v3/parse-cv';
        this.loading = true;
        this.loadingPercentage = 0;

        this.http.post(apiUrl, formData, {
            reportProgress: true,
            observe: 'events'
        }).subscribe({
            next: (event: HttpEvent<any>) => {
                if (event.type === HttpEventType.UploadProgress) {
                    if (event.total) {
                        // Calculer la progression du chargement en pourcentage
                        const currentProgress = Math.round((100 * event.loaded) / event.total);

                        // Simuler une progression allant jusqu'à 90% max pendant l'upload
                        if (currentProgress <= 90) {
                            this.loadingPercentage = currentProgress;
                        }
                    }
                } else if (event.type === HttpEventType.Response) {
                    // Une fois que la réponse est reçue, terminer à 100%
                    this.loadingPercentage = 100;
                    this.loading = false;
                    this.populateFormFromCV(event.body);  // Appelle la méthode pour remplir le formulaire
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'CV uploaded successfully.' });
                }
            },
            error: (error: any) => {
                this.loading = false;
                console.error('Error uploading CV:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'CV upload failed.' });
            }
        });

        // Simuler une progression continue jusqu'à la réponse
        const progressInterval = setInterval(() => {
            if (this.loadingPercentage < 99) {
                this.loadingPercentage += 1; // Augmenter progressivement jusqu'à 90%
            } else {
                clearInterval(progressInterval); // Arrêter la progression lorsque le maximum est atteint
            }
        }, 200); // Augmenter de 1% toutes les 100ms
    }

    populateFormFromCV(data: any): void {
        // Étape 1: Information Générale
        this.formData.nom = data.utilisateur?.nom || '';
        this.formData.prenom = data.utilisateur?.prenom || '';
        this.formData.email = data.utilisateur?.email || '';
        this.formData.titre = data.titre || '';
        this.formData.telephone = data.telephone || '';
        this.formData.adresse = data.adresse || '';

        // Initialiser les référentiels
        this.formData.referentiels = [{
            id: null,
            segments: [],
            sousSegments: [],
            technologie: [],
            profil: [],
            candidat: null
        }];

        // Étape 2: Ajouter toutes les technologies dans un seul référentiel
        if (Array.isArray(data.technologies)) {
            const existingReferentiel = this.formData.referentiels[0];
            existingReferentiel.technologie = data.technologies.map((tech: any) => tech.name);
            existingReferentiel.segments = [...new Set(data.technologies.map((tech: any) => tech.segment))];
            existingReferentiel.sousSegments = [...new Set(data.technologies.map((tech: any) => tech.sousSegment))];
        }

        // Mapper les langues
        this.formData.langues = Array.isArray(data.langues) ? data.langues.map((lang: any) => ({
            name: lang.name,
            level: lang.level
        })) : [];

        // Mapper les formations
        this.formData.formations = Array.isArray(data.formations) ? data.formations.map((form: any) => ({
            titre: form.titre,
            etablissement: form.etablissement,
            commentaire: form.commentaire,
            pays: form.pays,
            anneeObtention: form.anneeObtention,
        })) : [];

        // Mapper les certifications
        this.formData.certifications = Array.isArray(data.certifications) ? data.certifications.map((cert: any) => ({
            titreCertif: cert.titre,
            etablissementCertif: cert.etablissement,
            paysCertif: cert.pays,
            anneeObtentionCertif: cert.dateObtention?.match(/^\d{4}/)?.[0] || '',
        })) : [];

        // Mapper les expériences
        this.formData.experiences = Array.isArray(data.experiences) ? data.experiences.map((exp: any) => ({
            titre: exp.titre,
            description: exp.description,
            client: exp.client,
            dateFin: exp.dateFin,
            dateDeb: exp.dateDebut,
        })) : [];

        // Initialisation des statistiques du profil
        const statistiquesProfil = {
            id: null,
            candidat: null,
            segments: [],       // Changé en tableau vide pour correspondre à la structure backend
            sousSegments: [],   // Changé en tableau vide pour correspondre à la structure backend
            technologie: [],    // Changé en tableau vide pour correspondre à la structure backend
        };

        if (Array.isArray(data.technologies)) {
            const totalOccurrences = data.technologies.reduce((sum, tech) => sum + (tech.occurrence || 0), 0);

            // Utilisation de Maps pour le comptage
            const segmentCounts = new Map<string, number>();
            const sousSegmentCounts = new Map<string, number>();
            const technologieCounts = new Map<string, number>();

            data.technologies.forEach((tech) => {
                // Vérifiez la structure de chaque technologie
                console.log("Analyse technologie :", tech);

                if (tech.segment) {
                    segmentCounts.set(tech.segment, (segmentCounts.get(tech.segment) || 0) + tech.occurrence);
                }

                if (tech.sousSegment) {
                    sousSegmentCounts.set(tech.sousSegment, (sousSegmentCounts.get(tech.sousSegment) || 0) + tech.occurrence);
                }

                if (tech.name) {
                    technologieCounts.set(tech.name, (technologieCounts.get(tech.name) || 0) + tech.occurrence);
                }
            });

            // Mettez à jour les statistiques
            statistiquesProfil.segments = Array.from(segmentCounts.entries()).map(([key, value]) => ({
                segmentKey: key,
                segmentValue: ((value / totalOccurrences) * 100).toFixed(2) + "%",
            }));

            statistiquesProfil.sousSegments = Array.from(sousSegmentCounts.entries()).map(([key, value]) => ({
                sousSegmentKey: key,
                sousSegmentValue: ((value / totalOccurrences) * 100).toFixed(2) + "%",
            }));

            statistiquesProfil.technologie = Array.from(technologieCounts.entries()).map(([key, value]) => ({
                technoKey: key,
                technoValue: ((value / totalOccurrences) * 100).toFixed(2) + "%",
            }));
        }

        console.warn("Statistiques générées:", statistiquesProfil);

// Mise à jour des données du formulaire
        this.formData.statistiquesProfil = statistiquesProfil;
        console.warn("FormData après mise à jour:", this.formData);


        // Notification de succès
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'CV data imported successfully.' });

        // Envoi des données si nécessaire
        this.onSubmit();
    }

    // Fonction pour ajouter un tableau à FormData
    appendArrayToFormData(array: any[], prefix: string, formData: FormData): void {
        array.forEach((item, index) => {
            Object.keys(item).forEach(subKey => {
                const value = item[subKey];
                formData.append(`${prefix}[${index}].${subKey}`, value !== null && value !== undefined ? String(value) : '');
            });
        });
    }

// Fonction pour ajouter un objet imbriqué à FormData
    appendNestedObjectToFormData(object: any, prefix: string, formData: FormData): void {
        Object.entries(object).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                // Si une propriété est un tableau, l'ajouter correctement
                this.appendArrayToFormData(value, `${prefix}.${key}`, formData);
            } else if (typeof value === 'object' && value !== null) {
                // Si une propriété est un objet imbriqué, récursion
                this.appendNestedObjectToFormData(value, `${prefix}.${key}`, formData);
            } else {
                // Ajouter les valeurs primitives
                formData.append(`${prefix}.${key}`, value !== null && value !== undefined ? String(value) : '');
            }
        });
    }

// Méthode onSubmit
    onSubmit(): void {
        const formData = new FormData();
        // Ajouter les statistiques au formulaire
        // this.appendArrayToFormData(this.formData.statistiquesProfil.segments, 'statistiquesProfil.segments', formData);
        // this.appendArrayToFormData(this.formData.statistiquesProfil.sousSegments, 'statistiquesProfil.sousSegments', formData);
        // this.appendArrayToFormData(this.formData.statistiquesProfil.technologie, 'statistiquesProfil.technologie', formData);

        // Ajouter les données du formulaire
        Object.keys(this.formData).forEach(key => {
            if (key === 'statistiquesProfil') {
                const statProfil = this.formData[key];

                // Ajouter les segments
                if (Array.isArray(statProfil.segments)) {
                    this.appendArrayToFormData(statProfil.segments, 'statistiquesProfil.segments', formData);
                }

                // Ajouter les sous-segments
                if (Array.isArray(statProfil.sousSegments)) {
                    this.appendArrayToFormData(statProfil.sousSegments, 'statistiquesProfil.sousSegments', formData);
                }

                // Ajouter les technologies
                if (Array.isArray(statProfil.technologie)) {
                    this.appendArrayToFormData(statProfil.technologie, 'statistiquesProfil.technologie', formData);
                }
            } else if (Array.isArray(this.formData[key])) {
                // Ajouter un tableau normal
                this.appendArrayToFormData(this.formData[key], key, formData);
            } else {
                // Ajouter une valeur primitive
                const value = this.formData[key];
                if (value !== null && value !== undefined) {
                    formData.append(key, typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value));
                }
            }
        });

        // Ajouter les fichiers téléchargés
        if (this.uploadedFiles && this.uploadedFiles.length > 0) {
            formData.append('cvFile', this.uploadedFiles[0]);
        }

        // Log pour vérifier le contenu
        console.warn('Final FormData content:');
        formData.forEach((value, key) => {
            console.log(key, ':', value);
        });

        // Appeler le service pour soumettre les données
        this.candidatService.createCandidat(formData).subscribe({
            next: (response: any) => {
                console.log("Response:", response);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Candidat Created' });

                // Gestion de l'ID retourné
                const id = response.id;
                if (id) {
                    const encryptedId = this.encryptionService.encryptId(id.toString());
                    setTimeout(() => {
                        this.redirectUpdate(encryptedId);
                    }, 500);
                } else {
                    console.error('Invalid ID received');
                }
            },
            error: (err: any) => {
                console.error("Error:", err);
                this.candidatService.showError(err);
                this.showError = true;
                setTimeout(() => {
                    this.showError = false;
                }, 2000);
            }
        });
    }



    mapSousSegmentFromTechnology(techName: string): { sousSegment: string, label: string } | null {
        if (!techName) {
            console.warn("tttttttttttttttttttttttttttttt",techName)
            return null;
        }
        console.warn("tttttttttttttttttttt",techName)
        const normalizedTechName = techName.trim().toLowerCase(); // Normaliser le nom de la technologie
        for (const key in this.technologiesMap) {
            if (this.technologiesMap.hasOwnProperty(key)) {
                const techs = this.technologiesMap[key];
                const foundTech = techs.find(t => t.value.toLowerCase() === normalizedTechName);
                if (foundTech) {
                    const sousSegment = key;
                    return {sousSegment: sousSegment, label: sousSegment};
                }
            }
        }
        return null;
    }
    getSegmentFromSousSegment(sousSegmentValue: string): string {
        // Normaliser la valeur du sous-segment
        if(!sousSegmentValue){
            return '';
        }
        const normalizedSousSegmentValue = sousSegmentValue?.trim().toLowerCase();

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

    redirectUpdate(id: string) {
        this.router.navigate(['/back-office/candidat/edit', id]);
    }

}
