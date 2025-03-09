package nesstechnologies.fr.applicationesnbackend.repositories;

import nesstechnologies.fr.applicationesnbackend.entities.Actions;
import nesstechnologies.fr.applicationesnbackend.entities.Candidat;
import nesstechnologies.fr.applicationesnbackend.enumerations.EtatCandidat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface candidatRepository extends JpaRepository<Candidat,Integer> {
    @Query("SELECT a FROM Actions a WHERE a.candidat.id = :candidatId")
    List<Actions> findByCandidatId(@Param("candidatId") Integer candidatId);
    long countByEtat(EtatCandidat etat);
    @Query("SELECT COUNT(c) FROM Candidat c WHERE c.etat IN :etats")
    long countByEtatVivier(@Param("etats") EtatCandidat[] etats);

    @Query("SELECT COUNT(c) FROM Candidat c WHERE c.etat NOT IN :etats")
    long countByEtatNotIn(List<EtatCandidat> etats);

    @Query("SELECT c FROM Candidat c WHERE c.etat NOT IN :etats")
    List<Candidat> findByEtatNotIn(@Param("etats") List<EtatCandidat> etats);



}
