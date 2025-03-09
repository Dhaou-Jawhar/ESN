package nesstechnologies.fr.applicationesnbackend.entities;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;
import nesstechnologies.fr.applicationesnbackend.enumerations.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString(exclude = {"formations","certifications","langues","experiences","statistiquesProfil"})

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")

public class Candidat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "utilisateur_id", referencedColumnName = "id")
    private utilisateur utilisateur;

    private LocalDateTime dateDerniereMiseAJour;

    private LocalDateTime dateDeCreation;
    private String titre;
    private Double tjmMin;
    private Double tjmSouhaite;

    private Double salaireMin;
    private Double salaireSouhaite;

    // Gestion du CV
    private String CVUrl; // URL du CV original stocké
    private String PictureUrl; // URL du CV au format Ness Technology
    private String CVNess; // URL du CV NESS TECHNOLOGIES    stocké

    // Contact
    private String nom;
    private String prenom;
    private String email;
    private String emailSecondaire;
    private String telephone;
    private String responsable;
    private LocalDateTime creationDateTime;
    private String description;
    private String commentaireGeneralite;

    // Nationalité et localisation
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
    private  int Salaire;
    private String preavis;
    private String souhaitsCandidat;
    private float dureeTrajet;
    private float dureeGarePrincipale;
    private String disponibilite;
    private String departementTrajet;
    @ElementCollection
    @CollectionTable(name = "client_references", joinColumns = @JoinColumn(name = "candidat_id"))
    @Column(name = "reference")
    private List<String> referencesClients = new ArrayList<>();
    @Enumerated(EnumType.STRING)
    private EtatCandidat etat;
    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private Niveau niveau;
    @Enumerated(EnumType.STRING)
    private StatusCandidat statusCandidat;



    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL)
    private List<Rating> ratings;
    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL)
    private List<Technology> ratedTechnologies = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "candidat", cascade = CascadeType.ALL)
    private List<Formations> formations = new ArrayList<>();

    @OneToMany(mappedBy = "candidat", cascade = CascadeType.ALL)
    private List<Profil> profils ;
    @OneToMany(mappedBy = "candidat", cascade = CascadeType.ALL)
    private List<Langues> langues = new ArrayList<>();
    @OneToMany(mappedBy = "candidat", cascade = CascadeType.ALL)
    private List<Referentiel> referentiels = new ArrayList<>();

    @OneToOne(mappedBy = "candidat", cascade = CascadeType.ALL)
    private StatistiquesProfil statistiquesProfil;

    @JsonManagedReference
    @OneToMany(mappedBy = "candidat", cascade = CascadeType.ALL)
    private List<Certifications> certifications = new ArrayList<>();
    @OneToMany(mappedBy = "candidat1", cascade = CascadeType.ALL)
    private List<Experiences> experiences = new ArrayList<>();
    @Enumerated(EnumType.STRING)
    private Civilite civilite;
    // Technologies maîtrisées (sous segments) via Enums



    @OneToMany(mappedBy = "candidat", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonBackReference(value = "candidat-actions")
    private List<Actions> actions = new ArrayList<>();



    // Getters et Setters pour profils
    public List<Profil> getProfils() {
        return profils;
    }

    public void setProfils(List<Profil> profils) {
        this.profils = profils;
    }



    public void addLangue(Langues langue) {
        langues.add(langue);
        langue.setCandidat(this);
    }

    public void removeLangue(Langues langue) {
        langues.remove(langue);
        langue.setCandidat(null);
    }


    public void addAction(Actions action) {
        actions.add(action);
        action.setCandidat(this);
    }

    public void removeAction(Actions action) {
        actions.remove(action);
        action.setCandidat(null);
    }

}


