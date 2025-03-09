package nesstechnologies.fr.applicationesnbackend.dto;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProspectionDTO {
    private Integer id;
    private Integer nbrAppels;
    private Integer nbrMails;
    private LocalDateTime datePremiereAction;
    private LocalDateTime dateDerniereAction;
    private Integer nbrJoursDepuisDerniereAction;
    private boolean ajoutLinkedIn;
    private LocalDateTime dateAjoutLinkedIn;
    private boolean linkedInAccepte;
    private LocalDateTime dateAcceptationLinkedIn;
    private boolean mailLinkedInEnvoye;
    private LocalDateTime dateEnvoiMailLinkedIn;
}
