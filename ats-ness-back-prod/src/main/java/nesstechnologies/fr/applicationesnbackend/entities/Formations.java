package nesstechnologies.fr.applicationesnbackend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Formations {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private  String titre;
    private  String etablissement;
    private  String commentaire;
    private  String pays;

    private  String anneeObtention;


    @JsonBackReference
    @ManyToOne
    private Candidat candidat;


}
