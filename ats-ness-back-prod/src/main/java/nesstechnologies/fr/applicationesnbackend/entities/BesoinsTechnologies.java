package nesstechnologies.fr.applicationesnbackend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;


@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder

public class BesoinsTechnologies  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String technologie;
    private String niveau;
    private String importance;
    private int anneesExperience;




    @JsonIgnore
    @ManyToOne
    private Besoins besoin;

}
