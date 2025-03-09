package nesstechnologies.fr.applicationesnbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfilDTO {
    private Integer id;
    private String nom;
    private String lien;
    private Integer candidatId; // Référence à l'ID du candidat associé
}
