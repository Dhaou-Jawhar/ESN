package nesstechnologies.fr.applicationesnbackend.dto;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BesoinsTechnologiesDTO {

    private Integer id;
    private String technologie;
    private String niveau;
    private String importance;
    private int anneesExperience;
}
