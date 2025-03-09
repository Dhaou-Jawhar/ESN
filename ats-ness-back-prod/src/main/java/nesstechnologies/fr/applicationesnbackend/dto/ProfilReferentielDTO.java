package nesstechnologies.fr.applicationesnbackend.dto;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfilReferentielDTO {
    private Integer id;
    private String profil;
    private String niveau;
}
