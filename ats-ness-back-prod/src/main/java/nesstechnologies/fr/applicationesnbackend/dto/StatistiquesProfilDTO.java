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
public class StatistiquesProfilDTO {
    private Integer id;

    private List<SegmentDTO> segments;

    private List<SousSegmentDTO> sousSegments;

    private List<TechnologieDTO> technologie;


    private Integer candidatId;
}