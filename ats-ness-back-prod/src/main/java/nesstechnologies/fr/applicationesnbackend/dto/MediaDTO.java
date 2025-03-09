package nesstechnologies.fr.applicationesnbackend.dto;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

public class MediaDTO {
    private Integer id;
    private String name;
    private String imagenUrl;
    private String codeImage;
    public MediaDTO(String name, String imagenUrl, String codeImage) {
        this.name = name;
        this.imagenUrl = imagenUrl;
        this.codeImage = codeImage; // Note the correction here
    }

}
