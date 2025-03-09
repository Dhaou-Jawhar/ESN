package nesstechnologies.fr.applicationesnbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExperiencesDTO {
    private Integer id;
    private String titre;        // Titre du poste ou rôle
    private String dateDeb;      // Date de début de l'expérience
    private String dateFin;      // Date de fin de l'expérience
    private String client;       // Nom du client ou de l'entreprise
    private String description;  // Description détaillée de l'expérience
    private Integer candidatId;  // Référence à l'ID du candidat associé
}
