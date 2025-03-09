package nesstechnologies.fr.applicationesnbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nesstechnologies.fr.applicationesnbackend.enumerations.Civilite;
import nesstechnologies.fr.applicationesnbackend.enumerations.EtatCandidat;
import nesstechnologies.fr.applicationesnbackend.enumerations.Niveau;
import nesstechnologies.fr.applicationesnbackend.enumerations.StatusCandidat;

import java.time.LocalDateTime;
import java.util.List;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidatDTO {
    private Integer id;
    // private UtilisateurDTO utilisateur;
    private LocalDateTime dateDerniereMiseAJour;
    private LocalDateTime dateDeCreation;
    private String titre;
    private Double tjmMin;
    private Double tjmSouhaite;
    private Double salaireMin;
    private Double salaireSouhaite;
    private String CVUrl;
    private String PictureUrl;
    private String CVNess;
    private String nom;
    private String prenom;
    private String email;
    private String emailSecondaire;
    private String telephone;
    private String responsable;
    private LocalDateTime creationDateTime;
    private String description;
    private String commentaireGeneralite;
    private String nationalite;
    private String adresse;
    private String complement;
    private String codePostal;
    private String departement;
    private String ville;
    private boolean isAmbassadeur;
    private boolean ecouteDuMarche;
    private boolean cvAJour;
    private boolean dossierCompetences;
    private boolean dateMissions;
    private boolean formatWord;
    private boolean habilitable;
    private boolean jesaispas;
    private String Jobboard;
    private String infosAClarifier;
    private String comments;
    private int TJM;
    private int Salaire;
    private String preavis;
    private String souhaitsCandidat;
    private float dureeTrajet;
    private float dureeGarePrincipale;
    private String disponibilite;
    private String departementTrajet;
    private List<String> referencesClients;
    private EtatCandidat etat;
    private Niveau niveau;
    private StatusCandidat statusCandidat;
    private List<RatingDTO> ratings;
    private List<TechnologyDTO> ratedTechnologies;
    private List<FormationsDTO> formations;
    private List<ProfilDTO> profils;
    private List<LanguesDTO> langues;
    private List<ReferentielDTO> referentiels;
    private List<CertificationsDTO> certifications;
    private List<ExperiencesDTO> experiences;
    private Civilite civilite;
    private List<ActionsToCandidatDTO> actions;
    private StatistiquesProfilDTO statestiquesProfil;

}
