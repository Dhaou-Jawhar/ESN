package nesstechnologies.fr.applicationesnbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingDTO {
    private Integer id;
    private float value;
    private LocalDateTime ratedAt;
    private Integer candidatId; // Référence à l'ID du candidat
    private Integer technologyId; // Référence à l'ID de la technologie
    private Integer languesId; // Référence à l'ID de la langue
    private Integer besoinsId; // Référence à l'ID des besoins
}
