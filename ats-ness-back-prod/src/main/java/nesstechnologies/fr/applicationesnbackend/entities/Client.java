package nesstechnologies.fr.applicationesnbackend.entities;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.BatchSize;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Client implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private LocalDateTime dateDerniereMiseAJour;
    private LocalDateTime dateDeCreation;
    private String manager;
    private boolean isAmbassadeur;
    private String secteur;
    private String localisation;
    private String genre;
    private String nom;
    private String prenom;
    private String poste;
    private String email;
    private String emailSecondaire;
    private long telephonePrso;
    private long telephonePro;
    private String statut;
    private float intimiteClient;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private  String commentaireProfilsRecherches;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private  String Personnalite;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private  String modeDeFonctionnement;

    @ElementCollection
    @CollectionTable(name = "client_preferences")
    @Column(name = "preference")
    private List<String> preferenceDeCommunication;



    @OneToOne(cascade = CascadeType.ALL)
    private Organigramme organigramme;
    @OneToOne(cascade = CascadeType.ALL)
    private Referentiel referentiel;
    @ManyToOne
    @JoinColumn(name = "societe_id")
    @JsonBackReference
    private Societe societe;

    @OneToOne(cascade = CascadeType.ALL)
    private LinkedIn linkedIn;
    @OneToOne(cascade = CascadeType.ALL)
    private Prospection prospection;


    @OneToMany(mappedBy = "client", fetch = FetchType.EAGER)
    private List<Besoins> besoins;




    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonBackReference(value = "client-actions")
    private List<Actions> actions = new ArrayList<>();




    public void addAction(Actions action) {
        actions.add(action);
        action.setClient(this);
    }

    public void removeAction(Actions action) {
        actions.remove(action);
        action.setClient(null);
    }



}
