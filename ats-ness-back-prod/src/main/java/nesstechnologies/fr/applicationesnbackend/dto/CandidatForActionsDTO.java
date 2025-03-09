package nesstechnologies.fr.applicationesnbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nesstechnologies.fr.applicationesnbackend.enumerations.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidatForActionsDTO {
    private Integer id;
   // private UtilisateurDTO utilisateur;
    private LocalDateTime dateDerniereMiseAJour;
    private LocalDateTime dateDeCreation;
    private String titre;
    private String nom;
    private String prenom;

}

