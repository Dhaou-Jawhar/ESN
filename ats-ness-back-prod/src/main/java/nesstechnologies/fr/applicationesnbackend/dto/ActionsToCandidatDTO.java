package nesstechnologies.fr.applicationesnbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActionsToCandidatDTO {
    private Integer id;
    private LocalDateTime dateMiseAJour;
    private LocalDateTime dateDeCreation;
    private String manager;
    private String type;
    private String actionPour;
    private boolean relance;
    private String etatPersonneConcerne;
    private boolean prochainRdvPlanifie;
    private LocalDateTime dateProchainRdvPlanifie;
    private int satisfactionMission;
    private String commentaires;
    private int satisfactionNessTechnologies;
    private String commentairesNessTechnologies;

}
