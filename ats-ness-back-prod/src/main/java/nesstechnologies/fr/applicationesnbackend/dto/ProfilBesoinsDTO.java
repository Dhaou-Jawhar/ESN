package nesstechnologies.fr.applicationesnbackend.dto;
import lombok.*;
import nesstechnologies.fr.applicationesnbackend.enumerations.Niveau;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfilBesoinsDTO {
    private Integer id;
    private String difficultes;
    private Niveau seniorite;
    private Integer anneesExperienceTotales;
    private Integer tjmMinEstime;
    private Integer tjmMaxEstime;
    private Integer tjmMax;
    private Integer tjmMin;
    private Integer tjmSouhaite;
    private String avantages;
    private String commentaire;
}
