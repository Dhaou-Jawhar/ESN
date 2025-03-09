package nesstechnologies.fr.applicationesnbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SegmentDTO {
    private Integer id;
    private String segmentKey;
    private String segmentValue;
}
