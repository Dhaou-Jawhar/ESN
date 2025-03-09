package nesstechnologies.fr.applicationesnbackend.dto;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LinkedInDTO {

    private Integer id;
    private String lien;
    private String jobTitle;
    private String jobDescription;
    private String jobLocation;
    private String previousCompany;
    private String previousJob;
    private String previousJobDescription;
    private List<String> allSkills;
    private List<String> skillsJobActuel;
    private List<String> skillsJobPrecedent;
    private String libelleGeneral;
    private int degreActiviteLinkedIn;
    private String infos;
    private String posteActuel;
    private String localisationLinkedin;
    private float dureeDerniereSociete;
    private String descriptionPosteDerniereSociete;
    private List<String> motsCles;
    private String commentaires;
    private int nbrPushCV;
}
