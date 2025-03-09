package nesstechnologies.fr.applicationesnbackend.services.Societe;

import nesstechnologies.fr.applicationesnbackend.dto.SocieteDTO;
import nesstechnologies.fr.applicationesnbackend.entities.Besoins;
import nesstechnologies.fr.applicationesnbackend.entities.Societe;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SocieteServices {
    public Societe createSociete(Societe s,List<MultipartFile> organigrammes, MultipartFile logo) throws Exception;
    public SocieteDTO getSocieteById(int id);

    Societe updateSociete(Integer id, Societe updatedSociete, List<MultipartFile> newOrganigrammes, MultipartFile newLogo) throws Exception;

    public List<Societe> getAll();

    public void deleteOrganigramFromSociete(Integer societeId, String organigrammeUrl) throws Exception;
    public Besoins updateBesoinAndProfil(Integer societeId, Besoins updatedBesoin) throws Exception;
    public Besoins createBesoinAndAssignToSociete(Besoins besoin, Integer societeId) throws Exception ;
    public void deleteBesoinFromSociete(Integer besoinId) throws Exception;

    }
