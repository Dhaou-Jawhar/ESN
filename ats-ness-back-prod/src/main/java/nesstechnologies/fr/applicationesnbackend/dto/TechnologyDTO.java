package nesstechnologies.fr.applicationesnbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TechnologyDTO {
    private Integer id;
    private String name;
    private float anneesExperiences;
    private Integer candidatId; // Référence à l'ID du candidat
    private List<RatingDTO> ratings; // Liste des ratings associés
}
