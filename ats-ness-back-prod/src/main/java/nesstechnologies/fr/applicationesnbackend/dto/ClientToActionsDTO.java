package nesstechnologies.fr.applicationesnbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nesstechnologies.fr.applicationesnbackend.entities.Societe;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientToActionsDTO {
    private Integer id;
    private LocalDateTime dateDerniereMiseAJour;
    private LocalDateTime dateDeCreation;
    private String nom;
    private String prenom;
    private String email;
    private String poste;

    private String emailSecondaire;
    private long telephonePrso;
    private long telephonePro;
}
