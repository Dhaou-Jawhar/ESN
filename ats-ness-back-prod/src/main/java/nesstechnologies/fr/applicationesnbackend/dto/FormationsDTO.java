package nesstechnologies.fr.applicationesnbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FormationsDTO {
    private Integer id;
    private String titre;
    private String etablissement;
    private String commentaire;
    private String pays;
    private String anneeObtention;
    private Integer candidatId; // Référence à l'ID du candidat associé
}
