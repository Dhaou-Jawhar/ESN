package nesstechnologies.fr.applicationesnbackend.entities;

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
@ToString
public class Experiences {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private  String titre;
    private  String dateDeb;
    private  String dateFin;
    private  String client;
    @Lob
    @Column(columnDefinition = "LONGTEXT") // ou "LONGTEXT" si vous avez besoin de stocker de très longues descriptions
    private String description;

    @JsonIgnore
    @ManyToOne
    private Candidat candidat1;


}
