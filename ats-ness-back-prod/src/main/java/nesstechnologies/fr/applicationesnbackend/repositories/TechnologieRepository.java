package nesstechnologies.fr.applicationesnbackend.repositories;

import nesstechnologies.fr.applicationesnbackend.entities.Technologie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TechnologieRepository extends JpaRepository<Technologie, Integer> {
    @Query("SELECT t FROM Technologie t WHERE t.statistiquesProfil.candidat.id = :candidatId ORDER BY t.technoValue DESC")
    List<Technologie> findTechnologiesByCandidatIdOrderByTechnoValueDesc(@Param("candidatId") Integer candidatId);
}
