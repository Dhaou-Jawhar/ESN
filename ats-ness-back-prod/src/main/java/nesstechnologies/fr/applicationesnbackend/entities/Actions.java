package nesstechnologies.fr.applicationesnbackend.entities;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")

public class Actions implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private LocalDateTime dateMiseAJour;
    private LocalDateTime dateDeCreation;
    private String manager;
    private String type;
    private boolean relance;
    private String etatPersonneConcerne;
    private String actionPour;

    private boolean prochainRdvPlanifie;
    private LocalDateTime dateProchainRdvPlanifie;
    private int satisfactionMission;
    @Lob
    @Column(columnDefinition = "LONGTEXT") // ou "LONGTEXT" si vous avez besoin de stocker de très longues descriptions
    private String commentaires;
    private int satisfactionNessTechnologies;
    @Lob
    @Column(columnDefinition = "LONGTEXT") // ou "LONGTEXT" si vous avez besoin de stocker de très longues descriptions
    private String commentairesNessTechnologies;

    @ManyToOne()
    @JsonIgnore
    private Client client;


    @ManyToOne()
    @JsonIgnore
    private Candidat candidat;


    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinColumn(name = "besoin_id", nullable = true)
   // @JsonIgnore
    private Besoins besoin;




}
