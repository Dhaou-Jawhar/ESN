package nesstechnologies.fr.applicationesnbackend.entities;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class SousSegment implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // Clé primaire auto-incrémentée

    private String sousSegmentKey;
    private String sousSegmentValue;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "statistiques_profil_id", nullable = false)
    private StatistiquesProfil statistiquesProfil;

}
