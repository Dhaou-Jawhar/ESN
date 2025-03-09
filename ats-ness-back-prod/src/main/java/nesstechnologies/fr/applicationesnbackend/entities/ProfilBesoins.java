package nesstechnologies.fr.applicationesnbackend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import nesstechnologies.fr.applicationesnbackend.enumerations.Niveau;

import java.io.Serializable;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProfilBesoins implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Lob
    @Column(columnDefinition = "LONGTEXT") // ou "LONGTEXT" si vous avez besoin de stocker de très longues descriptions
    private String difficultes;

    @Enumerated(EnumType.STRING)
    private Niveau seniorite;
    private Integer anneesExperienceTotales;
    private Integer tjmMinEstime;
    private Integer tjmMaxEstime;
    private Integer tjmMax;
    private Integer tjmMin;
    private Integer tjmSouhaite;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String avantages;

    @Lob
    @Column(columnDefinition = "LONGTEXT") // ou "LONGTEXT" si vous avez besoin de stocker de très longues descriptions
    private String commentaire;
    @OneToOne(cascade = CascadeType.ALL)
    private Besoins besoins;
}
