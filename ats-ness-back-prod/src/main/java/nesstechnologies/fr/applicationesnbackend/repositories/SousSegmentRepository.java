package nesstechnologies.fr.applicationesnbackend.repositories;

import nesstechnologies.fr.applicationesnbackend.entities.Referentiel;
import nesstechnologies.fr.applicationesnbackend.entities.SousSegment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SousSegmentRepository extends JpaRepository<SousSegment, Integer> {
    @Query("SELECT ss FROM SousSegment ss WHERE ss.statistiquesProfil.candidat.id = :candidatId ORDER BY ss.sousSegmentValue DESC")
    List<SousSegment> findSousSegmentsByCandidatIdOrderBySousSegmentValueDesc(@Param("candidatId") Integer candidatId);
}
