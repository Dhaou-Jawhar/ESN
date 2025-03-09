package nesstechnologies.fr.applicationesnbackend.dto;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BesoinsDTO {

    private Integer id;
    private LocalDateTime dateDerniereMiseAJour;
    private LocalDateTime dateDeCreation;
    private String titre;
    private String reference;
    private String AoSow;
    private String descriptifUrl;
    private String etat;
    private String plateforme;
    private boolean besoinEnAvanceDePhase;
    private boolean reccurent;
    private boolean demarrageASAP;
    private LocalDateTime dateDeDemarrage;
    private boolean habilitable;
    private ProfilBesoinsDTO profilBesoins;
    private MediaDTO qrCodeImage;
    private ReferentielDTO referentiel;
    private List<BesoinsTechnologiesDTO> besoinsTechnologies;
    private Integer societeId;

}
