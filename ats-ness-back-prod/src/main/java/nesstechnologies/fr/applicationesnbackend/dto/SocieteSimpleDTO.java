package nesstechnologies.fr.applicationesnbackend.dto;
import lombok.*;
import nesstechnologies.fr.applicationesnbackend.entities.Besoins;
import nesstechnologies.fr.applicationesnbackend.entities.Client;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocieteSimpleDTO {

    private Integer id;
    private LocalDateTime dateDeCreation;
    private LocalDateTime dateDeDerniereMiseAJour;
    private String logo;
    private String nom;
    private String societeMere;
    private String adresse;
    private float capitalSocial;
    private String rcs;
    private String villeRcs;
    private int siret;
    private String secteur;

    private List<String> organigramme;


}
