package nesstechnologies.fr.applicationesnbackend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@ToString(exclude = {"profilReferentiels", "candidat", "besoin"})
public class Referentiel implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ElementCollection
    private  List<String> segments;
    @ElementCollection
    private List<String> sousSegments;
    @ElementCollection
    private List<String> technologie;

    @OneToMany(mappedBy = "referentiel", cascade = CascadeType.ALL,orphanRemoval = true)
    private List<ProfilReferentiel> profilReferentiels;

    @JsonIgnore
    @ManyToOne
    private Candidat candidat;

    @OneToOne(mappedBy = "referentiel")
    private Besoins besoin;



}
