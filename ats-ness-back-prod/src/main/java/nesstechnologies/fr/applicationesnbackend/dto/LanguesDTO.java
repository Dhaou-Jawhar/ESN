package nesstechnologies.fr.applicationesnbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LanguesDTO {
    private Integer id;
    private String name;        // Nom de la langue
    private String lev;         // Niveau (par exemple : débutant, intermédiaire, avancé)
    private String commentaire; // Commentaire supplémentaire
    private Integer candidatId; // Référence à l'ID du candidat associé
}
