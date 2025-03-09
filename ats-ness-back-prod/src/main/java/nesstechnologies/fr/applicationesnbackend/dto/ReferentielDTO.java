package nesstechnologies.fr.applicationesnbackend.dto;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReferentielDTO {
    private Integer id;
    private List<String> segments;
    private List<String> sousSegments;
    private List<String> technologie;
    private List<ProfilReferentielDTO> profilReferentiels; // Nouvelle relation ajoutée

}
