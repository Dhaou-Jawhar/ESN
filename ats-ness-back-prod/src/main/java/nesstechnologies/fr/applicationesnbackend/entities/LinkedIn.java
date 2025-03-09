package nesstechnologies.fr.applicationesnbackend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class LinkedIn implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String lien;
    private String jobTitle;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private  String jobDescription;
    private  String jobLocation;
    private  String previousCompany;
    private  String previousJob;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private  String previousJobDescription;
    @ElementCollection
    private List<String> allSkills;
    @ElementCollection
    private List<String> skillsJobActuel;
    @ElementCollection
    private List<String> skillsJobPrecedent;
    private  String libelleGeneral;
    private  int degreActiviteLinkedIn;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private  String infos;
    private  String posteActuel;
    private  String localisationLinkedin;
    private  float dureeDerniereSociete;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private  String descriptionPosteDerniereSociete;
    @ElementCollection
    private List<String> motsCles;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private  String commentaires;
    private  int nbrPushCV;













}
