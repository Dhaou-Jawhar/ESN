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
public class Segment implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String segmentKey;
    private String segmentValue;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "statistiques_profil_id", nullable = false)
    private StatistiquesProfil statistiquesProfil;

}
