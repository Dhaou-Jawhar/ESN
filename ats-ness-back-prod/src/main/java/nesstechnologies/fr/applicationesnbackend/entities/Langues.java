package nesstechnologies.fr.applicationesnbackend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@ToString
public class Langues implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private  String name;
    private  String lev;
    private  String commentaire;

    @OneToMany(mappedBy = "langues", cascade = CascadeType.ALL)
    private List<Rating> ratings;

    @JsonIgnore
    @ManyToOne
    private Candidat candidat;
}
