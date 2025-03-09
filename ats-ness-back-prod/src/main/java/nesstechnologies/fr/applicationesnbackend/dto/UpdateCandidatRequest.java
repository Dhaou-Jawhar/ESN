package nesstechnologies.fr.applicationesnbackend.dto;

import lombok.Data;
import nesstechnologies.fr.applicationesnbackend.entities.*;

import java.util.List;
@Data
public class UpdateCandidatRequest {
    private List<Langues> langues;
    private List<Experiences> experiences;
    private List<Certifications> certifications;
    private List<Profil> profils;
    private List<Formations> formations;
}
