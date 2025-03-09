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
@ToString
public class Certifications {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private  String titreCertif;
    private  String etablissementCertif;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private  String commentaireCertif;
    private  String paysCertif;

    private  String anneeObtentionCertif;



    @JsonBackReference
    @ManyToOne
    private Candidat candidat;
}
