package nesstechnologies.fr.applicationesnbackend.dto;
import lombok.*;
import nesstechnologies.fr.applicationesnbackend.entities.Societe;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientSimpleDTO {
    private Integer id;
    private LocalDateTime dateDerniereMiseAJour;
    private LocalDateTime dateDeCreation;
    private String manager;
    private boolean isAmbassadeur;
    private String secteur;
    private String localisation;
    private String genre;
    private String nom;
    private String prenom;

    private String poste;

    private String email;
    private String emailSecondaire;
    private long telephonePrso;
    private long telephonePro;
    private String statut;
    private float intimiteClient;
    private String commentaireProfilsRecherches;
    private String Personnalite;
    private String modeDeFonctionnement;
    private List<String> preferenceDeCommunication;
    private OrganigrammeDTO organigramme;
    private ReferentielDTO referentiel;
    private LinkedInDTO linkedIn;
    private ProspectionDTO prospection;
    private List<BesoinsDTO> besoins;
    private List<ActionsSimpleDTO> actions;
    private Societe societe;


}
