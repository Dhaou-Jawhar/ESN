package nesstechnologies.fr.applicationesnbackend.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocieteDTO {

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
    // Inclure la liste des besoins
    private List<BesoinsDTO> besoins;

    // Inclure la liste des clients
    private List<ClientSimpleDTO> clients;
}
