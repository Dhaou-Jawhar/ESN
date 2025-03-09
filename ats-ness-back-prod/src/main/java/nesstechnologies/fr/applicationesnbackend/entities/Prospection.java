package nesstechnologies.fr.applicationesnbackend.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Prospection implements Serializable { @Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Integer id;
    @JsonProperty("nbrAppels")
    private Integer nbrAppels;
    @JsonProperty("nbrMails")
    private Integer nbrMails;
    @JsonProperty("datePremiereAction")
    private LocalDateTime datePremiereAction;
    @JsonProperty("dateDerniereAction")
    private LocalDateTime dateDerniereAction;
    @JsonProperty("nbrJoursDepuisDerniereAction")
    private Integer nbrJoursDepuisDerniereAction;
    @JsonProperty("ajoutLinkedIn")
    private boolean ajoutLinkedIn;
    @JsonProperty("dateajoutLinkedIn")
    private LocalDateTime dateajoutLinkedIn;
    @JsonProperty("linkedInAccepte")
    private boolean LinkedqInAccepte;
    @JsonProperty("dateAcceptationLinkedIn")
    private LocalDateTime dateAcceptationLinkedIn;
    @JsonProperty("mailLinkedInEnvoye")
    private boolean mailLinkedInEnvoye;
    @JsonProperty("dateEnvoiMailLinkedIn")
    private LocalDateTime dateEnvoiMailLinkedIn;

}
