package nesstechnologies.fr.applicationesnbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificationsDTO {
    private Integer id;                 // Identifiant unique de la certification
    private String titreCertif;         // Titre de la certification
    private String etablissementCertif; // Établissement ou organisation ayant délivré la certification
    private String commentaireCertif;   // Commentaire ou description détaillée de la certification
    private String paysCertif;          // Pays où la certification a été obtenue
    private String anneeObtentionCertif; // Année d'obtention de la certification
    private Integer candidatId;         // Référence à l'ID du candidat associé
}
