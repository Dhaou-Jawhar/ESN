package nesstechnologies.fr.applicationesnbackend.entities;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder

public class Besoins implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private LocalDateTime dateDerniereMiseAJour;
    private LocalDateTime dateDeCreation;
    private String titre;
    private String reference;
    private String AoSow;
    private String descriptifUrl; // URL du CV original stocké
    private String etat;
    private String plateforme;

    private boolean besoinEnAvanceDePhase;
    private boolean reccurent;
    private boolean demarrageASAP;
    private LocalDateTime dateDeDemarrage;
    private boolean habilitable;
    @OneToOne(orphanRemoval = true, cascade = CascadeType.ALL)
    private ProfilBesoins profilBesoins ;
    @OneToOne
    private Media qrCodeImage;
    @ManyToOne
    private Client client;
    @ManyToOne
    @JoinColumn(name = "societe_id")
    @JsonBackReference
    private Societe societe;


    @OneToMany(mappedBy = "besoins", cascade = CascadeType.ALL)
    private List<Rating> intimiteClient;

    @OneToOne(cascade = CascadeType.ALL)
    private Referentiel referentiel;

    @OneToMany(mappedBy = "besoin", cascade = CascadeType.ALL)
    private List<BesoinsTechnologies> besoinsTechnologies = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "besoin", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Actions> actions = new ArrayList<>();


}
