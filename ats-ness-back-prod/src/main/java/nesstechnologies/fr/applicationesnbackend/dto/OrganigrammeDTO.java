package nesstechnologies.fr.applicationesnbackend.dto;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganigrammeDTO {
    private Integer id;
    private List<String> serviceNiveau;
    private int tailleEquipe;
    private int pourcentageDePrestation;
}
