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
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString(exclude = "clients")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Societe implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private LocalDateTime dateDeCreation;
    private LocalDateTime dateDeDerniereMiseAJour;

    private String logo;
    private String nom;
    private String societeMere;
    private String adresse;
    private float capitalSocial;
    private String rcs;
    private String villeRcs;
    private int siret;
    private String secteur;

    @ElementCollection
    private List<String> organigramme;
    @OneToMany(mappedBy = "societe", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Besoins> besoins;

    @OneToMany(mappedBy = "societe")
    @JsonManagedReference
    private List<Client> clients;



}