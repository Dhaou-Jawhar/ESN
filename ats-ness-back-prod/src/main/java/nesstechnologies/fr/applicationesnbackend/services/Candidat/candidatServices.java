package nesstechnologies.fr.applicationesnbackend.services.Candidat;

import nesstechnologies.fr.applicationesnbackend.dto.CandidatDTO;
import nesstechnologies.fr.applicationesnbackend.entities.*;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface candidatServices {
    public utilisateur createUser(utilisateur u);
    public Candidat createCandidat(Candidat c, MultipartFile cvFile) throws IOException;
    Candidat getCandidatById(int id);
    Candidat updateCandidat(int id,
                            Candidat updatedCandidatData) throws IOException;

    void deleteCandidat(int id);

    public Page<CandidatDTO> getAllCandidats(int page, int size);
    Candidat updateEtat(int id, String etat);
    int countAddedCandidatesInInterval();
    public Candidat updateCandidatFiles(int id ,
                                        MultipartFile cvFile,
                                        MultipartFile imgFile,
                                        MultipartFile cvNessFile );
    public List<Actions> getActionsByCandidatId(int candidatId);
    public long getTotalCandidats();
    public long getNombreCandidatsRessource();
    public Map<String, Long> getNombreCandidatsVivier();
    public Map<String, Object> getPourcentageCandidatsVivier();
    public Map<String, Object>  getPourcentageCandidatsTopVivier();
    public Map<String, Object>  getPourcentageCandidatsEnCoursDeQualification();
    public Map<String, Object> getPourcentageCandidatsNonVivierTopVivierEnCours();


}
