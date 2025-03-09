import { Component } from '@angular/core';
import {FileUploadModule} from "primeng/fileupload";
import {NgIf, NgStyle} from "@angular/common";
import {ToastModule} from "primeng/toast";
import {MenuItem, MessageService} from "primeng/api";
import {Candidat} from "../../../demo/models/condidat";
import {ActivatedRoute, Router} from "@angular/router";
import {CandidatService} from "../../../demo/service/candidat.service";
import {CountryService} from "../../../demo/service/country.service";
import {LanguageService} from "../../../demo/service/language.service";
import {HttpClient, HttpEvent, HttpEventType} from "@angular/common/http";
import {EncryptionServiceService} from "../../../demo/service/encryption-service.service";
import {Niveau} from "../../../demo/models/enums/Niveau";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-candidat-add',
  standalone: true,
    imports: [
        FileUploadModule,
        NgIf,
        ToastModule,
        NgStyle
    ],
  templateUrl: './candidat-add.component.html',
  styleUrl: './candidat-add.component.scss'
})
export class CandidatAddComponent {
    //
    //
    // loading: boolean = false;  // Variable to control the loader
    // loadingPercentage: number = 0;
    //
    // candidature: Candidat = new Candidat();
    // uploadedFiles: any[] = [];
    // countries: any[] = []; // Array to hold country data
    // filteredCountries: any[] = []; // Array to hold filtered countries
    //
    // stepIndex: number = 0;
    // routeItems: MenuItem[] = [];
    // activeStep: MenuItem | null = null;
    //
    // // Technology options arrays
    // webFrontTechnologiesOptions = [];
    // webBackTechnologiesOptions = [];
    // apiTechnologiesOptions = [];
    // devOpsTechnologiesOptions = [];
    // mobileTechnologiesOptions = [];
    // blockchainTechnologiesOptions = [];
    // iaTechnologiesOptions = [];
    // iotTechnologiesOptions = [];
    // lowCodeNoCodeTechnologiesOptions = [];
    // NiveauOptions!: any;
    // candidatureForm: FormGroup;
    // profilePictureFiles: File[] = [];
    // showError: boolean = false;
    // isUploading = { imgFile: false, cvFile: false };
    // isFileSelected = { imgFile: false, cvFile: false };
    // isFormValid = false;
    //
    //
    // constructor(private http: HttpClient , private messageService: MessageService, private countryService: CountryService, private candidatService: CandidatService, private router: Router,
    // ) {
    // }
    //
    //
    // formData1: any = {
    //     nom: '',
    //     prenom: '',
    //     email: '',
    //     password: '',
    //     titre: '',
    //     tjmMin: '',
    //     tjmSouhaite: '',
    //     salaireMin: '',
    //     salaireSouhaite: '',
    //     telephone: '',
    //     adresse: '',
    //     codePostal: '',
    //     Ville: '',
    //     nationalite: '',
    //     departement: '',
    //     niveau: '',
    //     disponibilite: '',
    //     webFrontTechnologies: [],
    //     webBackTechnologies: [],
    //     apiTechnologies: [],
    //     devOpsTechnologies: [],
    //     mobileTechnologies: [],
    //     blockchainTechnologies: [],
    //     iaTechnologies: [],
    //     iotTechnologies: [],
    //     lowCodeNoCodeTechnologies: []
    // };
    //
    //
    // ngOnInit() {
    //     // Fetch countries from the service
    //     this.countryService.getCountries().then(data => {
    //         this.countries = data.map(country => ({
    //             label: country.name,
    //             value: country.code,
    //             code: country.code // for flag display
    //         }));
    //     });
    //
    //     // Initialize route items
    //     this.routeItems = [
    //         { label: 'Information Générale' },
    //         { label: 'Pièces Jointes' },
    //         { label: 'Détails du Poste' },
    //         { label: 'Coordonnées' },
    //         { label: 'Profil Social' },
    //         { label: 'Technologies Maîtrisées' },
    //         { label: 'Département' },
    //     ];
    //
    //     this.activeStep = this.routeItems[this.stepIndex];
    //
    //     this.webFrontTechnologiesOptions = this.mapEnumToOptions(WebFrontTechnologies);
    //     this.webBackTechnologiesOptions = this.mapEnumToOptions(WebBackTechnologies);
    //     this.apiTechnologiesOptions = this.mapEnumToOptions(APITechnologies);
    //     this.devOpsTechnologiesOptions = this.mapEnumToOptions(DevOpsTechnologies);
    //     this.mobileTechnologiesOptions = this.mapEnumToOptions(MobileTechnologies);
    //     this.blockchainTechnologiesOptions = this.mapEnumToOptions(BlockchainTechnologies);
    //     this.iaTechnologiesOptions = this.mapEnumToOptions(IATechnologies);
    //     this.iotTechnologiesOptions = this.mapEnumToOptions(IoTTechnologies);
    //     this.lowCodeNoCodeTechnologiesOptions = this.mapEnumToOptions(LowCodeNoCodeTechnologies);
    //     this.NiveauOptions = this.mapEnumToOptions(Niveau);
    // }
    //
    // private mapEnumToOptions(enumObj: any) {
    //     return Object.keys(enumObj).map(key => ({
    //         label: enumObj[key],
    //         value: enumObj[key]
    //     }));
    // }
    //
    // filterCountries(event: any) {
    //     const query = event.query.toLowerCase();
    //     this.filteredCountries = this.countries.filter(country =>
    //         country.label.toLowerCase().includes(query)
    //     );
    // }
    //
    // goToNextStep() {
    //     if (this.stepIndex < this.routeItems.length - 1) {
    //         this.stepIndex++;
    //         this.activeStep = this.routeItems[this.stepIndex];
    //     }
    // }
    //
    // goToPreviousStep() {
    //     if (this.stepIndex > 0) {
    //         this.stepIndex--;
    //         this.activeStep = this.routeItems[this.stepIndex];
    //     }
    // }
    // onCountrySelect(event: any) {
    //     this.formData1.nationalite = event?.value.label || '';
    //     console.error(event?.value.label)
    // }
    //
    //
    // onFileSelect(event: any, type: 'imgFile' | 'cvFile' | 'cvNessFile'): void {
    //     this.isFileSelected[type] = true;
    //     if (event && event.files && event.files.length > 0) {
    //         const selectedFile = event.files[0];
    //         if (type === 'imgFile') {
    //             this.profilePictureFiles = [selectedFile];
    //         } else if (type === 'cvFile') {
    //             this.uploadedFiles = [selectedFile];
    //         }
    //         else if (type === 'cvNessFile') {
    //             this.uploadedFiles = [selectedFile];
    //         }
    //     }
    // }
    //
    // onFileUpload(event: any, type: 'imgFile' | 'cvFile' | 'cvNessFile'): void {
    //     this.isUploading[type] = true;
    //     if (type === 'imgFile' && this.profilePictureFiles && this.profilePictureFiles.length > 0) {
    //         // Logic for handling profile picture upload
    //         console.log('Uploading Profile Picture:', this.profilePictureFiles[0]);
    //     }
    //
    //     if (type === 'cvFile' && this.uploadedFiles && this.uploadedFiles.length > 0) {
    //         // Logic for handling CV upload
    //         console.log('Uploading CV:', this.uploadedFiles[0]);
    //     }
    //     if (type === 'cvNessFile' && this.uploadedFiles && this.uploadedFiles.length > 0) {
    //         // Logic for handling CV upload
    //         console.log('Uploading CV NESS:', this.uploadedFiles[0]);
    //     }
    //
    //     for (const file of event.files) {
    //         this.uploadedFiles.push(file);
    //     }
    //     this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    //
    //     // Simulate upload completion after 2 seconds
    //     setTimeout(() => {
    //         this.isUploading[type] = false;
    //         this.isFileSelected[type] = false; // Reset after upload
    //         // Update form validity
    //     }, 2000);
    // }
    //
    //
    // checkFormValidity() {
    //     // Update isFormValid based on file upload statuses and form validity
    //     this.isFormValid = !Object.values(this.isFileSelected).includes(true) || !this.isFormValid;
    // }
    //
    // onDateSelect(event: any) {
    //     console.log('Date sélectionnée :', event);
    // }
    //
    //
    //
    // onSubmit(candidatureForm: NgForm): void {
    //     if (candidatureForm.valid) {
    //         const formData = new FormData();
    //
    //         // Ajouter les données utilisateur et candidat
    //         formData.append('nom', this.formData1.nom || '');
    //         formData.append('prenom', this.formData1.prenom || '');
    //         formData.append('email', this.formData1.email || '');
    //         formData.append('password', this.formData1.password || '');
    //         formData.append('titre', this.formData1.titre || '');
    //         formData.append('tjmMin', this.formData1.tjmMin || '');
    //         formData.append('tjmSouhaite', this.formData1.tjmSouhaite || '');
    //         formData.append('TJM', this.formData1.TJM || '');
    //
    //         formData.append('salaireMin', this.formData1.salaireMin || '');
    //         formData.append('salaireSouhaite', this.formData1.salaireSouhaite || '');
    //         formData.append('telephone', this.formData1.telephone || '');
    //         formData.append('adresse', this.formData1.adresse || '');
    //         formData.append('Ville', this.formData1.Ville || '');
    //         formData.append('niveau', this.formData1.niveau || '');
    //         formData.append('codePostal', this.formData1.codePostal || '');
    //         formData.append('nationalite', this.formData1.nationalite || '');
    //         formData.append('departement', this.formData1.departement || '');
    //
    //         // Ajouter la disponibilité + 1 DAY
    //             const disponibiliteStr = this.formData1.disponibilite instanceof Date
    //             ? new Date(this.formData1.disponibilite.setDate(this.formData1.disponibilite.getDate() + 1))
    //                 .toISOString()
    //                 .split('T')[0]
    //             : this.formData1.disponibilite || ''
    //
    //         formData.append('disponibilite', disponibiliteStr || '');
    //         formData.append('disponibilite',  this.formData1.disponibilite instanceof Date
    //             ? this.formData1.disponibilite.toISOString().split('T')[0]  // Convert to YYYY-MM-DD format
    //             : this.formData1.disponibilite || '');
    //
    //
    //         // Ajouter les technologies
    //         if (Array.isArray(this.formData1.webFrontTechnologies)) {
    //             formData.append('webFrontTechnologies', this.formData1.webFrontTechnologies.join(','));
    //         } else {
    //             formData.append('webFrontTechnologies', '');
    //         }
    //
    //         if (Array.isArray(this.formData1.webBackTechnologies)) {
    //             formData.append('webBackTechnologies', this.formData1.webBackTechnologies.join(','));
    //         } else {
    //             formData.append('webBackTechnologies', '');
    //         }
    //         if (Array.isArray(this.formData1.apiTechnologies)) {
    //             formData.append('apiTechnologies', this.formData1.apiTechnologies.join(','));
    //         } else {
    //             formData.append('apiTechnologies', '');
    //         }
    //
    //         if (Array.isArray(this.formData1.devOpsTechnologies)) {
    //             formData.append('devOpsTechnologies', this.formData1.devOpsTechnologies.join(','));
    //         } else {
    //             formData.append('devOpsTechnologies', '');
    //         }
    //
    //         if (Array.isArray(this.formData1.mobileTechnologies)) {
    //             formData.append('mobileTechnologies', this.formData1.mobileTechnologies.join(','));
    //         } else {
    //             formData.append('mobileTechnologies', '');
    //         }
    //         if (Array.isArray(this.formData1.blockchainTechnologies)) {
    //             formData.append('blockchainTechnologies', this.formData1.blockchainTechnologies.join(','));
    //         } else {
    //             formData.append('blockchainTechnologies', '');
    //         }
    //         if (Array.isArray(this.formData1.iaTechnologiesOptions)) {
    //             formData.append('iaTechnologies', this.formData1.iaTechnologies.join(','));
    //         } else {
    //             formData.append('iaTechnologies', '');
    //         }
    //         if (Array.isArray(this.formData1.iotTechnologies)) {
    //             formData.append('ioTTechnologies', this.formData1.iotTechnologies.join(','));
    //         } else {
    //             formData.append('ioTTechnologies', '');
    //         }
    //         if (Array.isArray(this.formData1.lowCodeNoCodeTechnologies)) {
    //             formData.append('lowCodeNoCodeTechnologies', this.formData1.lowCodeNoCodeTechnologies.join(','));
    //         } else {
    //             formData.append('lowCodeNoCodeTechnologies', '');
    //         }
    //         // Ajouter les fichiers
    //         if (this.profilePictureFiles && this.profilePictureFiles.length > 0) {
    //             formData.append('imgFile', this.profilePictureFiles[0]);
    //         } else {
    //             // Ajoutez une logique de gestion si 'imgFile' est requis mais non fourni
    //         }
    //
    //         if (this.uploadedFiles && this.uploadedFiles.length > 0) {
    //             formData.append('cvFile', this.uploadedFiles[0]);
    //         } else {
    //             // Ajoutez une logique de gestion si 'cvFile' est requis mais non fourni
    //         }
    //
    //         // Appeler le service pour créer le candidat
    //         this.candidatService.createCandidat(formData).subscribe({
    //             next: (response: any) => {
    //                 this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Candidat Created' });
    //                 setTimeout(() => {
    //                     this.router.navigate(['/backoffice/data']);
    //                 }, 2000);
    //             },
    //             error: (err: any) => {
    //                 this.candidatService.showError(err); // Appel de showErrorAlert en cas d'erreur
    //                 this.showError = true;
    //
    //                 // Réinitialiser l'erreur après un certain temps
    //                 setTimeout(() => {
    //                     this.showError = false;
    //                 }, 2000);
    //             }
    //         });
    //     } else {
    //         this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Form is invalid' });
    //     }
    // }
    //
    // onStepChange(event: MenuItem) {
    //     const index = this.routeItems.findIndex(item => item === event);
    //
    //     if (index !== -1) {
    //         this.stepIndex = index; // This will switch to the corresponding section
    //         this.activeStep = this.routeItems[index]; // Update the active step
    //     }
    // }
    //
    // // Method to handle JSON file import
    // onFileImport(event: any): void {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = (e: any) => {
    //             try {
    //                 const jsonData = JSON.parse(e.target.result);  // Parse the file content to JSON
    //                 this.populateForm(jsonData);  // Call the populateForm method with JSON data
    //             } catch (err) {
    //                 console.error('Error parsing JSON:', err);
    //             }
    //         };
    //         reader.readAsText(file);  // Read the file as text
    //     }
    // }
    //
    // // Method to populate the form with JSON data
    // populateForm(data: any): void {
    // // Populate Step 1: Information Générale
    // this.formData1.nom = data.nom || '';
    // this.formData1.prenom = data.prenom || '';
    // this.formData1.email = data.email || '';
    // this.formData1.password = data.password || '';
    //
    // // Populate Step 2: Pièces Jointes
    // this.formData1.imgFile = data.imgFile || '';
    // this.formData1.cvFile = data.cvFile || '';
    //
    // // Populate Step 3: Détails du Poste
    // this.formData1.titre = data.titre || '';
    // this.formData1.tjmMin = data.tjmMin || 0;
    // this.formData1.tjmSouhaite = data.tjmSouhaite || 0;
    //     this.formData1.TJM = data.TJM || 0;
    //
    //     this.formData1.salaireMin = data.salaireMin || 0;
    // this.formData1.salaireSouhaite = data.salaireSouhaite || 0;
    //
    // // Populate Step 4: Coordonnées
    // this.formData1.telephone = data.telephone || '';
    // this.formData1.adresse = data.adresse || '';
    // this.formData1.Ville = data.Ville || '';
    // this.formData1.codePostal = data.codePostal || '';
    // this.formData1.nationalite = data.nationalite || '';
    //
    // // Populate Step 5: Niveau et disponibilité candidat
    // this.formData1.niveau = data.niveau || '';
    // this.formData1.disponibilite = data.disponibilite || '';
    // this.formData1.lastLogin=data.lastLogin ||null;
    //
    // // Populate Step 6: Technologies Maîtrisées
    //     // Fonction pour vérifier et ajouter les technologies
    //     const addTechnologyToForm = (techName: string, techList: string[], techEnum: any): void => {
    //         // Obtenir les options de l'enum
    //         const options = this.mapEnumToOptions(techEnum);
    //
    //         // Comparer en ignorant la casse
    //         const matchedOption = options.find(option => option.value.toLowerCase().contains(techName.toLowerCase()));
    //
    //         // Si une correspondance est trouvée, ajouter la technologie à la liste appropriée
    //         if (matchedOption) {
    //             techList.push(matchedOption.value); // Ajoute la valeur de l'enum, pas le nom d'API
    //         }
    //     };
    //
    //     // Parcourir les technologies de l'API
    //     data.technologies.forEach((tech: any) => {
    //         const techName = tech.name; // Ne pas convertir en minuscule ici, car nous gérons cela dans la fonction
    //
    //         // Comparer avec les enums
    //         addTechnologyToForm(techName, this.formData1.webFrontTechnologies, WebFrontTechnologies);
    //         addTechnologyToForm(techName, this.formData1.webBackTechnologies, WebBackTechnologies);
    //         addTechnologyToForm(techName, this.formData1.apiTechnologies, APITechnologies);
    //         addTechnologyToForm(techName, this.formData1.devOpsTechnologies, DevOpsTechnologies);
    //         addTechnologyToForm(techName, this.formData1.devOpsTechnologies, AutomatisationTestTechnologies);
    //         addTechnologyToForm(techName, this.formData1.blockchainTechnologies, BlockchainTechnologies);
    //         addTechnologyToForm(techName, this.formData1.devOpsTechnologies, CMSTechnologies);
    //         addTechnologyToForm(techName, this.formData1.devOpsTechnologies, CRMERPTechnologies);
    //         addTechnologyToForm(techName, this.formData1.devOpsTechnologies, EmbeddedSystemsTechnologies);
    //         addTechnologyToForm(techName, this.formData1.iaTechnologies, IATechnologies);
    //         addTechnologyToForm(techName, this.formData1.devOpsTechnologies, IoTTechnologies);
    //         addTechnologyToForm(techName, this.formData1.lowCodeNoCodeTechnologies, LowCodeNoCodeTechnologies);
    //         addTechnologyToForm(techName, this.formData1.mobileTechnologies, MobileTechnologies);
    //         addTechnologyToForm(techName, this.formData1.devOpsTechnologies, SoftwareTechnologies);
    //         addTechnologyToForm(techName, this.formData1.devOpsTechnologies, WebFullStackTechnologies);
    //     });
    //
    // // Populate Step 7: Département
    // this.formData1.departement = data.departement || '';
    // }
    //
    // onCVUpload(event: any): void {
    //     const file = event.target.files[0];  // Get the uploaded file
    //     if (file && file.type === 'application/pdf') {  // Ensure the file is a PDF
    //         const formData = new FormData();
    //         formData.append('file', file);  // Append the file to the form-data, just like in Postman
    //
    //         // Call the service to upload the file and parse the CV
    //         this.uploadCV(formData);
    //     } else {
    //         this.messageService.add({ severity: 'warn', summary: 'Invalid File', detail: 'Please upload a valid PDF file.' });
    //     }
    // }
    //
    // uploadCV(formData: FormData) {
    //     const apiUrl = '/api/v2/parse-cv';
    //     this.loading = true;
    //     this.loadingPercentage = 0;
    //
    //     this.http.post(apiUrl, formData, {
    //         reportProgress: true,
    //         observe: 'events'
    //     }).subscribe({
    //         next: (event: HttpEvent<any>) => {
    //             if (event.type === HttpEventType.UploadProgress) {
    //                 if (event.total) {
    //                     // Calculer la progression du chargement en pourcentage
    //                     const currentProgress = Math.round((100 * event.loaded) / event.total);
    //
    //                     // Simuler une progression allant jusqu'à 90% max pendant l'upload
    //                     if (currentProgress <= 90) {
    //                         this.loadingPercentage = currentProgress;
    //                     }
    //                 }
    //             } else if (event.type === HttpEventType.Response) {
    //                 // Une fois que la réponse est reçue, terminer à 100%
    //                 this.loadingPercentage = 100;
    //                 this.loading = false;
    //                 console.log('API Response:', event.body);
    //                 this.populateFormFromCV(event.body);  // Appelle la méthode pour remplir le formulaire
    //                 this.messageService.add({ severity: 'success', summary: 'Success', detail: 'CV uploaded successfully.' });
    //             }
    //         },
    //         error: (error: any) => {
    //             this.loading = false;
    //             console.error('Error uploading CV:', error);
    //             this.messageService.add({ severity: 'error', summary: 'Error', detail: 'CV upload failed.' });
    //         }
    //     });
    //
    //     // Simuler une progression continue jusqu'à la réponse
    //     const progressInterval = setInterval(() => {
    //         if (this.loadingPercentage < 99) {
    //             this.loadingPercentage += 1; // Augmenter progressivement jusqu'à 90%
    //         } else {
    //             clearInterval(progressInterval); // Arrêter la progression lorsque le maximum est atteint
    //         }
    //     }, 200); // Augmenter de 1% toutes les 100ms
    // }
    //
    //
    //
    // // Populate form fields from the API response
    // populateFormFromCV(data: any): void {
    //     // Étape 1: Information Générale
    //     this.formData1.nom = data.utilisateur?.nom || '';
    //     this.formData1.prenom = data.utilisateur?.prenom || '';
    //     this.formData1.email = data.utilisateur?.email || '';
    //
    //     // Étape 3: Détails du Poste
    //     this.formData1.titre = data.titre || '';
    //     this.formData1.telephone = data?.telephone || '';
    //     this.formData1.adresse = data.adresse || '';
    //
    //     // Étape 4: Langues
    //     this.formData1.langues = data.langues.map((lang: any) => ({
    //         name: lang.name,
    //         level: lang.level
    //     })) || [];
    //
    //     // Fonction pour vérifier et ajouter les technologies
    //     // Fonction pour vérifier et ajouter les technologies
    //     const addTechnologyToForm = (techName: string, techList: string[], techEnum: any): void => {
    //         // Obtenir les options de l'enum
    //         const options = this.mapEnumToOptions(techEnum);
    //
    //         // Comparer en ignorant la casse
    //         const matchedOption = options.find(option => option.value.toLowerCase() === (techName.toLowerCase()));
    //
    //         // Si une correspondance est trouvée, ajouter la technologie à la liste appropriée
    //         if (matchedOption) {
    //             techList.push(matchedOption.value); // Ajoute la valeur de l'enum, pas le nom d'API
    //         }
    //     };
    //
    //
    //     // Parcourir les technologies de l'API
    //     data.technologies.forEach((tech: any) => {
    //         const techName = tech.name; // Ne pas convertir en minuscule ici, car nous gérons cela dans la fonction
    //         console.warn(`Vérification de la technologie : ${techName}`);
    //
    //         // Comparer avec les enums
    //         addTechnologyToForm(techName, this.formData1.webFrontTechnologies, WebFrontTechnologies);
    //         addTechnologyToForm(techName, this.formData1.webBackTechnologies, WebBackTechnologies);
    //         addTechnologyToForm(techName, this.formData1.apiTechnologies, APITechnologies);
    //         addTechnologyToForm(techName, this.formData1.devOpsTechnologies, DevOpsTechnologies);
    //         addTechnologyToForm(techName, this.formData1.devOpsTechnologies, AutomatisationTestTechnologies);
    //         addTechnologyToForm(techName, this.formData1.blockchainTechnologies, BlockchainTechnologies);
    //         addTechnologyToForm(techName, this.formData1.devOpsTechnologies, CMSTechnologies);
    //         addTechnologyToForm(techName, this.formData1.devOpsTechnologies, CRMERPTechnologies);
    //         addTechnologyToForm(techName, this.formData1.devOpsTechnologies, EmbeddedSystemsTechnologies);
    //         addTechnologyToForm(techName, this.formData1.iaTechnologies, IATechnologies);
    //         addTechnologyToForm(techName, this.formData1.devOpsTechnologies, IoTTechnologies);
    //         addTechnologyToForm(techName, this.formData1.lowCodeNoCodeTechnologies, LowCodeNoCodeTechnologies);
    //         addTechnologyToForm(techName, this.formData1.mobileTechnologies, MobileTechnologies);
    //         addTechnologyToForm(techName, this.formData1.devOpsTechnologies, SoftwareTechnologies);
    //         addTechnologyToForm(techName, this.formData1.devOpsTechnologies, WebFullStackTechnologies);
    //     });
    //
    //     // Affichage de succès à l'importation des données du CV
    //     this.messageService.add({ severity: 'success', summary: 'Success', detail: 'CV data imported successfully.' });
    // }




    routeItems: MenuItem[] = [];
    activeStep: MenuItem | null = null;
    candidat: Candidat | null = null;
    stepIndex: number = 0;
    countries: any[] = []; // Array to hold country data
    languages: any[] = [];
    langues: any[] = [];
    experiences :any[] = [];
    references:any[]=[];
    technologies:any[] = [];
    formations: any[] = [];
    certifications: any[] = [];
    filteredCountries: any[] = [];
    filteredLanguages: any[] = [];
    profilePictureFiles: File[] = [];
    showError: boolean = false;
    isUploading = { imgFile: false, cvFile: false, cvNessFile:false };
    isFileSelected = { imgFile: false, cvFile: false, cvNessFile:false };
    uploadedFiles: any[] = [];
    NiveauOptions!: any;
    // Technology options arrays
    webFrontTechnologiesOptions = [];
    webBackTechnologiesOptions = [];
    apiTechnologiesOptions = [];
    devOpsTechnologiesOptions = [];
    mobileTechnologiesOptions = [];
    blockchainTechnologiesOptions = [];
    iaTechnologiesOptions = [];
    iotTechnologiesOptions = [];
    lowCodeNoCodeTechnologiesOptions = [];
    technoAEvaluerOptions = [];
    statut: any[];
    preavis: any[];

    loading: boolean = false;
    webFrontSkills: string[] = [];
    webBackSkills: string[] = [];
    apiSkills: string[] = [];
    devOpsSkills: string[] = [];
    mobileSkills: string[] = [];
    blockchainSkills: string[] = [];
    iaSkills: string[] = [];
    iotSkills: string[] = [];
    lowCodeSkills: string[] = [];
    states: { label: string, value: string }[];
    job: {label : string, value: string }[];
    level: {label : string, value : string}[];
    myRating: { [key: number]: number } = {};
    myRatingLnag: { [key: number]: number } = {};
    loadingPercentage: number = 0;


    formData1 = {
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
        // referentiels: [
        //     {
        //         id: null,
        //         segments: [],
        //         sousSegments: [],
        //         profil: [],
        //         technologie: [],
        //         candidat: null // Lien avec Candidat
        //     }
        // ],
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


    profils: { label: string, value: string }[] = [
        { label: 'Architecte', value: 'Architecte' },
        { label: 'Expert', value: 'Expert' },
        { label: 'Ingénieur', value: 'Ingénieur' },
        { label: 'Business Analyst', value: 'Business Analyst' },
        { label: 'Directeur de projets', value: 'Directeur de projets' },
        { label: 'Développeur', value: 'Développeur' },
        { label: 'Test / Recette', value: 'Test / Recette' },
        { label: 'PMO', value: 'PMO' },
        { label: 'Analyst', value: 'Analyst' },
        { label: 'Lead', value: 'Lead' },
        { label: 'MOA/AMOA', value: 'MOA/AMOA' },
        { label: 'Intégrateur', value: 'Intégrateur' },
        { label: 'Technicien', value: 'Technicien' },
        { label: 'Analyste', value: 'Analyste' },
        { label: 'Services Delivery Manager / delivery Manager', value: 'Services Delivery Manager / delivery Manager' },
        { label: 'Incident, Problem, Change manager', value: 'Incident, Problem, Change manager' },
        { label: 'Administrateur', value: 'Administrateur' },
        { label: 'Scientist', value: 'Scientist' },
        { label: 'Security officer', value: 'Security officer' },
        { label: 'Référent', value: 'Référent' },
        { label: 'Auditeur', value: 'Auditeur' },
        { label: 'Designer', value: 'Designer' },
        { label: 'Coach', value: 'Coach' },
        { label: '(Proxi) Product Owner', value: '(Proxi) Product Owner' },
        { label: 'Coordinateur', value: 'Coordinateur' },
    ];

    segments = [
        { label: 'Développement Applicatif et Intégration de progiciel', value: 'dev_app' },
        { label: 'Agile / Devops', value: 'agile_devops' },
        { label: 'Automation & IA', value: 'automation_ia' },
        { label: 'Cloud', value: 'cloud' },
        { label: 'Autres Spécialités', value: 'other_specialties' },
        { label: 'Data', value: 'data' },
        { label: 'Expertise Sécurité', value: 'security_expertise' },
        { label: 'Gestion de Projet et Organisation', value: 'project_management' },
        { label: 'Infrastructure', value: 'infrastructure' }
    ];

    sousSegmentsMap = {

        'project_management': [
            { label: 'Directeur de projets', value: 'director' },
            { label: 'Chef de projets', value: 'project_manager' },
            { label: 'Coordinateur', value: 'coordinateur' },
            { label: 'Scrum Master', value: 'master' },
            { label: 'Product Owner', value: 'prodOwner' },
            { label: 'IT Manager/Directeur/Responsable de Domaine', value: 'ItMang' },
            { label: 'Auditeur', value: 'auditor' },
            { label: 'Formateur', value: 'trainer' },
            { label: 'Méthodologie Agile', value: 'methAg' },
            { label: 'Gouvernance', value: 'gouvernance' },
            { label: 'Amélioration Process IT', value: 'process_improvement' },
            { label: 'Transition / Transformation', value: 'amelTransformation' },
            { label: 'Organisationel / entreprise', value: 'orgEntreprise' },
            { label: 'Chef de projets MOA/MOE', value: 'MOA_MOE' },
            { label: 'PMO', value: 'pmo' },
            { label: 'Lead', value: 'Lead' },
            { label: 'Coach', value: 'coach' },
        ],

        'dev_app': [
            { label: 'Web (front)', value: 'Web (front)' },
            { label: 'Web (back)', value: 'Web (back)' },
            { label: 'Web (fullstack)', value: 'Web (fullstack)' },
            { label: 'Logiciel', value: 'Logiciel' },
            { label: 'Mobile', value: 'Mobile' },
            { label: 'IA', value: 'ia' },
            { label: 'Automatisation Test', value: 'automation_test' },
            { label: 'Blockchain', value: 'blockchain' },
            { label: 'Systèmes embarqués', value: 'Systèmes embarqués' },
            { label: 'API', value: 'api' },
            { label: 'Devops', value: 'devops' },
            { label: 'IoT', value: 'iot' },
            { label: 'PROGICIELS/CRM/ERP', value: 'PrCrEr' },
            { label: 'CMS', value: 'cms' },
            { label: 'Low-Code/ No-Code', value: 'LowNoCode' },
        ],
        'infrastructure': [
            { label: 'Base de données', value: 'databases' },
            { label: 'Réseaux (constructeurs, protocles…)', value: 'networks' },
            { label: 'Sécurité', value: 'security' },
            { label: 'Système', value: 'systemes' },
            { label: 'Middleware', value: 'middleware' },
            { label: 'Serveur d\'application', value: 'AppServer' },
            { label: 'Scripting', value: 'scripting' },
            { label: 'Ordonanceur', value: 'ordonanceur' },
            { label: 'Poste de travail', value: 'PosteTravail' },
            { label: 'Télécom (voix, données…)', value: 'TelecVoixDonnees' },
            { label: 'Sauvegarde', value: 'sauvegarde' },
            { label: 'Stockage', value: 'stockage' },
            { label: 'PCA / PRA', value: 'PcaPra' },
            { label: 'Virtualisation', value: 'virtualization' },
            { label: 'Cloud', value: 'cloudd' },
            { label: 'Radio', value: 'radio' },
            { label: 'IoT', value: 'IOT' },
            { label: 'Mainframe', value: 'mainframe' },
        ],
        'data': [
            { label: 'BI/Big Data', value: 'big_data' },
            { label: 'IA', value: 'IA' },
            { label: 'Machine Learning', value: 'machine_learning' },
            { label: 'Bot', value: 'bot' },
            { label: 'Mining', value: 'mining' }
        ],
        'security_expertise': [
            { label: 'Cybersécurité', value: 'cybersecurity' },
            { label: 'Cryptographie', value: 'cryptography' },
            { label: 'Vulnérabilités', value: 'vulnerabilites' },
            { label: 'Risque', value: 'risc' },
            { label: 'Infrastructure', value: 'infra' },
            { label: 'Conformité', value: 'conformity' },
            { label: 'Compllicance', value: 'complicance' },
            { label: 'Gouvernance', value: 'governance' }
        ],
        'agile_devops': [
            { label: 'UI/UX', value: 'ux_ui' },
            { label: 'Coach Agile / Devops', value: 'coach_agile_devops' },
            { label: 'Scrum Master', value: 'scrum_master' },
            { label: 'Product Owner', value: 'product_owner' },
            { label: 'Lead', value: 'lead' },
        ],
        'automation_ia': [
            { label: 'IA', value: 'Ia' },
            { label: 'Bot', value: 'Bot' },
            { label: 'Automatisation', value: 'automation' },
        ],
        'cloud': [
            { label: 'Cloud', value: 'cloud' }
        ],
        'other_specialties': [
            { label: 'UI/UX Designer', value: 'ux_ui_designer' },
            { label: 'intégration Web', value: 'web_integration' },
            { label: 'SEO', value: 'seo' },
        ],


    };

    technologiesMap = {
        'Web (front)': [
            { label: 'HTML5', value: 'HTML5' },
            { label: 'CSS3', value: 'CSS3' },
            { label: 'JavaScript', value: 'JavaScript' },
            { label: 'React.js', value: 'React.js' },
            { label: 'Angular', value: 'Angular' },
            { label: 'Vue.js', value: 'Vue.js' },
            { label: 'jQuery', value: 'jQuery' },
            { label: 'Bootstrap', value: 'Bootstrap' },
            { label: 'Webpack', value: 'Webpack' },
            { label: 'Gulp', value: 'Gulp' },
            { label: 'Jest', value: 'Jest' },
            { label: 'Mocha', value: 'Mocha' },
            { label: 'TypeScript', value: 'TypeScript' },
            { label: 'Redux', value: 'Redux' },
            { label: 'GraphQL', value: 'GraphQL' },
            { label: 'Sass', value: 'Sass' },
            { label: 'Less', value: 'Less' },
            { label: 'Responsive Web Design', value: 'Responsive Web Design' },
            { label: 'Web Accessibility', value: 'Web Accessibility' },
            { label: 'Babel', value: 'Babel' },
            { label: 'ESLint', value: 'ESLint' },
            { label: 'Prettier', value: 'Prettier' },
            { label: 'Axios', value: 'Axios' },
            { label: 'AJAX', value: 'AJAX' },
            { label: 'Front-end Frameworks', value: 'Front-end Frameworks' },
            { label: 'Front-end Build Tools', value: 'Front-end Build Tools' },
            { label: 'Unit Testing', value: 'Unit Testing' },
            { label: 'Component Libraries', value: 'Component Libraries' },
        ],
        'Web (back)': [
            { label: 'Node.js', value: 'Node.js' },
            { label: 'Python', value: 'Python' },
            { label: 'Ruby', value: 'Ruby' },
            { label: 'PHP', value: 'PHP' },
            { label: 'Express.js', value: 'Express.js' },
            { label: 'Django', value: 'Django' },
            { label: 'Ruby on Rails', value: 'Ruby on Rails' },
            { label: 'Laravel', value: 'Laravel' },
            { label: 'MySQL', value: 'MySQL' },
            { label: 'PostgreSQL', value: 'PostgreSQL' },
            { label: 'MongoDB', value: 'MongoDB' },
            { label: 'Jest', value: 'Jest' },
            { label: 'PHPUnit', value: 'PHPUnit' },
            { label: 'Apache', value: 'Apache' },
            { label: 'Nginx', value: 'Nginx' },
            { label: 'Java', value: 'Java' },
            { label: 'C#', value: 'C#' },
            { label: '.NET', value: '.NET' },
            { label: 'REST', value: 'REST' },
            { label: 'SOAP', value: 'SOAP' },
            { label: 'Google Cloud Platform', value: 'Google Cloud Platform' },
            { label: 'AWS', value: 'AWS' },
            { label: 'Web Services', value: 'Web Services' },
            { label: 'Microservices', value: 'Microservices' },
            { label: 'API Design', value: 'API Design' },
            { label: 'Backend Development', value: 'Backend Development' },
            { label: 'Database Management', value: 'Database Management' },
            { label: 'Server Configuration', value: 'Server Configuration' },
            { label: 'DevOps', value: 'DevOps' },
        ],
        'Web (fullstack)': [
            { label: 'MEAN stack', value: 'MEAN stack' },
            { label: 'MERN stack', value: 'MERN stack' },
            { label: 'Docker', value: 'Docker' },
            { label: 'Kubernetes', value: 'Kubernetes' },
            { label: 'AWS', value: 'AWS' },
            { label: 'Azure', value: 'Azure' },
            { label: 'Google Cloud Platform', value: 'Google Cloud Platform' },

        ],
        'Logiciel': [
            { label: 'Java', value: 'Java' },
            { label: 'C#', value: 'C#' },
            { label: 'C++', value: 'C++' },
            { label: 'IntelliJ IDEA', value: 'IntelliJ IDEA' },
            { label: 'Visual Studio', value: 'Visual Studio' },
            { label: 'Eclipse', value: 'Eclipse' },
            { label: 'Git', value: 'Git' },
            { label: 'SVN', value: 'SVN' },
            { label: 'Jenkins', value: 'Jenkins' },
            { label: 'GitLab CI', value: 'GitLab CI' },
            { label: 'CircleCI', value: 'CircleCI' },
        ],
        'Mobile': [
            { label: 'Swift', value: 'Swift' },
            { label: 'Kotlin', value: 'Kotlin' },
            { label: 'Flutter', value: 'Flutter' },
            { label: 'React Native', value: 'React Native' },
            { label: 'Xamarin', value: 'Xamarin' },
            { label: 'Espresso', value: 'Espresso' },
            { label: 'XCTest', value: 'XCTest' },
            { label: 'Firebase', value: 'Firebase' },
            { label: 'Android', value: 'Android' },
            { label: 'IOS', value: 'IOS' },
        ],
        'ia': [
            { label: 'Python', value: 'Python' },
            { label: 'R', value: 'R' },
            { label: 'TensorFlow', value: 'TensorFlow' },
            { label: 'PyTorch', value: 'PyTorch' },
            { label: 'Scikit-learn', value: 'Scikit-learn' },
            { label: 'Apache Spark', value: 'Apache Spark' },
            { label: 'Hadoop', value: 'Hadoop' },
            { label: 'Tableau', value: 'Tableau' },
            { label: 'Power BI', value: 'Power BI' },
        ],
        'automation_test': [
            { label: 'Selenium', value: 'Selenium' },
            { label: 'Appium', value: 'Appium' },
            { label: 'JUnit', value: 'JUnit' },
            { label: 'TestNG', value: 'TestNG' },
            { label: 'Travis CI', value: 'Travis CI' },
            { label: 'Bamboo', value: 'Bamboo' },
            { label: 'TestRail', value: 'TestRail' },
            { label: 'Zephyr', value: 'Zephyr' },
            { label: 'Katalon', value: 'Katalon' },
            { label: 'Ranorex Studio Rx', value: 'Ranorex Studio Rx' },
            { label: 'TestComplete', value: 'TestComplete' },
            { label: 'Lambdatest', value: 'Lambdatest' },
            { label: 'POSTMAN', value: 'POSTMAN' },
            { label: 'Protractor', value: 'Protractor' },
            { label: 'Perfecto', value: 'Perfecto' },
            { label: 'Selenium', value: 'Selenium' },
            { label: 'Eggplant', value: 'Eggplant' },
            { label: 'SoapUI', value: 'SoapUI' },
            { label: 'Tricentis', value: 'Tricentis' },
            { label: 'Cypress', value: 'Cypress' },
            { label: 'Jmeter', value: 'Jmeter' },
            { label: 'Robot', value: 'Robot' },
            { label: '  Frame Work', value: '  Frame Work' },
            { label: 'Appium', value: 'Appium' },
        ],
        'blockchain': [
            { label: 'Ethereum', value: 'Ethereum' },
            { label: 'Hyperledger Fabric', value: 'Hyperledger Fabric' },
            { label: 'Solidity', value: 'Solidity' },
            { label: 'Chaincode', value: 'Chaincode' },
            { label: 'Truffle', value: 'Truffle' },
            { label: 'Embark', value: 'Embark' },
            { label: 'MetaMask', value: 'MetaMask' },
            { label: 'Ganache', value: 'Ganache' },
        ],
        'Systèmes embarqués': [
            { label: 'C', value: 'C' },
            { label: 'C++', value: 'C++' },
            { label: 'Assembly', value: 'Assembly' },
            { label: 'Arduino IDE', value: 'Arduino IDE' },
            { label: 'PlatformIO', value: 'PlatformIO' },
            { label: 'ARM Cortex', value: 'ARM Cortex' },
            { label: 'ESP32', value: 'ESP32' },
            { label: 'Arduino', value: 'Arduino' },
            { label: 'FreeRTOS', value: 'FreeRTOS' },
            { label: 'Embedded Linux', value: 'Embedded Linux' },
        ],
        'api': [
            { label: 'REST', value: 'rest' },
            { label: 'GraphQL', value: 'GraphQL' },
            { label: 'OAuth', value: 'OAuth' },
            { label: 'JWT', value: 'JWT' },
            { label: 'Kong', value: 'Kong' },
            { label: 'Apigee', value: 'Apigee' },
            { label: 'Swagger', value: 'Swagger' },
            { label: 'Postman', value: 'Postman' },
            { label: 'Slack', value: 'Slack' },
            { label: 'Webdam', value: 'Webdam' },
            { label: 'RingCentral', value: 'RingCentral' },
            { label: 'Twilio', value: 'Twilio' },
            { label: 'Watson', value: 'Watson' },
            { label: 'Hootsuite', value: 'Hootsuite' },
            { label: 'GoogleDrive', value: 'GoogleDrive' },
            { label: 'Google AR', value: 'Google AR' },
            { label: 'Azure Immutable Blob Storage', value: 'Azure Immutable Blob Storage' },
            { label: 'Coinbase', value: 'Coinbase' },
            { label: 'BlazingText', value: 'BlazingText' },
            { label: 'Amatino', value: 'Amatino' },
        ],
        'devops': [
            { label: 'Terraform', value: 'Terraform' },
            { label: 'Ansible', value: 'Ansible' },
            { label: 'Jenkins', value: 'Jenkins' },
            { label: 'CircleCI', value: 'CircleCI' },
            { label: 'GitLab CI', value: 'GitLab CI' },
            { label: 'Docker', value: 'Docker' },
            { label: 'Kubernetes', value: 'Kubernetes' },
            { label: 'Prometheus', value: 'Prometheus' },
            { label: 'Grafana', value: 'Grafana' },
            { label: 'ELK Stack', value: 'ELK Stack' },
        ],
        'iot': [
            { label: 'AWS IoT', value: 'AWS IoT' },
            { label: 'Microsoft Azure IoT', value: 'Microsoft Azure IoT' },
            { label: 'Google Cloud IoT', value: 'Google Cloud IoT' },
            { label: 'Python', value: 'Python' },
            { label: 'JavaScript', value: 'JavaScript' },
            { label: 'C++', value: 'C++' },
            { label: 'MQTT', value: 'MQTT' },
            { label: 'CoAP', value: 'CoAP' },
            { label: 'AMQP', value: 'AMQP' },
            { label: 'Raspberry Pi', value: 'Raspberry Pi' },
            { label: 'Arduino', value: 'Arduino' },
            { label: 'ESP8266', value: 'ESP8266' },
        ],
        'PrCrEr': [
            { label: 'SAP', value: 'SAP' },
            { label: 'Oracle ERP', value: 'Oracle ERP' },
            { label: 'Microsoft Dynamics', value: 'Microsoft Dynamics' },
            { label: 'Salesforce', value: 'Salesforce' },
            { label: 'HubSpot CRM', value: 'HubSpot CRM' },
            { label: 'Odoo', value: 'Odoo' },
            { label: 'ERPNext', value: 'ERPNext' },
            { label: 'BI tools integration', value: 'BI tools integration' },
            { label: 'Cegid', value: 'Cegid' },
            { label: 'Divalto', value: 'Divalto' },
            { label: 'Sellsy', value: 'Sellsy' },
            { label: 'Sage', value: 'Sage' },
            { label: 'Unit4', value: 'Unit4' },
            { label: 'Iris', value: 'Iris' },
        ],
        'cms': [
            { label: 'WordPress', value: 'WordPress' },
            { label: 'Drupal', value: 'Drupal' },
            { label: 'Joomla', value: 'Joomla' },
            { label: 'Contentful', value: 'Contentful' },
            { label: 'Strapi', value: 'Strapi' },
            { label: 'WooCommerce', value: 'WooCommerce' },
            { label: 'Magento', value: 'Magento' },
            { label: 'Sitecore', value: 'Sitecore' },
            { label: 'Adobe Experience Manager', value: 'Adobe Experience Manager' },
            { label: 'Shopify', value: 'Shopify' },
            { label: 'Proximis', value: 'Proximis' },
            { label: 'Salesforce', value: 'Salesforce' },
            { label: 'Opencart', value: 'Opencart' },
        ],
        'LowNoCode': [
            { label: 'OutSystems', value: 'OutSystems' },
            { label: 'Mendix', value: 'Mendix' },
            { label: 'Zoho Creator', value: 'Zoho Creator' },
            { label: 'Microsoft Power Automate', value: 'Microsoft Power Automate' },
            { label: 'Integromat', value: 'Integromat' },
            { label: 'Bubble', value: 'Bubble' },
            { label: 'Adalo', value: 'Adalo' },
            { label: 'Zapier', value: 'Zapier' },
            { label: 'Airtable', value: 'Airtable' },
        ],
        'databases': [
            { label: 'MySQL', value: 'MySQL' },
            { label: 'PostgreSQL', value: 'PostgreSQL' },
            { label: 'Oracle', value: 'Oracle' },
            { label: 'SQL Server', value: 'SQL Server' },
            { label: 'MongoDB', value: 'MongoDB' },
            { label: 'Cassandra', value: 'Cassandra' },
            { label: 'Redis', value: 'Redis' },
            { label: 'Elasticsearch', value: 'Elasticsearch' },
            { label: 'SQLite', value: 'SQLite' },
            { label: 'MariaDB', value: 'MariaDB' },
            { label: 'IBM Db2', value: 'IBM Db2' },
            { label: 'SAP HANA', value: 'SAP HANA' },
            { label: 'Neo4j', value: 'Neo4j' },
            { label: 'CouchDB', value: 'CouchDB' },
            { label: 'DynamoDB', value: 'DynamoDB' },
            { label: 'Firebase', value: 'Firebase' },
            { label: 'Oracle Database', value: 'Oracle Database' },
            { label: 'Couchbase', value: 'Couchbase' },
            { label: 'Amazon RDS', value: 'Amazon RDS' },
            { label: 'Google Cloud SQL', value: 'Google Cloud SQL' },
            { label: 'IBM Db2', value: 'IBM Db2' },
            { label: 'Apache Cassandra', value: 'Apache Cassandra' },
            { label: 'InfluxDB', value: 'InfluxDB' },
            { label: 'ElasticSearch ELK', value: 'ElasticSearch ELK' },
            { label: 'DB2', value: 'DB2' },
            { label: 'Access', value: 'Access' },
            { label: 'Teradata', value: 'Teradata' },
            { label: 'Hive', value: 'Hive' },
            { label: 'Splunk', value: 'Splunk' },
            { label: 'Sybase', value: 'Sybase' },

        ],
        'networks': [
            { label: 'Cisco', value: 'Cisco' },
            { label: 'Juniper', value: 'Juniper' },
            { label: 'Arista', value: 'Arista' },
            { label: 'TCP/IP', value: 'TCP/IP' },
            { label: 'DNS', value: 'DNS' },
            { label: 'DHCP', value: 'DHCP' },
            { label: 'BGP', value: 'BGP' },
            { label: 'OSPF', value: 'OSPF' },
            { label: 'VPN', value: 'VPN' },
            { label: 'SDN', value: 'SDN' },
            { label: 'MPLS', value: 'MPLS' },
            { label: 'Wireshark', value: 'Wireshark' },
            { label: 'F5', value: 'F5' },
            { label: 'Palo Alto', value: 'Palo Alto' },
            { label: 'Check Point', value: 'Check Point' },
            { label: 'Fortinet', value: 'Fortinet' },
            { label: 'Huawei', value: 'Huawei' },
        ],
        'security': [
            { label: 'Palo Alto', value: 'Palo Alto' },
            { label: 'Check Point', value: 'Check Point' },
            { label: 'Fortinet', value: 'Fortinet' },
            { label: 'IDS/IPS: Snort', value: 'IDS/IPS: Snort' },
            { label: 'Suricata', value: 'Suricata' },
            { label: 'Splunk', value: 'Splunk' },
            { label: 'QRadar', value: 'QRadar' },
            { label: 'Symantec', value: 'Symantec' },
            { label: 'Kaspersky', value: 'Kaspersky' },
            { label: 'Antivirus', value: 'Antivirus' },
            { label: 'DLP', value: 'DLP' },
            { label: 'Encryption', value: 'Encryption' },
            { label: 'Security Policy Management', value: 'Security Policy Management' },
            { label: 'Penetration Testing', value: 'Penetration Testing' },
            { label: 'SIEM :Security Information and Event Management', value: 'SIEM :Security Information and Event Management' },
            { label: 'Threat Intelligence', value: 'Threat Intelligence' },
            { label: 'Security Orchestration', value: 'Security Orchestration' },
            { label: 'Managed Security Services', value: 'Managed Security Services' },

        ],
        'systemes': [
            { label: 'Windows Server', value: 'Windows Server' },
            { label: 'Linux', value: 'Linux' },
            { label: 'Unix', value: 'Unix' },
            { label: 'AIX', value: 'AIX' },
            { label: 'System Administration', value: 'System Administration' },
            { label: 'Shell Scripting', value: 'Shell Scripting' },
            { label: 'Active Directory', value: 'Active Directory' },
            { label: 'LDAP', value: 'LDAP' },
            { label: 'PowerShell', value: 'PowerShell' },
            { label: 'Bash', value: 'Bash' },
            { label: 'Windows PowerShell', value: 'Windows PowerShell' },
            { label: 'VMware vSphere', value: 'VMware vSphere' },
            { label: 'Red Hat Enterprise Linux', value: 'Red Hat Enterprise Linux' },
            { label: 'CentOS', value: 'CentOS' },
            { label: 'Ubuntu', value: 'Ubuntu' },
            { label: 'Fedora', value: 'Fedora' },
            { label: 'Linux (RedHat)', value: 'Linux (RedHat)' },
            { label: 'Windows', value: 'Windows' },
            { label: 'Ubuntu', value: 'Ubuntu' },
            { label: 'Windows', value: 'Windows' },
            { label: 'HPNS', value: 'HPNS' },
            { label: 'z/OS', value: 'z/OS' },
            { label: 'TSO', value: 'TSO' },
            { label: 'MVS', value: 'MVS' },
        ],
        'middleware': [
            { label: 'Apache Kafka', value: 'Apache Kafka' },
            { label: 'RabbitMQ', value: 'RabbitMQ' },
            { label: 'IBM MQ', value: 'IBM MQ' },
            { label: 'Middleware Integration', value: 'Middleware Integration' },
            { label: 'Message Queues', value: 'Message Queues' },
            { label: 'ESB', value: 'ESB' },
            { label: 'API Gateways', value: 'API Gateways' },
            { label: 'JMS', value: 'JMS' },
            { label: 'Apache Camel', value: 'Apache Camel' },
            { label: 'MuleSoft', value: 'MuleSoft' },
            { label: 'Apache ActiveMQ', value: 'Apache ActiveMQ' },
        ],
        'AppServer': [
            { label: 'Apache Tomcat', value: 'Apache Tomcat' },
            { label: 'JBoss EAP', value: 'JBoss EAP' },
            { label: 'WebSphere', value: 'WebSphere' },
            { label: 'Oracle WebLogic', value: 'Oracle WebLogic' },
            { label: 'SAP NetWeaver', value: 'SAP NetWeaver' },
            { label: 'IIS', value: 'IIS' },
            { label: 'Nginx', value: 'Nginx' },
            { label: 'Apache HTTP Server', value: 'Apache HTTP Server' },
            { label: 'Apache TomEE', value: 'Apache TomEE' },
            { label: 'WildFly', value: 'WildFly' },
            { label: 'GlassFish', value: 'GlassFish' },
            { label: 'Tomcat', value: 'Tomcat' },
            { label: 'Apache', value: 'Apache' },
            { label: 'Jboss', value: 'Jboss' },
            { label: 'Wild Flight', value: 'Wild Flight' },
            { label: 'DataStage', value: 'DataStage' },
            { label: 'BPM', value: 'BPM' },
            { label: 'Gigaspace', value: 'Gigaspace' },
            { label: 'SAS', value: 'SAS' },
            { label: 'Cognos', value: 'Cognos' },
            { label: 'Microstrategy', value: 'Microstrategy' },
            { label: 'SAP', value: 'SAP' },
            { label: 'Web Method', value: 'Web Method' },
        ],
        'scripting': [
            { label: 'Bash', value: 'Bash' },
            { label: 'PowerShell', value: 'PowerShell' },
            { label: 'Python', value: 'Python' },
            { label: 'Ruby', value: 'Ruby' },
            { label: 'Perl', value: 'Perl' },
            { label: 'JavaScript', value: 'JavaScript' },
            { label: 'PHP', value: 'PHP' },
            { label: 'Groovy', value: 'Groovy' },
            { label: 'Lua', value: 'Lua' },
            { label: 'Shell', value: 'Shell' },
            { label: 'TypeScript', value: 'TypeScript' },
        ],
        'ordonanceur': [
            { label: 'Cron', value: 'Cron' },
            { label: 'at', value: 'at' },
            { label: 'Windows Task Scheduler', value: 'Windows Task Scheduler' },
            { label: 'Quartz', value: 'Quartz' },
            { label: 'Tivoli Workload Scheduler', value: 'Tivoli Workload Scheduler' },
            { label: 'Control-M', value: 'Control-M' },
            { label: 'AutoSys', value: 'AutoSys' },
            { label: 'Apache NiFi', value: 'Apache NiFi' },
            { label: 'Cron Jobs', value: 'Cron Jobs' },
            { label: 'ETL Tools', value: 'ETL Tools' },
            { label: 'Data Pipelines', value: 'Data Pipelines' },
            { label: 'Apache Airflow', value: 'Apache Airflow' },
            { label: 'IBM Workload Scheduler', value: 'IBM Workload Scheduler' },
            { label: 'UC4', value: 'UC4' },
        ],
        'PosteTravail': [
            { label: 'Windows 10', value: 'Windows 10' },
            { label: 'Windows 11', value: 'Windows 11' },
            { label: 'Windows Server', value: 'Windows Server' },
            { label: 'Active Directory', value: 'Active Directory' },
            { label: 'Group Policy', value: 'Group Policy' },
            { label: 'Microsoft 365', value: 'Microsoft 365' },
            { label: 'SCCM (System Center Configuration Manager)', value: 'SCCM (System Center Configuration Manager)' },
            { label: 'WSUS (Windows Server Update Services)', value: 'WSUS (Windows Server Update Services)' },
            { label: 'PowerShell', value: 'PowerShell' },
            { label: 'Remote Desktop Services', value: 'Remote Desktop Services' },
            { label: 'Windows Defender', value: 'Windows Defender' },
            { label: 'BitLocker', value: 'BitLocker' },
            { label: 'Microsoft Intune', value: 'Microsoft Intune' },
            { label: 'Microsoft Endpoint Manager', value: 'Microsoft Endpoint Manager' },
            { label: 'Windows Deployment Services', value: 'Windows Deployment Services' },
            { label: 'Windows Autopilot', value: 'Windows Autopilot' },
            { label: 'Microsoft Office Suite', value: 'Microsoft Office Suite' },
            { label: 'OneDrive for Business', value: 'OneDrive for Business' },
            { label: 'Windows Firewall', value: 'Windows Firewall' },
            { label: 'Windows Update', value: 'Windows Update' },
            { label: 'Windows Event Viewer', value: 'Windows Event Viewer' },
            { label: 'Print Management', value: 'Print Management' },
            { label: 'Windows Troubleshooting Tools', value: 'Windows Troubleshooting Tools' },
            { label: 'Windows Task Scheduler', value: 'Windows Task Scheduler' },
            { label: 'macOS', value: 'macOS' },
            { label: 'Linux', value: 'Linux' },
            { label: 'Endpoint Security', value: 'Endpoint Security' },
            { label: 'Virtual Desktop Infrastructure (VDI)', value: 'Virtual Desktop Infrastructure (VDI)' },
            { label: 'Google Workspace', value: 'Google Workspace' },
            { label: 'Citrix', value: 'Citrix' },
        ],
        'TelecVoixDonnees': [
            { label: 'VoIP', value: 'VoIP' },
            { label: 'SIP', value: 'SIP' },
            { label: 'MPLS', value: 'MPLS' },
            { label: 'SD-WAN', value: 'SD-WAN' },
            { label: 'VoLTE', value: 'VoLTE' },
            { label: 'LTE', value: 'LTE' },
            { label: '5G', value: '5G' },
            { label: 'WiMax', value: 'WiMax' },
            { label: 'GPRS', value: 'GPRS' },
            { label: 'PBX', value: 'PBX' },
            { label: 'Asterisk', value: 'Asterisk' },
            { label: 'VoIP Gateways', value: 'VoIP Gateways' },
            { label: 'Asterisk', value: 'Asterisk' },
            { label: 'Cisco Call Manager', value: 'Cisco Call Manager' },
            { label: 'RTP', value: 'RTP' },
            { label: 'SS7', value: 'SS7' },
            { label: 'Alcatel-Lucent', value: 'Alcatel-Lucent' },
            { label: 'Ericsson', value: 'Ericsson' },
        ],
        'sauvegarde': [
            { label: 'Veeam', value: 'Veeam' },
            { label: 'Commvault', value: 'Commvault' },
            { label: 'NetBackup', value: 'NetBackup' },
            { label: 'Acronis', value: 'Acronis' },
            { label: 'Rubrik', value: 'Rubrik' },
            { label: 'Cohesity', value: 'Cohesity' },
            { label: 'Backup Exec', value: 'Backup Exec' },
            { label: 'Veritas Backup Exec', value: 'Veritas Backup Exec' },
            { label: 'Acronis', value: 'Acronis' },
            { label: 'IBM Spectrum Protect', value: 'IBM Spectrum Protect' },
            { label: 'Duplicati', value: 'Duplicati' },
            { label: 'Bacula', value: 'Bacula' },
        ],
        'stockage': [
            { label: 'SAN', value: 'SAN' },
            { label: 'NAS', value: 'NAS' },
            { label: 'RAID', value: 'RAID' },
            { label: 'Storage Arrays', value: 'Storage Arrays' },
            { label: 'NFS', value: 'NFS' },
            { label: 'CIFS', value: 'CIFS' },
            { label: 'Dell EMC', value: 'Dell EMC' },
            { label: 'NetApp', value: 'NetApp' },
            { label: 'HPE', value: 'HPE' },
            { label: 'IBM Storage', value: 'IBM Storage' },
            { label: 'Pure Storage', value: 'Pure Storage' },
            { label: 'NAS Appliances', value: 'NAS Appliances' },
            { label: 'Hitachi', value: 'Hitachi' },
            { label: 'Synology', value: 'Synology' },
            { label: 'QNAP', value: 'QNAP' },
            { label: 'AWS S3', value: 'AWS S3' },
            { label: 'Azure Blob Storage', value: 'Azure Blob Storage' },
            { label: 'NTFS', value: 'NTFS' },
            { label: 'XFS', value: 'XFS' },
            { label: 'Ext4', value: 'Ext4' },
        ],
        'PcaPra': [
            { label: 'Zerto', value: 'Zerto' },
            { label: 'VMware Site Recovery', value: 'VMware Site Recovery' },
            { label: 'DoubleTake', value: 'DoubleTake' },
            { label: 'SQL Server Replication', value: 'SQL Server Replication' },
            { label: 'Acronis Disaster Recovery', value: 'Acronis Disaster Recovery' },
            { label: 'Rubrik', value: 'Rubrik' },
            { label: 'High Availability', value: 'High Availability' },
            { label: 'Disaster Recovery Planning', value: 'Disaster Recovery Planning' },
            { label: 'Failover', value: 'Failover' },
            { label: 'RTO/RPO', value: 'RTO/RPO' },
            { label: 'Backup Strategies', value: 'Backup Strategies' },
            { label: 'Business Continuity', value: 'Business Continuity' },
            { label: 'Geographical Redundancy', value: 'Geographical Redundancy' },
            { label: 'Data Replication', value: 'Data Replication' },
            { label: 'Clustering', value: 'Clustering' },
            { label: 'Active-Active', value: 'Active-Active' },
        ],
        'virtualization': [
            { label: 'VMware', value: 'VMware' },
            { label: 'Hyper-V', value: 'Hyper-V' },
            { label: 'KVM', value: 'KVM' },
            { label: 'Containers', value: 'Containers' },
            { label: 'Docker', value: 'Docker' },
            { label: 'Kubernetes', value: 'Kubernetes' },
            { label: 'OpenStack', value: 'OpenStack' },
            { label: 'Proxmox', value: 'Proxmox' },
            { label: 'VMware vSAN', value: 'VMware vSAN' },
            { label: 'Nutanix', value: 'Nutanix' },
            { label: 'VMware NSX', value: 'VMware NSX' },
            { label: 'VMware vSphere', value: 'VMware vSphere' },
            { label: 'Microsoft Hyper-V', value: 'Microsoft Hyper-V' },
            { label: 'Citrix XenDesktop', value: 'Citrix XenDesktop' },
            { label: 'VMware Horizon', value: 'VMware Horizon' },
            { label: 'Microsoft App-V', value: 'Microsoft App-V' },
            { label: 'Turbo.net', value: 'Turbo.net' },
            { label: 'VMware NSX', value: 'VMware NSX' },
            { label: 'Cisco ACI', value: 'Cisco ACI' },
            { label: 'VirtualBox', value: 'VirtualBox' },
            { label: 'HyperV', value: 'HyperV' },
        ],
        'cloudd': [
            { label: 'AWS', value: 'AWS' },
            { label: 'Azure', value: 'Azure' },
            { label: 'Google Cloud', value: 'Google Cloud' },
            { label: 'Cloud Services', value: 'Cloud Services' },
            { label: 'IaaS', value: 'IaaS' },
            { label: 'PaaS', value: 'PaaS' },
            { label: 'SaaS', value: 'SaaS' },
            { label: 'Cloud Migration', value: 'Cloud Migration' },
            { label: 'DevOps in Cloud', value: 'DevOps in Cloud' },
            { label: 'Kubernetes in Cloud', value: 'Kubernetes in Cloud' },
            { label: 'Serverless Computing', value: 'Serverless Computing' },
            { label: 'AWS Lambda', value: 'AWS Lambda' },
            { label: 'Azure Functions', value: 'Azure Functions' },
            { label: 'Heroku', value: 'Heroku' },
            { label: 'Red Hat OpenShift', value: 'Red Hat OpenShift' },
            { label: 'Salesforce', value: 'Salesforce' },
            { label: 'Microsoft 365', value: 'Microsoft 365' },
            { label: 'CloudHealth', value: 'CloudHealth' },
            { label: 'CloudCheckr', value: 'CloudCheckr' },
            { label: 'Alibaba', value: 'Alibaba' },
        ],
        'radio': [
            { label: 'Radio Communication', value: 'Radio Communication' },
            { label: 'Wireless Technologies', value: 'Wireless Technologies' },
            { label: 'Mobile Networks', value: 'Mobile Networks' },
            { label: 'RF Engineering', value: 'RF Engineering' },
            { label: 'Spectrum Management', value: 'Spectrum Management' },
            { label: '4G', value: '4G' },
            { label: '5G', value: '5G' },
            { label: 'LTE', value: 'LTE' },
            { label: 'Wi-Fi', value: 'Wi-Fi' },
            { label: 'Zigbee', value: 'Zigbee' },
            { label: 'LoRaWAN', value: 'LoRaWAN' },
            { label: 'Sigfox', value: 'Sigfox' },
            { label: 'Harris', value: 'Harris' },
            { label: 'Rohde & Schwarz', value: 'Rohde & Schwarz' },
            { label: 'ZaraRadio', value: 'ZaraRadio' },
            { label: 'SAM Broadcaster', value: 'SAM Broadcaster' },
            { label: 'DAB/DAB+', value: 'DAB/DAB+' },
            { label: 'FM/AM', value: 'FM/AM' },
            { label: 'Inmarsat', value: 'Inmarsat' },
            { label: 'Iridium', value: 'Iridium' },
        ],
        'IOT': [
            { label: 'MQTT', value: 'MQTT' },
            { label: 'CoAP', value: 'CoAP' },
            { label: 'Zigbee', value: 'Zigbee' },
            { label: 'Z-Wave', value: 'Z-Wave' },
            { label: 'LoRa', value: 'LoRa' },
            { label: 'Sigfox', value: 'Sigfox' },
            { label: 'AWS IoT', value: 'AWS IoT' },
            { label: 'Azure IoT', value: 'Azure IoT' },
            { label: 'Google Cloud IoT', value: 'Google Cloud IoT' },
            { label: 'AWS IoT Core', value: 'AWS IoT Core' },
            { label: 'Microsoft Azure IoT Hub', value: 'Microsoft Azure IoT Hub' },
            { label: 'Raspberry Pi', value: 'Raspberry Pi' },
            { label: 'Arduino', value: 'Arduino' },
            { label: 'CoAP', value: 'CoAP' },
            { label: 'EdgeX Foundry', value: 'EdgeX Foundry' },
            { label: 'Azure IoT Edge', value: 'Azure IoT Edge' },
        ],
        'mainframe': [
            { label: 'IBM z/OS', value: 'IBM z/OS' },
            { label: 'Unisys ClearPath', value: 'Unisys ClearPath' },
            { label: 'IBM DB2', value: 'IBM DB2' },
            { label: 'Adabas', value: 'Adabas' },
            { label: 'CICS', value: 'CICS' },
            { label: 'IMS', value: 'IMS' },
            { label: 'JCL', value: 'JCL' },
            { label: 'REXX', value: 'REXX' },
            { label: 'IBM Mainframe', value: 'IBM Mainframe' },
            { label: 'COBOL', value: 'COBOL' },
            { label: 'Mainframe Operations', value: 'Mainframe Operations' },
            { label: 'Legacy Systems', value: 'Legacy Systems' },
            { label: 'AS/400', value: 'AS/400' },
            { label: 'IBM z/VM', value: 'IBM z/VM' },
            { label: 'IBM z14', value: 'IBM z14' },
            { label: 'IBM z/OS Container Extensions', value: 'IBM z/OS Container Extensions' },
        ],
        'big_data': [
            { label: 'Hadoop', value: 'Hadoop' },
            { label: 'Spark', value: 'Spark' },
            { label: 'Tableau', value: 'Tableau' },
            { label: 'Power BI', value: 'Power BI' },
            { label: 'QlikView', value: 'QlikView' },
            { label: 'OBIEE', value: 'OBIEE' },
            { label: 'SSRS', value: 'SSRS' },
            { label: 'SSIS', value: 'SSIS' },
            { label: 'Data Warehousing', value: 'Data Warehousing' },
            { label: 'Data Lakes', value: 'Data Lakes' },
            { label: 'Apache Kafka', value: 'Apache Kafka' },
            { label: 'Apache Flink', value: 'Apache Flink' },
            { label: 'DataBricks', value: 'DataBricks' },
            { label: 'Snowflake', value: 'Snowflake' },
            { label: 'Teradata', value: 'Teradata' },
            { label: 'Redshift', value: 'Redshift' },
            { label: 'BigQuery', value: 'BigQuery' },
            { label: 'NoSQL', value: 'NoSQL' },
        ],
        'IA': [
            { label: 'TensorFlow', value: 'TensorFlow' },
            { label: 'PyTorch', value: 'PyTorch' },
            { label: 'Keras', value: 'Keras' },
            { label: 'Scikit-learn', value: 'Scikit-learn' },
            { label: 'AIaaS', value: 'AIaaS' },
            { label: 'Natural Language Processing', value: 'Natural Language Processing' },
            { label: 'Computer Vision', value: 'Computer Vision' },
            { label: 'Reinforcement Learning', value: 'Reinforcement Learning' },
            { label: 'Machine Learning', value: 'Machine Learning' },
            { label: 'Deep Learning', value: 'Deep Learning' },
            { label: 'Neural Networks', value: 'Neural Networks' },
            { label: 'Caffe', value: 'Caffe' },
            { label: 'Theano', value: 'Theano' },
            { label: 'MXNet', value: 'MXNet' },
        ],
        'machine_learning': [
            { label: 'Neural Networks', value: 'Neural Networks' },
            { label: 'Deep Learning', value: 'Deep Learning' },
            { label: 'GANs', value: 'GANs' },
            { label: 'SVM', value: 'SVM' },
            { label: 'Decision Trees', value: 'Decision Trees' },
            { label: 'Random Forests', value: 'Random Forests' },
            { label: 'Gradient Boosting', value: 'Gradient Boosting' },
            { label: 'Feature Engineering', value: 'Feature Engineering' },
            { label: 'Supervised Learning', value: 'Supervised Learning' },
            { label: 'Unsupervised Learning', value: 'Unsupervised Learning' },
            { label: 'Reinforcement Learning', value: 'Reinforcement Learning' },
            { label: 'k-NN', value: 'k-NN' },
            { label: 'Clustering Algorithms', value: 'Clustering Algorithms' },
            { label: 'Regression Analysis', value: 'Regression Analysis' },
            { label: 'Model Evaluation', value: 'Model Evaluation' },
            { label: 'AutoML', value: 'AutoML' },
            { label: 'SciPy', value: 'SciPy' },
            { label: 'NumPy', value: 'NumPy' },
            { label: 'Pandas', value: 'Pandas' },
            { label: 'Matplotlib', value: 'Matplotlib' },
            { label: 'Seaborn', value: 'Seaborn' },
            { label: 'XGBoost', value: 'XGBoost' },
            { label: 'LightGBM', value: 'LightGBM' },
        ],
        'bot': [
            { label: 'Rasa', value: 'Rasa' },
            { label: 'Wit.ai', value: 'Wit.ai' },
            { label: 'Customer Service Automation', value: 'Customer Service Automation' },
            { label: 'Chatbots', value: 'Chatbots' },
            { label: 'Virtual Assistants', value: 'Virtual Assistants' },
            { label: 'Dialogflow', value: 'Dialogflow' },
            { label: 'Microsoft Bot Framework', value: 'Microsoft Bot Framework' },
            { label: 'IBM Watson Assistant', value: 'IBM Watson Assistant' },
            { label: 'Amazon Lex', value: 'Amazon Lex' },
            { label: 'Chatbot Development Platforms', value: 'Chatbot Development Platforms' },
        ],
        'mining': [
            { label: 'Data Mining', value: 'Data Mining' },
            { label: 'Clustering', value: 'Clustering' },
            { label: 'Association Rule Learning', value: 'Association Rule Learning' },
            { label: 'Regression Analysis', value: 'Regression Analysis' },
            { label: 'Sentiment Analysis', value: 'Sentiment Analysis' },
            { label: 'Web Scraping', value: 'Web Scraping' },
            { label: 'Text Mining', value: 'Text Mining' },
            { label: 'Predictive Analytics', value: 'Predictive Analyticss' },
            { label: 'Data Preprocessing', value: 'Data Preprocessing' },
            { label: 'Association Rule Mining', value: 'Association Rule Mining' },
            { label: 'Classification', value: 'Classification' },
            { label: 'Social Network Analysis', value: 'Social Network Analysis' },
            { label: 'Weka', value: 'Weka' },
            { label: 'RapidMiner', value: 'RapidMiner' },
            { label: 'KNIME', value: 'KNIME' },
            { label: 'Orange', value: 'Orange' },
            { label: 'Data Mining Algorithms', value: 'Data Mining Algorithms' },
        ],
        'cybersecurity': [
            { label: 'Symantec Endpoint Protection', value: 'Symantec Endpoint Protection' },
            { label: 'CrowdStrike Falcon', value: 'CrowdStrike Falcon' },
            { label: 'Check Point Software', value: 'Check Point Software' },
            { label: 'Palo Alto Networks', value: 'Palo Alto Networks' },
            { label: 'Fortinet FortiGate', value: 'Fortinet FortiGate' },
            { label: 'Cisco ASA', value: 'Cisco ASA' },
            { label: 'Sophos', value: 'Sophos' },
            { label: 'Trend Micro', value: 'Trend Micro' },
            { label: 'ESET', value: 'ESET' },
            { label: 'FireEye', value: 'FireEye' },
            { label: 'Malwarebytes', value: 'Malwarebytes' },
            { label: 'Carbon Black Defense', value: 'Carbon Black Defense' },
            { label: 'SentinelOne', value: 'SentinelOne' },
            { label: 'Kaspersky Endpoint Security', value: 'Kaspersky Endpoint Security' },
            { label: 'McAfee Endpoint Security', value: 'McAfee Endpoint Security' },
            { label: 'Windows Defender', value: 'Windows Defender' },
        ],
        'cryptography': [
            { label: 'PKI Infrastructure', value: 'PKI Infrastructure' },
            { label: 'Hashing Algorithms (SHA)', value: 'Hashing Algorithms (SHA)' },
            { label: 'Hashing Algorithms (MD5)', value: 'Hashing Algorithms (MD5)' },
            { label: 'Symmetric-key Algorithms (AES)', value: 'Symmetric-key Algorithms (AES)' },
            { label: 'Symmetric-key Algorithms (DES)', value: 'Symmetric-key Algorithms (DES)' },
            { label: 'Asymmetric-key Algorithms (RSA)', value: 'FAsymmetric-key Algorithms (RSA)' },
            { label: 'Asymmetric-key Algorithms (DSA)', value: 'Asymmetric-key Algorithms (DSA)' },
            { label: 'Key Exchange Algorithms (Diffie-Hellman)', value: 'Key Exchange Algorithms (Diffie-Hellman)' },
            { label: 'Encryption Tools (VeraCrypt)', value: 'Encryption Tools (VeraCrypt)' },
            { label: 'Encryption Tools (AxCrypt)', value: 'Encryption Tools (AxCrypt)' },
            { label: 'Code Signing', value: 'Code Signing' },
            { label: 'Digital Certificates', value: 'Digital Certificates' },
            { label: 'HSMs (Hardware Security Modules)', value: 'HSMs (Hardware Security Modules)' },
            { label: 'SSL/TLS Protocols', value: 'SSL/TLS Protocols' },
            { label: 'Blockchain Technology', value: 'Blockchain Technology' },
            { label: 'Cryptographic Libraries (Crypto++)', value: 'Cryptographic Libraries (Crypto++)' },
            { label: 'Cryptographic Libraries (Bouncy Castle)', value: 'Cryptographic Libraries (Bouncy Castle)' },
            { label: 'SSH Keys Management', value: 'SSH Keys Management' },
            { label: 'Secure Boot', value: 'Secure Boot' },
            { label: 'Disk Encryption', value: 'Disk Encryption' },
            { label: 'Email Encryption (PGPS/MIME)', value: 'Email Encryption (PGPS/MIME)' },
        ],
        'vulnerabilites': [
            { label: 'OWASP ZAP', value: 'OWASP ZAP' },
            { label: 'Metasploit', value: 'Metasploit' },
            { label: 'Aircrack-ng', value: 'Aircrack-ng' },
            { label: 'John the Ripper', value: 'John the Ripper' },
            { label: 'Wireshark', value: 'Wireshark' },
            { label: 'Nmap', value: 'Nmap' },
            { label: 'Nessus Vulnerability Scanner', value: 'Nessus Vulnerability Scanner' },
            { label: 'Burp Suite', value: 'Burp Suite' },
            { label: 'SQLMap', value: 'SQLMap' },
            { label: 'Nikto', value: 'Nikto' },
            { label: 'Kali Linux Penetration Testing Tools', value: 'Kali Linux Penetration Testing Tools' },
            { label: 'OpenVAS', value: 'OpenVAS' },
            { label: 'Acunetix Web Vulnerability Scanner', value: 'Acunetix Web Vulnerability Scanner' },
            { label: 'QualysGuard', value: 'QualysGuard' },
            { label: 'Retina Network Security Scanner', value: 'Retina Network Security Scanner' },
            { label: 'Tenable.io', value: 'Tenable.io' },
        ],
        'risc': [
            { label: 'FAIR (Factor Analysis of Information Risk)', value: 'FAIR (Factor Analysis of Information Risk)' },
            { label: 'ISACA Risk IT Framework', value: 'ISACA Risk IT Framework' },
            { label: 'ISO 27005 Risk Management', value: 'ISO 27005 Risk Management' },
            { label: 'NIST Cybersecurity Framework', value: 'NIST Cybersecurity Framework' },
            { label: 'COSO ERM Framework', value: 'COSO ERM Framework' },
            { label: 'RiskLens', value: 'RiskLens' },
            { label: 'RSA Archer GRC', value: 'RSA Archer GRC' },
            { label: 'GRC Tools (MetricStream)', value: 'GRC Tools (MetricStream)' },
            { label: 'GRC Tools (LogicManager)', value: 'GRC Tools (LogicManager)' },
            { label: 'Risk Management Software (CURA)', value: 'Risk Management Software (CURA)' },
            { label: 'Risk Management Software (RiskWatch)', value: 'Risk Management Software (RiskWatch)' },
            { label: 'Threat Analysis Tools (ThreatConnect)', value: 'Threat Analysis Tools (ThreatConnect)' },
            { label: 'Gartner Magic Quadrant for IT Risk Management', value: 'Gartner Magic Quadrant for IT Risk Management' },
            { label: 'Skybox Security Risk Management', value: 'Skybox Security Risk Management' },
            { label: 'SolarWinds Risk Intelligence', value: 'SolarWinds Risk Intelligence' },
            { label: 'Dell Technologies (RSA) for Risk Management', value: 'Dell Technologies (RSA) for Risk Management' },
            { label: 'IBM OpenPages with Watson', value: 'IBM OpenPages with Watson' },
        ],
        'infra': [
            { label: 'Cisco Networking Devices', value: 'Cisco Networking Devices' },
            { label: 'Juniper Networks', value: 'Juniper Networks' },
            { label: 'Arista Networks', value: 'Arista Networks' },
            { label: 'Extreme Networks', value: 'Extreme Networks' },
            { label: 'HP Networking', value: 'HP Networking' },
            { label: 'Dell EMC Networking', value: 'Dell EMC Networking' },
            { label: 'VMware NSX', value: 'VMware NSX' },
            { label: 'Citrix ADC', value: 'Citrix ADC' },
            { label: 'F5 BIG-IP', value: 'F5 BIG-IP' },
            { label: 'Brocade Networking', value: 'Brocade Networking' },
            { label: 'AMikroTik Routers and Switches', value: 'MikroTik Routers and Switches' },
            { label: 'Ubiquiti Networks', value: 'Ubiquiti Networks' },
            { label: 'Aruba Networks', value: 'Aruba Networks' },
            { label: 'Check Point Security Appliances', value: 'Check Point Security Appliances' },
            { label: 'Palo Alto Networks Security Devices', value: 'Palo Alto Networks Security Devices' },
        ],
        'conformity': [
            { label: 'Compliance Software (NAVEX Global)', value: 'Compliance Software (NAVEX Global)' },
            { label: 'Compliance Software (ComplyWorks)', value: 'Compliance Software (ComplyWorks)' },
            { label: 'Regulatory Compliance (SOX)', value: 'Regulatory Compliance (SOX)' },
            { label: 'Regulatory Compliance (FISMA)', value: 'Regulatory Compliance (FISMA)' },
            { label: 'Dodd-Frank Compliance', value: 'Dodd-Frank Compliance' },
            { label: 'Healthcare Compliance (HIPAA HITECH Act)', value: 'Healthcare Compliance (HIPAA HITECH Act)' },
            { label: 'Sarbanes-Oxley Compliance', value: 'Sarbanes-Oxley Compliance' },
            { label: 'GDPR Compliance Solutions', value: 'GDPR Compliance Solutions' },
            { label: 'IT Compliance (COBIT ISO/IEC 27001)', value: 'IT Compliance (COBIT ISO/IEC 27001)' },
            { label: 'Environmental Compliance (EPA Regulations)', value: 'Environmental Compliance (EPA Regulations)' },
            { label: 'Labor Compliance (FLSA)', value: 'Labor Compliance (FLSA)' },
            { label: 'Labor Compliance (OSHA)', value: 'Labor Compliance (OSHA)' },
            { label: 'Educational Compliance (FERPA)', value: 'Educational Compliance (FERPA)' },
            { label: 'Banking Compliance (Basel III)', value: 'Banking Compliance (Basel III)' },
            { label: 'Banking Compliance (CRD IV)', value: 'Banking Compliance (CRD IV)' },
            { label: 'Compliance Tracking Software', value: 'Compliance Tracking Software' },
            { label: 'RegTech Solutions', value: 'RegTech Solutions' },
            { label: 'Automated Compliance Monitoring', value: 'Automated Compliance Monitoring' },
        ],
        'complicance': [
            { label: 'Compliance Management Platforms', value: 'Compliance Management Platforms' },
            { label: 'Policy Management Systems', value: 'Policy Management Systems' },
            { label: 'Audit Management Tools', value: 'Audit Management Tools' },
            { label: 'Incident Management Systems', value: 'Incident Management Systems' },
            { label: 'Case Management Solutions', value: 'Case Management Solutions' },
            { label: 'Document Control Systems', value: 'Document Control Systems' },
            { label: 'Training Management Systems', value: 'Training Management Systems' },
            { label: 'Compliance Analytics', value: 'Compliance Analytics' },
            { label: 'Ethics and Compliance Programs', value: 'Ethics and Compliance Programs' },
            { label: 'Third-party Risk Management', value: 'Third-party Risk Management' },
            { label: 'Data Privacy Management Tools', value: 'Data Privacy Management Tools' },
            { label: 'Corporate Compliance Software', value: 'Corporate Compliance Software' },
            { label: 'Legal Compliance Software', value: 'Legal Compliance Software' },
            { label: 'Financial Compliance Systems', value: 'Financial Compliance Systems' },
            { label: 'Quality Compliance Systems', value: 'Quality Compliance Systems' },
        ],
        'governance': [
            { label: 'Board Management Software', value: 'Board Management Software' },
            { label: 'Strategy Management Tools', value: 'Strategy Management Tools' },
            { label: 'Corporate Governance Software', value: 'Corporate Governance Software' },
            { label: 'IT Governance Solutions', value: 'IT Governance Solutions' },
            { label: 'Data Governance Tools', value: 'Data Governance Tools' },
            { label: 'Risk Governance Systems', value: 'Risk Governance Systems' },
            { label: 'Sustainability Governance Platforms', value: 'Sustainability Governance Platforms' },
            { label: 'Governance Risk Compliance (GRC) Platforms', value: 'Governance Risk Compliance (GRC) Platforms' },
            { label: 'Internal Audit Management', value: 'Internal Audit Management' },
            { label: 'Policy Governance Software', value: 'Policy Governance Software' },
            { label: 'Enterprise Governance Software', value: 'Enterprise Governance Software' },
            { label: 'Governance Assessment Tools', value: 'Governance Assessment Tools' },
            { label: 'Performance Governance Solutions', value: 'Performance Governance Solutions' },
            { label: 'Compliance Governance Tools', value: 'Compliance Governance Tools' },
            { label: 'Information Governance Solutions', value: 'Information Governance Solutions' },
        ],
        'ux_ui': [
            { label: 'Adobe XD', value: 'Adobe XD' },
            { label: 'Sketch', value: 'Sketch' },
            { label: 'Figma', value: 'Figma' },
            { label: 'InVision', value: 'InVision' },
            { label: 'Axure', value: 'Axure' },
            { label: 'Bootstrap', value: 'Bootstrap' },
            { label: 'Materialize', value: 'Materialize' },
            { label: 'Foundation', value: 'Foundation' },
            { label: 'Tailwind CSS', value: 'Tailwind CSS' },
            { label: 'UserTesting', value: 'UserTesting' },
            { label: 'Lookback.io', value: 'Lookback.io' },
            { label: 'UsabilityHub', value: 'UsabilityHub' },
            { label: 'Zeplin', value: 'Zeplin' },
            { label: 'Abstract', value: 'Abstract' },
        ],
        'coach_agile_devops': [
            { label: 'JIRA', value: 'JIRA' },
            { label: 'Trello', value: 'Trello' },
            { label: 'Asana', value: 'Asana' },
            { label: 'Monday.com', value: 'Monday.com' },
            { label: 'Scrum', value: 'Scrum' },
            { label: 'Kanban', value: 'Kanban' },
            { label: 'Lean', value: 'Lean' },
            { label: 'Slack', value: 'Slack' },
            { label: 'Microsoft Teams', value: 'Microsoft Teams' },
            { label: 'Confluence', value: 'Confluence' },
            { label: 'Jenkins', value: 'Jenkins' },
            { label: 'GitLab CI', value: 'GitLab CI' },
            { label: 'CircleCI', value: 'CircleCI' },
            { label: 'Travis CI', value: 'Travis CI' },
        ],
        'scrum_master': [
            { label: 'Certified ScrumMaster (CSM)', value: 'Certified ScrumMaster (CSM)' },
            { label: 'Professional Scrum Master (PSM)', value: 'Professional Scrum Master (PSM)' },
            { label: 'JIRA', value: 'JIRA' },
            { label: 'VersionOne', value: 'VersionOne' },
            { label: 'Rally', value: 'Rally' },
            { label: 'JIRA dashboards', value: 'JIRA dashboards' },
            { label: 'Smartsheet', value: 'Smartsheet' },
        ],
        'product_owner': [
            { label: 'JIRA', value: 'JIRA' },
            { label: 'Pivotal Tracker', value: 'Pivotal Tracker' },
            { label: 'Aha!', value: 'Aha!' },
            { label: 'ProdPad', value: 'ProdPad' },
            { label: 'Roadmunk', value: 'Roadmunk' },
            { label: 'Productboard', value: 'Productboard' },
            { label: 'UserVoice', value: 'UserVoice' },
        ],
        'lead': [
            { label: 'Leadership technique', value: 'Leadership technique' },
            { label: 'Lighthouse', value: 'Lighthouse' },
            { label: 'SonarQube', value: 'SonarQube' },
            { label: '.NET', value: '.NET' },
            { label: 'Node.js', value: 'Node.js' },
            { label: 'Angular', value: 'Angular' },
            { label: 'React', value: 'React' },
        ],
        'Ia': [
            { label: 'Azure Machine Learning', value: 'Azure Machine Learning' },
            { label: 'AWS SageMaker', value: 'AWS SageMaker' },
            { label: 'Google AI Platform', value: 'Google AI Platform' },
            { label: 'TensorFlow', value: 'TensorFlow' },
            { label: 'PyTorch', value: 'PyTorch' },
            { label: 'IBM SPSS', value: 'IBM SPSS' },
            { label: 'SAS Advanced Analytics', value: 'SAS Advanced Analytics' },
        ],
        'Bot': [
            { label: 'Dialogflow', value: 'Dialogflow' },
            { label: 'Microsoft Bot Framework', value: 'Microsoft Bot Framework' },
            { label: 'Rasa', value: 'Rasa' },
            { label: 'IBM Watson', value: 'IBM Watson' },
            { label: 'Wit.ai', value: 'Wit.ai' },
            { label: 'ManyChat', value: 'ManyChat' },
            { label: 'Chatfuel', value: 'Chatfuel' },
        ],
        'automation': [
            { label: 'UiPath', value: 'UiPath' },
            { label: 'Blue Prism', value: 'Blue Prism' },
            { label: 'Automation Anywhere', value: 'Automation Anywhere' },
            { label: 'Python', value: 'Python' },
            { label: 'Bash', value: 'Bash' },
            { label: 'PowerShell', value: 'PowerShell' },
            { label: 'Selenium', value: 'Selenium' },
            { label: 'Katalon Studio', value: 'Katalon Studio' },
            { label: 'TestComplete', value: 'TestComplete' },
        ],
        'cloud' : [
            { label: 'Amazon Web Services (AWS)', value: 'Amazon Web Services (AWS)' },
            { label: 'Microsoft Azure', value: 'Microsoft Azure' },
            { label: 'Google Cloud Platform (GCP)', value: 'Google Cloud Platform (GCP)' },
            { label: 'Heroku', value: 'Heroku' },
            { label: 'Red Hat OpenShift', value: 'Red Hat OpenShift' },
            { label: 'Kubernetes', value: 'Kubernetes' },
            { label: 'Docker Swarm', value: 'Docker Swarm' },
            { label: 'Amazon S3', value: 'Amazon S3' },
            { label: 'Google Cloud Storage', value: 'Google Cloud Storage' },
            { label: 'Azure Blob Storage', value: 'Azure Blob Storage' },
            { label: 'AWS Identity and Access Management (IAM)', value: 'AWS Identity and Access Management (IAM)' },
            { label: 'Azure Active Directory', value: 'Azure Active Directory' },
        ],
        'director': [
            { label: 'Microsoft Project', value: 'Microsoft Project' },
            { label: 'Smartsheet', value: 'Smartsheet' },
            { label: 'Wrike', value: 'Wrike' },
            { label: 'Trello', value: 'Trello' },
            { label: 'Asana', value: 'Asana' },
            { label: 'JIRA', value: 'JIRA' },
            { label: 'Monday.com', value: 'Monday.com' },
            { label: 'Slack', value: 'Slack' },
            { label: 'Microsoft Teams', value: 'Microsoft Teams' },
            { label: 'Excel', value: 'Excel' },
            { label: 'PowerPoint', value: 'PowerPoint' },
        ],
        'project_manager': [
            { label: 'JIRA', value: 'JIRA' },
            { label: 'Trello', value: 'Trello' },
            { label: 'Asana', value: 'Asana' },
            { label: 'Monday.com', value: 'Monday.com' },
            { label: 'Smartsheet', value: 'Smartsheet' },
            { label: 'Microsoft Project', value: 'Microsoft Project' },
            { label: 'Slack', value: 'Slack' },
            { label: 'Microsoft Teams', value: 'Microsoft Teams' },
            { label: 'Excel', value: 'Excel' },
            { label: 'PowerPoint', value: 'PowerPoint' },
        ],
        'coordinateur': [
            { label: 'Microsoft Project', value: 'Microsoft Project' },
            { label: 'Smartsheet', value: 'Smartsheet' },
            { label: 'Wrike', value: 'Wrike' },
            { label: 'Trello', value: 'Trello' },
            { label: 'Asana', value: 'Asana' },
            { label: 'JIRA', value: 'JIRA' },
            { label: 'Monday.com', value: 'Monday.com' },
            { label: 'Slack', value: 'Slack' },
            { label: 'Microsoft Teams', value: 'Microsoft Teams' },
            { label: 'Excel', value: 'Excel' },
            { label: 'PowerPoint', value: 'PowerPoint' },
        ],
        'master': [
            { label: 'JIRA', value: 'JIRA' },
            { label: 'Scrum', value: 'Scrum' },
            { label: 'Kanban', value: 'Kanban' },
            { label: 'Lean', value: 'Lean' },
            { label: 'VersionOne', value: 'VersionOne' },
            { label: 'Rally', value: 'Rally' },
            { label: 'Trello', value: 'Trello' },
            { label: 'Asana', value: 'Asana' },
            { label: 'Slack', value: 'Slack' },
            { label: 'Microsoft Teams', value: 'Microsoft Teams' },
        ],
        'prodOwner': [
            { label: 'JIRA', value: 'JIRA' },
            { label: 'Pivotal Tracker', value: 'Pivotal Tracker' },
            { label: 'Aha!', value: 'Aha!' },
            { label: 'ProdPad', value: 'ProdPad' },
            { label: 'Roadmunk', value: 'Roadmunk' },
            { label: 'Productboard', value: 'Productboard' },
            { label: 'UserVoice', value: 'UserVoice' },
        ],
        'ItMang': [
            { label: 'ITIL', value: 'ITIL' },
            { label: 'COBIT', value: 'COBIT' },
            { label: 'ISO 27001', value: 'ISO 27001' },
            { label: 'TOGAF', value: 'TOGAF' },
            { label: 'Prince2', value: 'Prince2' },
            { label: 'Agile', value: 'Agile' },
            { label: 'DevOps', value: 'DevOps' },
            { label: 'Leadership', value: 'Leadership' },
        ],
        'auditor': [
            { label: 'Audit Tools', value: 'Audit Tools' },
            { label: 'ISO 9001', value: 'ISO 9001' },
            { label: 'ISO 27001', value: 'ISO 27001' },
            { label: 'ISO 20000', value: 'ISO 20000' },
            { label: 'ISO 14001', value: 'ISO 14001' },
            { label: 'COSO Framework', value: 'COSO Framework' },
            { label: 'Risk Assessment', value: 'Risk Assessment' },
            { label: 'Compliance Audits', value: 'Compliance Audits' },
        ],
        'trainer': [
            { label: 'Training Management Systems', value: 'Training Management Systems' },
            { label: 'Learning Management Systems (LMS)', value: 'Learning Management Systems (LMS)' },
            { label: 'Classroom Training', value: 'Classroom Training' },
            { label: 'Online Training', value: 'Online Training' },
            { label: 'Certification Programs', value: 'Certification Programs' },
        ],
        'methAg': [
            { label: 'Scrum', value: 'Scrum' },
            { label: 'Kanban', value: 'Kanban' },
            { label: 'Lean', value: 'Lean' },
            { label: 'SAFe (Scaled Agile Framework)', value: 'SAFe (Scaled Agile Framework)' },
            { label: 'LeSS (Large Scale Scrum)', value: 'LeSS (Large Scale Scrum)' },
            { label: 'DSDM (Dynamic Systems Development Method)', value: 'DSDM (Dynamic Systems Development Method)' },
            { label: 'Agile Manifesto', value: 'Agile Manifesto' },
        ],
        'process_improvement': [
            { label: 'ITIL', value: 'ITIL' },
            { label: 'Lean Six Sigma', value: 'Lean Six Sigma' },
            { label: 'Kaizen', value: 'Kaizen' },
            { label: 'PDCA (Plan-Do-Check-Act)', value: 'PDCA (Plan-Do-Check-Act)' },
            { label: 'Continuous Improvement Tools', value: 'Continuous Improvement Tools' },
            { label: 'Value Stream Mapping', value: 'Value Stream Mapping' },
        ],
        'amelTransformation': [
            { label: 'Change Management', value: 'Change Management' },
            { label: 'Change Models', value: 'Change Models' },
            { label: 'Change Communication', value: 'Change Communication' },
            { label: 'Change Resistance', value: 'Change Resistance' },
            { label: 'Change Impact Assessment', value: 'Change Impact Assessment' },
        ],
        'orgEntreprise': [
            { label: 'Organizational Development', value: 'Organizational Development' },
            { label: 'Organizational Design', value: 'Organizational Design' },
            { label: 'Organizational Culture', value: 'Organizational Culture' },
            { label: 'Organizational Change Management', value: 'Organizational Change Management' },
        ],
        'gouvernance': [
            { label: 'COBIT', value: 'COBIT' },
            { label: 'ITIL', value: 'ITIL' },
            { label: 'ISO 38500', value: 'ISO 38500' },
            { label: 'Corporate Governance', value: 'Corporate Governance' },
            { label: 'IT Governance', value: 'IT Governance' },
            { label: 'Governance Frameworks', value: 'Governance Frameworks' },
            { label: 'Governance Policies', value: 'Governance Policies' },
        ],
        'MOA_MOE': [
            { label: 'Business Analysis Tools', value: 'Business Analysis Tools' },
            { label: 'Requirements Gathering Tools', value: 'Requirements Gathering Tools' },
            { label: 'Use Case Diagrams', value: 'OUse Case Diagrams' },
            { label: 'OBusiness Process Modeling Tools', value: 'Business Process Modeling Tools' },
        ],
        'pmo': [
            { label: 'Project Management Office Tools', value: 'Project Management Office Tools' },
            { label: 'Portfolio Management', value: 'Portfolio Management' },
            { label: 'Project Portfolio Management (PPM) Software', value: 'Project Portfolio Management (PPM) Software' },
        ],
        'Lead': [
            { label: 'Leadership Techniques', value: 'Leadership Techniques' },
            { label: 'Leadership Training', value: 'Leadership Training' },
            { label: 'Leadership Models', value: 'Leadership Models' },
            { label: 'Leadership Styles', value: 'Leadership Styles' },
        ],
        'coach': [
            { label: 'Coaching Models', value: 'Coaching Models' },
            { label: 'Coaching Frameworks', value: 'Coaching Frameworks' },
            { label: 'Coaching Tools', value: 'Coaching Tools' },
            { label: 'Executive Coaching', value: 'Executive Coaching' },
            { label: 'Leadership Coaching', value: 'Leadership Coaching' },
        ],
        'ux_ui_designer': [
            { label: 'Adobe XD', value: 'Adobe XD' },
            { label: 'Sketch', value: 'Sketch' },
            { label: 'Figma', value: 'Figma' },
            { label: 'InVision', value: 'InVision' },
            { label: 'Axure RP', value: 'Axure RP' },
            { label: 'Balsamiq', value: 'Balsamiq' },
            { label: 'Usability Testing', value: 'Usability Testing' },
            { label: 'User Research', value: 'User Research' },
            { label: 'Wireframing', value: 'Wireframing' },
            { label: 'Prototyping', value: 'Prototyping' },
        ],
        'web_integration': [
            { label: 'HTML5', value: 'HTML5' },
            { label: 'CSS3', value: 'CSS3' },
            { label: 'JavaScript', value: 'JavaScript' },
            { label: 'Bootstrap', value: 'Bootstrap' },
            { label: 'jQuery', value: 'jQuery' },
            { label: 'React', value: 'React' },
            { label: 'Angular', value: 'Angular' },
            { label: 'Vue.js', value: 'Vue.js' },
            { label: 'Front-end Frameworks', value: 'Front-end Frameworks' },
            { label: 'Responsive Design', value: 'Responsive Design' },
            { label: 'Cross-Browser Compatibility', value: 'Cross-Browser Compatibility' },
        ],
        'seo': [
            { label: 'Google Analytics', value: 'Google Analytics' },
            { label: 'Google Search Console', value: 'Google Search Console' },
            { label: 'Moz', value: 'Moz' },
            { label: 'SEMrush', value: 'SEMrush' },
            { label: 'Ahrefs', value: 'Ahrefs' },
            { label: 'Yoast SEO', value: 'Yoast SEO' },
            { label: 'Keyword Research', value: 'Keyword Research' },
            { label: 'On-Page Optimization', value: 'On-Page Optimization' },
            { label: 'Backlink Analysis', value: 'Backlink Analysis' },
            { label: 'SEO Auditing', value: 'SEO Auditing' },
        ],

    };

    selectedSegment: string | null = null;
    selectedSousSegments: string[] = [];
    filteredSousSegments: any[] = [];
    selectedTechno: string[] = [];
    filteredTechno: any[] = [];


    constructor(
        private route: ActivatedRoute,
        private candidatService: CandidatService ,
        private countryService: CountryService,
        private languageService: LanguageService,
        private messageService: MessageService,
        private http: HttpClient ,
        private router:Router,
        private encryptionService:EncryptionServiceService

    ) {
        this.statut = [
            { label: 'Indépendant', value: 'independant' },
            { label: 'Salarié', value: 'salarie' },
            { label: 'Portage', value: 'portage' },
            { label: 'Partenaire', value: 'partenaire' },
            { label: 'Ouvert au CDI', value: 'ouvert_cdi' }
        ];
        this.preavis = [
            { label: 'ASAP', value: 'ASAP' },
            { label: '< 1 Mois', value: '< 1 mois' },
            { label: 'Entre 2 et 3 mois', value: 'Entre 2 et 3 mois' },
            { label: '> 3 mois', value: '> 3 mois' },
        ];
    }

    ngOnInit(): void {
        console.warn(this.formData1.langues)
        console.warn(this.formData1.certifications)
        console.warn(this.formData1.langues)


        this.states = [
            { label: 'A Traiter', value: 'ATraiter' },
            { label: 'En cours de qualification', value: 'EnCoursDeQualification' },
            { label: 'Vivier', value: 'Vivier' },
            { label: 'Top Vivier', value: 'TopVivier' },
            { label: 'Validé', value: 'Validé' },
            { label: 'Ressource', value: 'Ressource' },
            { label: 'Sortie Prochaine', value: 'SortieProchaine' },
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
        this.countryService.getCountries().then(data => {
            this.countries = data.map(country => ({
                label: country.name,
                value: country.code,
                code: country.code // for flag display
            }));
        });

        // Fetch countries from the service
        this.languageService.getLanguage().then(data => {
            this.languages = data.map(language => ({
                label: language.name,
                value: language.code,
                code: language.code // for flag display

            }));
        });
    }

    addFormation() {


        this.formData1.formations.push({
            titre: '',
            etablissement: '',
            anneeObtention: null,
            pays: null,
            commentaire: '',
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
        this.formData1.langues.push({
            name: '',
            lev: '',
            commentaire: '',
        });
    }

    addExperience() {


        this.formData1.experiences.push({
            titre: '',
            client: '',
            dateDeb: '',
            dateFin:'',
            description:'',});
    }
    addReference() {

        this.formData1.referencesClients.forEach(r => r.showDetails = false);

        this.formData1.referencesClients.push({
            refer: '',
            showDetails: true
        });
    }
    addTechnologie() {

        this.technologies.forEach(t => t.showDetails = false);

        this.technologies.push({
            id:'',
            name: '',
            value: '',
            anneesExperiences:null,
            showDetails: true
        });
    }
    removeTechnologie(index: number) {
        if (this.technologies.length > 1) {
            this.technologies.splice(index, 1);
        }
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
    removeReference(index: number) {
        if (this.formData1.referencesClients.length > 1) {
            this.formData1.referencesClients.splice(index, 1);
        }
    }

    toggleExperience(index: number) {
        // Collapse all certifications first
        this.experiences.forEach((l, i) => {
            l.showDetails = i === index ? !l.showDetails : false; // Toggle the clicked one, collapse others
        });
    }

    toggleLangue(index: number) {
        // Collapse all certifications first
        this.langues.forEach((l, i) => {
            l.showDetails = i === index ? !l.showDetails : false; // Toggle the clicked one, collapse others
        });
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

    toggleFormation(index: number) {
        // Collapse all certifications first
        this.formations.forEach((f, i) => {
            f.showDetails = i === index ? !f.showDetails : false; // Toggle the clicked one, collapse others
        });
    }

    toggleCertification(index: number) {
        // Collapse all formations first
        this.certifications.forEach((c, i) => {
            c.showDetails = i === index ? !c.showDetails : false; // Toggle the clicked one, collapse others
        });
    }


    private mapEnumToOptions(enumObj: any) {
        return Object.keys(enumObj).map(key => ({
            label: enumObj[key],
            value: enumObj[key]
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





    onStepChange(event: MenuItem) {
        const index = this.routeItems.findIndex(item => item === event);

        if (index !== -1) {
            this.stepIndex = index;
            this.activeStep = this.routeItems[index];
        }
    }

    filterCountries(event: any) {
        const query = event.query.toLowerCase();
        this.filteredCountries = this.countries.filter(country =>
            country.label.toLowerCase().includes(query)
        );
    }

    filterLanguage(event: any) {
        const query = event.query.toLowerCase();
        this.filteredLanguages = this.languages.filter(language =>
            language.label.toLowerCase().includes(query)
        );
    }


    onFileSelect(event: any, type: 'imgFile' | 'cvFile' | 'cvNessFile'): void {
        this.isFileSelected[type] = true;
        if (event && event.files && event.files.length > 0) {
            const selectedFile = event.files[0];
            if (type === 'imgFile') {
                this.profilePictureFiles = [selectedFile];
            } else if (type === 'cvFile') {
                this.uploadedFiles = [selectedFile];
            }
            else if (type === 'cvNessFile') {
                this.uploadedFiles = [selectedFile];
            }
        }
    }

    onFileUpload(event: any, type: 'imgFile' | 'cvFile' | 'cvNessFile'): void {
        this.isUploading[type] = true;

        // Vérification et traitement pour l'image de profil
        if (type === 'imgFile' && this.profilePictureFiles && this.profilePictureFiles.length > 0) {
            console.log('Uploading Profile Picture:', this.profilePictureFiles[0]);
        }

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








    // Method to filter candidate's technologies based on the enum
    filterTechnologies(candidateTechnologies: any[], technologyEnum: any): string[] {
        if (!candidateTechnologies || candidateTechnologies.length === 0) {
            return [];
        }

        // Return a list of technologies that match the enum values
        return candidateTechnologies.map(tech => technologyEnum[tech]).filter(Boolean);
    }


    onCountrySelect(event: any) {
        this.formData1.nationalite = event?.value.label || '';
        console.error(event?.value.label)
    }

    onLanguageSelect(event: any) {
        this.formData1.nationalite = event?.value.label || '';
        console.error(event?.value.label)
    }


    // Method to handle JSON file import
    onFileImport(event: any): void {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                try {
                    const jsonData = JSON.parse(e.target.result);  // Parse the file content to JSON
                    this.populateForm(jsonData);  // Call the populateForm method with JSON data
                } catch (err) {
                    console.error('Error parsing JSON:', err);
                }
            };
            reader.readAsText(file);  // Read the file as text
        }
    }



    // Method to populate the form with JSON data
    populateForm(data: any): void {
        // Populate Step 1: Information Générale
        this.formData1.nom = data.nom || '';
        this.formData1.prenom = data.prenom || '';
        this.formData1.email = data.email || '';
        this.formData1.emailSecondaire = data.emailSecondaire || '';

        this.formData1.password = data.password || '';

        // // Populate Step 2: Pièces Jointes
        // this.formData1.imgFile = data.imgFile || '';
        // this.formData1.cvFile = data.cvFile || '';

        // Populate Step 3: Détails du Poste
        this.formData1.titre = data.titre || '';
        this.formData1.tjmMin = data.tjmMin || 0;
        this.formData1.tjmSouhaite = data.tjmSouhaite || 0;
        this.formData1.salaireMin = data.salaireMin || 0;
        this.formData1.salaireSouhaite = data.salaireSouhaite || 0;

        // Populate Step 4: Coordonnées
        this.formData1.telephone = data.telephone || '';
        this.formData1.adresse = data.adresse || '';
        this.formData1.ville = data.Ville || '';
        this.formData1.codePostal = data.codePostal || '';
        this.formData1.nationalite = data.nationalite || '';
        this.formData1.tjm = data.tjm || '';


        // Populate Step 5: Niveau et disponibilité candidat
        this.formData1.niveau = data.niveau || '';
        this.formData1.disponibilite = data.disponibilite || '';
        // this.formData1.lastLogin=data.lastLogin ||null;

        // Populate Step 6: Technologies Maîtrisées
        // this.formData1.webFrontTechnologies = data.webFrontTechnologies || [];
        // this.formData1.webBackTechnologies = data.webBackTechnologies || [];
        // this.formData1.apiTechnologies = data.apiTechnologies || [];
        // this.formData1.devOpsTechnologies = data.devOpsTechnologies || [];
        // this.formData1.mobileTechnologies = data.mobileTechnologies || [];
        // this.formData1.blockchainTechnologies = data.blockchainTechnologies || [];
        // this.formData1.iaTechnologies = data.iaTechnologies || [];
        // //this.formData1.iotTechnologies = data.iotTechnologies || [];
        // this.formData1.lowCodeNoCodeTechnologies = data.lowCodeNoCodeTechnologies || [];

        // Populate Step 7: Département
        this.formData1.departement = data.departement || '';
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

                },
                error: (error: any) => {
                    console.error('Error:', error);
                }
            });
        }
    }

    // Mapping Data with scrapped data starts here

    onCVUpload(event: any): void {
        const file = event.target?.files ? event.target.files[0] : null;  // Vérifie si les fichiers existent

        if (file && file.type === 'application/pdf') {
            const formData = new FormData();
            formData.append('file', file);

            // Appelle le service pour télécharger le fichier et analyser le CV
            this.uploadCV(formData);
        } else {
            this.messageService.add({ severity: 'warn', summary: 'Invalid File', detail: 'Please upload a valid PDF file.' });
        }
    }


    // uploadCV(formData: FormData) {
    //     const apiUrl = '/api/v2/parse-cv';  // Use the local proxy '/api' path
    //     this.loading = true;  // Stop the loader when the request finishes
    //     this.http.post(apiUrl, formData).subscribe({
    //         next: (response: any) => {
    //             this.loading = false;  // Stop the loader when the request finishes
    //             console.warn('API Response:', response);
    //             this.populateFormFromCV(response);  // Call method to populate form
    //         },
    //         error: (error: any) => {
    //             this.loading = false;  // Stop the loader when the request finishes
    //             console.error('Error uploading CV:', error);
    //             this.messageService.add({ severity: 'error', summary: 'Error', detail: 'CV upload failed.' });
    //         }
    //     });
    // }

    // Populate form fields from the API response
    populateFormFromCV(data: any): void {
        // Step 1: Information Générale
        this.formData1.nom = data.utilisateur?.nom || '';
        this.formData1.prenom = data.utilisateur?.prenom || '';
        this.formData1.email = data.utilisateur?.email || '';

        // Step 3: Détails du Poste
        this.formData1.titre = data.titre || '';
        this.formData1.telephone = data.telephone || '';
        this.formData1.adresse = data.adresse || '';

        // Step 4: Langues
        // this.formData1.langues = data.langues.map((lang: any) => ({
        //     name: lang.name,
        //     level: lang.level
        // })) || [];

        // Populate other sections as needed
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'CV data imported successfully.' });
    }
    // Mapping Data with scrapped data ends here


    ///////////////////////RATING STARTS HERE/////////////////////
    addRating(rateValue:number,id:number) {
        console.log(rateValue);
        console.log("id",id)
        this.candidatService.addRating( rateValue,id).subscribe((data) => {
        })
    }
    addRatingLangue(rateValue:number,id:number) {
        console.log(rateValue);
        console.log("idLanguage",id)
        this.candidatService.addRatingLangue( rateValue,id).subscribe((data) => {
        })
    }


    ///////////////////////////RATING ENDS HERE/////////////////////////////////////////
    trackByFn(index: number, item: any): any {
        return item ? item.id : undefined;
    }


    onSegmentChange(event: any, referentielIndex: number): void {
        console.log('Segment selected:', event.value, 'Referentiel index:', referentielIndex);

        // Mettre à jour la liste des sous-segments correspondant au segment sélectionné
        this.filteredSousSegments[referentielIndex] = this.sousSegmentsMap[event.value] || [];

        // Réinitialiser les sous-segments et technologies
        // this.formData1.referentiels[referentielIndex].sousSegments = [];
        this.filteredTechno[referentielIndex] = [];
    }


    onTechnoChange(event: any, referentielIndex: number): void {
        console.log('Sous-segments selected:', event.value, 'Referentiel index:', referentielIndex);
        let allTechnologies: Set<any> = new Set();

        // Vérifiez que des sous-segments ont été sélectionnés
        if (event.value && event.value.length > 0) {
            event.value.forEach((sousSegment: any) => {
                const technologiesForSousSegment = this.technologiesMap[sousSegment] || [];
                technologiesForSousSegment.forEach(techno => allTechnologies.add(techno));
            });
        }
        this.filteredTechno[referentielIndex] = Array.from(allTechnologies);
        console.log('Filtered technologies:', this.filteredTechno[referentielIndex]);
    }






    uploadCV(formData: FormData) {
        const apiUrl = '/api/v2/parse-cv';
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
                    console.log('API Response:', event.body);
                    this.populateFormFromCV1(event.body);  // Appelle la méthode pour remplir le formulaire
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



    populateFormFromCV1(data: any): void {
        // Étape 1: Information Générale
        this.formData1.nom = data.utilisateur?.nom || '';
        this.formData1.prenom = data.utilisateur?.prenom || '';
        this.formData1.email = data.utilisateur?.email || '';
        this.formData1.titre = data.titre || '';
        this.formData1.telephone = data?.telephone || '';
        this.formData1.adresse = data?.adresse || '';

        // Initialiser les référentiels
        // this.formData1.referentiels = [{
        //     id: null,
        //     segments: [],
        //     sousSegments: [],
        //     technologie: [],
        //     profil: [],
        //     candidat: null
        // }];

        // Étape 2: Mapper les technologies
        if (Array.isArray(data.technologies)) {
            //  const existingReferentiel = this.formData1.referentiels[0]; // On suppose qu'il n'y a qu'un seul référentiel

            // data.technologies.forEach((tech: any) => {
            //     if (tech && tech.name) {
            //         const sousSegmentMap = this.mapSousSegmentFromTechnology(tech.name);
            //         const segmentValue = sousSegmentMap ? this.getSegmentFromSousSegment(sousSegmentMap.sousSegment) : null;
            //
            //         // Ajouter la sélection du segment si elle n'existe pas déjà
            //         if (segmentValue && existingReferentiel.segments !== segmentValue) {
            //             existingReferentiel.segments = segmentValue;
            //         }
            //
            //         // Ajouter le sous-segment uniquement s'il a été mappé et n'existe pas déjà
            //         if (sousSegmentMap) {
            //             if (!existingReferentiel.sousSegments.some(ss => ss.value === sousSegmentMap.sousSegment)) {
            //                 existingReferentiel.sousSegments.push({
            //                     label: sousSegmentMap.label,
            //                     value: sousSegmentMap.sousSegment // Assurez-vous d'ajouter la valeur ici pour éviter les doublons
            //                 });
            //             }
            //         } else {
            //             // Si le sous-segment n'existe pas, ajouter la technologie sans segment ou sous-segment
            //             if (!existingReferentiel.technologie.includes(tech.name)) {
            //                 existingReferentiel.technologie.push(tech.name);
            //             }
            //         }
            //     }
            // });


        }
        // this.formData1.referentiels = Array.isArray(data.technologies) ? data.technologies.map((tech: any) => ({
        //
        //         segments: this.getSegmentFromSousSegment(this.mapSousSegmentFromTechnology(tech.name)?.sousSegment)||'',
        //         sousSegments: this.mapSousSegmentFromTechnology(tech.name)?.sousSegment ||'',
        //         profil: [],
        //         technologie: tech.name,
        //
        // })) : [];

        // Mapper les langues
        this.formData1.langues = Array.isArray(data.langues) ? data.langues.map((lang: any) => ({
            name: lang.name,
            level: lang.level
        })) : [];

        // Mapper les formations
        this.formData1.formations = Array.isArray(data.formations) ? data.formations.map((form: any) => ({
            titre: form.titre,
            etablissement: form.etablissement,
            commentaire: form.commentaire,
            pays: form.pays,
            anneeObtention: form.anneeObtention,
        })) : [];

        // Mapper les certifications
        this.formData1.certifications = Array.isArray(data.certifications) ? data.certifications.map((cert: any) => ({
            titreCertif: cert.titre,
            etablissementCertif: cert.etablissement,
            paysCertif: cert.pays,
            anneeObtentionCertif: cert.dateObtention?.match(/^\d{4}/)?.[0] || '',
        })) : [];

        // Mapper les expériences
        this.formData1.experiences = Array.isArray(data.experiences) ? data.experiences.map((exp: any) => ({
            titre: exp.titre,
            description: exp.description,
            client: exp.client,
            dateFin: exp.dateFin,
            dateDeb: exp.dateDebut,
        })) : [];

        // Message de succès
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'CV data imported successfully.' });

        this.onSubmit1();
    }





    getLabelFromValue(value: string): string | undefined {
        for (const segment in this.sousSegmentsMap) {
            const sousSegments = (this.sousSegmentsMap)[segment];
            const found = sousSegments.find(s => s.value === value);
            if (found) {
                return found.label; // Retourner le label si une correspondance est trouvée
            }
        }
        return undefined; // Retourner undefined si aucune correspondance n'est trouvée
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
    onSubmit(candidatureForm: NgForm): void {
        if (candidatureForm.valid) {
            const formData = new FormData();

            // Ajouter les données simples de formData1
            formData.append('nom', this.formData1.nom || '');
            formData.append('prenom', this.formData1.prenom || '');
            formData.append('email', this.formData1.email || '');
            formData.append('emailSecondaire', this.formData1.emailSecondaire || '');
            formData.append('password', this.formData1.password || '');
            formData.append('titre', this.formData1.titre || '');
            formData.append('telephone', this.formData1.telephone || '');
            formData.append('adresse', this.formData1.adresse || '');
            formData.append('ville', this.formData1.ville || '');
            formData.append('niveau', this.formData1.niveau || '');
            formData.append('codePostal', this.formData1.codePostal || '');
            formData.append('nationalite', this.formData1.nationalite || '');
            formData.append('departement', this.formData1.departement || '');

            // Ajouter la disponibilité + 1 jour
            const disponibiliteStr = this.formData1.disponibilite instanceof Date
                ? new Date(this.formData1.disponibilite.setDate(this.formData1.disponibilite.getDate() + 1)).toISOString().split('T')[0]
                : this.formData1.disponibilite || '';
            formData.append('disponibilite', disponibiliteStr);

            // Ajouter les fichiers
            if (this.uploadedFiles && this.uploadedFiles.length > 0) {
                formData.append('cvFile', this.uploadedFiles[0]);
            }

            // Ajouter les formations
            this.formData1.formations.forEach((formation, index) => {
                formData.append(`formations[${index}].titre`, formation.titre || '');
                formData.append(`formations[${index}].etablissement`, formation.etablissement || '');
                formData.append(`formations[${index}].commentaire`, formation.commentaire || '');
                formData.append(`formations[${index}].pays`, formation.pays || '');
                formData.append(`formations[${index}].anneeObtention`, formation.anneeObtention || '');
            });

            // Ajouter les langues
            this.formData1.langues.forEach((langue, index) => {
                formData.append(`langues[${index}].name`, langue.name || '');
                formData.append(`langues[${index}].lev`, langue.lev || '');
                formData.append(`langues[${index}].commentaire`, langue.commentaire || '');
            });

            // Ajouter les certifications
            this.formData1.certifications.forEach((certification, index) => {
                formData.append(`certifications[${index}].titreCertif`, certification.titreCertif || '');
                formData.append(`certifications[${index}].etablissementCertif`, certification.etablissementCertif || '');
                formData.append(`certifications[${index}].commentaireCertif`, certification.commentaireCertif || '');
                formData.append(`certifications[${index}].paysCertif`, certification.paysCertif || '');
                formData.append(`certifications[${index}].anneeObtentionCertif`, certification.anneeObtentionCertif || '');
            });

            // Ajouter les expériences
            this.formData1.experiences.forEach((experience, index) => {
                formData.append(`experiences[${index}].titre`, experience.titre || '');
                formData.append(`experiences[${index}].dateDeb`, experience.dateDeb || '');
                formData.append(`experiences[${index}].dateFin`, experience.dateFin || '');
                formData.append(`experiences[${index}].client`, experience.client || '');
                formData.append(`experiences[${index}].description`, experience.description || '');
            });

            // Ajouter les référentiels
            // this.formData1.referentiels.forEach((referentiel, index) => {
            //     formData.append(`referentiels[${index}].segments`, referentiel.segments || '');
            //
            //     // Itérer sur sousSegments (tableau)
            //     if (referentiel.sousSegments && referentiel.sousSegments.length > 0) {
            //         referentiel.sousSegments.forEach((segment, segIndex) => {
            //             formData.append(`referentiels[${index}].sousSegments[${segIndex}]`, segment.label || '');
            //         });
            //     }
            //
            //     // Itérer sur profil (tableau)
            //     if (referentiel.profil && referentiel.profil.length > 0) {
            //         referentiel.profil.forEach((prof, profIndex) => {
            //             formData.append(`referentiels[${index}].profil[${profIndex}]`, prof || '');
            //         });
            //     }
            //
            //     // Itérer sur technologie (tableau)
            //     if (referentiel.technologie && referentiel.technologie.length > 0) {
            //         referentiel.technologie.forEach((techno, techIndex) => {
            //             formData.append(`referentiels[${index}].technologie[${techIndex}]`, techno || '');
            //         });
            //     }
            // });


            // Ajouter les autres champs
            formData.append('dossierCompetences', this.formData1.dossierCompetences ? 'true' : 'false');
            formData.append('dateMissions', this.formData1.dateMissions ? 'true' : 'false');
            formData.append('formatWord', this.formData1.formatWord ? 'true' : 'false');
            formData.append('habilitable', this.formData1.habilitable ? 'true' : 'false');
            formData.append('jesaispas', this.formData1.jesaispas ? 'true' : 'false');
            formData.append('infosAClarifier', this.formData1.infosAClarifier || '');
            formData.append('comments', this.formData1.comments || '');

            // Ajouter les champs relatifs aux gammes (tjm, salaire, etc.)
            if (this.formData1?.tjmMin) {
                formData.append('tjmMin', this.formData1.tjmMin.toString());
            }
            if (this.formData1?.tjmSouhaite) {
                formData.append('tjmSouhaite', this.formData1.tjmSouhaite.toString());
            }
            if (this.formData1?.salaireMin) {
                formData.append('salaireMin', this.formData1.salaireMin.toString());
            }
            if (this.formData1?.salaireSouhaite) {
                formData.append('salaireSouhaite', this.formData1.salaireSouhaite.toString());
            }

            // Appeler le service pour créer le candidat
            this.candidatService.createCandidat(formData).subscribe({
                next: (response: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Candidat Created' });
                },
                error: (err: any) => {
                    this.candidatService.showError(err);
                    this.showError = true;
                    setTimeout(() => {
                        this.showError = false;
                    }, 2000);
                }
            });
        } else {
            this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Form is invalid' });
        }
    }


    onSubmit1(): void {
        // Création d'un FormData
        const formData = new FormData();

        // Ajouter les données simples de formData1
        Object.keys(this.formData1).forEach(key => {
            if (Array.isArray(this.formData1[key])) {
                this.formData1[key].forEach((item, index) => {
                    Object.keys(item).forEach(subKey => {
                        formData.append(`${key}[${index}].${subKey}`, item[subKey] || '');
                    });
                });
            } else {
                // Vérification des valeurs avant d'ajouter au formData
                const value = this.formData1[key];
                if (typeof value === 'boolean') {
                    formData.append(key, value ? 'true' : 'false');
                } else if (typeof value === 'number') {
                    formData.append(key, isNaN(value) ? '0' : value.toString());
                } else {
                    formData.append(key, value || '');
                }
            }
        });

        // Ajouter les formations
        // this.formData1.formations.forEach((formation, index) => {
        //     formData.append(`formations[${index}].titre`, formation.titre || '');
        //     formData.append(`formations[${index}].etablissement`, formation.etablissement || '');
        //     formData.append(`formations[${index}].commentaire`, formation.commentaire || '');
        //     formData.append(`formations[${index}].pays`, formation.pays || '');
        //     formData.append(`formations[${index}].anneeObtention`, formation.anneeObtention || '');
        // });
        //
        // // Ajouter les langues
        // this.formData1.langues.forEach((langue, index) => {
        //     formData.append(`langues[${index}].name`, langue.name || '');
        //     formData.append(`langues[${index}].lev`, langue.lev || '');
        //     formData.append(`langues[${index}].commentaire`, langue.commentaire || '');
        // });
        //
        // // Ajouter les certifications
        // this.formData1.certifications.forEach((certification, index) => {
        //     formData.append(`certifications[${index}].titreCertif`, certification.titreCertif || '');
        //     formData.append(`certifications[${index}].etablissementCertif`, certification.etablissementCertif || '');
        //     formData.append(`certifications[${index}].commentaireCertif`, certification.commentaireCertif || '');
        //     formData.append(`certifications[${index}].paysCertif`, certification.paysCertif || '');
        //     formData.append(`certifications[${index}].anneeObtentionCertif`, certification.anneeObtentionCertif || '');
        // });
        //
        // // Ajouter les expériences
        // this.formData1.experiences.forEach((experience, index) => {
        //     formData.append(`experiences[${index}].titre`, experience.titre || '');
        //     formData.append(`experiences[${index}].dateDeb`, experience.dateDeb || '');
        //     formData.append(`experiences[${index}].dateFin`, experience.dateFin || '');
        //     formData.append(`experiences[${index}].client`, experience.client || '');
        //     formData.append(`experiences[${index}].description`, experience.description || '');
        // });

        // Ajouter les référentiels
        // Ajouter les référentiels
        // Ajouter les référentiels
        // this.formData1.referentiels.forEach((referentiel, index) => {
        //     // Vérifier si le segment a été sélectionné
        //     // if (referentiel.segments) {
        //     //     const selectedSegmentValue = referentiel.segments; // Récupérer la valeur sélectionnée
        //     //     const selectedSegment = this.segments.find(seg => seg.value === selectedSegmentValue);
        //
        //     //     if (selectedSegment) {
        //     //         const segmentLabel = selectedSegment.label; // Récupérer le label basé sur la valeur
        //     //
        //     //         // Vider la valeur précédente et affecter la nouvelle
        //     //         referentiel.segments = segmentLabel; // Affecter uniquement le nouveau label
        //     //         formData.append(`referentiels[${index}].segments`, segmentLabel); // Ajouter uniquement le label
        //     //     }
        //     // }
        //
        //     // Itérer sur sousSegments (tableau)
        //     if (referentiel.sousSegments && referentiel.sousSegments.length > 0) {
        //         referentiel.sousSegments.forEach((segment, segIndex) => {
        //             formData.append(`referentiels[${index}].sousSegments[${segIndex}]`, segment.label || '');
        //         });
        //     }
        //
        //     // Itérer sur profil (tableau)
        //     if (referentiel.profil && referentiel.profil.length > 0) {
        //         referentiel.profil.forEach((prof, profIndex) => {
        //             formData.append(`referentiels[${index}].profil[${profIndex}]`, prof || '');
        //         });
        //     }
        //
        //     // Itérer sur technologie (tableau)
        //     if (referentiel.technologie && referentiel.technologie.length > 0) {
        //         referentiel.technologie.forEach((techno, techIndex) => {
        //             formData.append(`referentiels[${index}].technologie[${techIndex}]`, techno || '');
        //         });
        //     }
        // });


        // Ajouter les fichiers
        if (this.uploadedFiles && this.uploadedFiles.length > 0) {
            formData.append('cvFile', this.uploadedFiles[0]);
        }

        // Appeler le service pour créer le candidat
        this.candidatService.createCandidat(formData).subscribe({
            next: (response: any) => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Candidat Created' });
                const id = response.id; // Assurez-vous que 'id' est bien une chaîne valide
                if (id) {
                    const encryptedId = this.encryptionService.encryptId(id.toString());
                    this.redirectUpdate(encryptedId);
                    // Attendre 2 secondes avant de rediriger
                    // setTimeout(() => {
                    //     this.redirectUpdate(encryptedId);
                    // }, 2000);
                } else {
                    console.error('Invalid ID received');
                }


            },
            error: (err: any) => {
                this.candidatService.showError(err);
                this.showError = true;
                setTimeout(() => {
                    this.showError = false;
                }, 2000);
            }
        });
    }



    redirectUpdate(id: string) {
        const url = `/back-office/candidat/edit/${id}`;
        console.log('Redirecting to:', url);  // Vérifier l'URL dans la console
        this.router.navigate([url]);    }

}
