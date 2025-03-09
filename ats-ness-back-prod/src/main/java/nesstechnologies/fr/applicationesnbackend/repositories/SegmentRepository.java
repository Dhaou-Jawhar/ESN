package nesstechnologies.fr.applicationesnbackend.repositories;

import nesstechnologies.fr.applicationesnbackend.entities.Segment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SegmentRepository extends JpaRepository<Segment, Integer> {
    @Query("SELECT s FROM Segment s WHERE s.statistiquesProfil.candidat.id = :candidatId ORDER BY s.segmentValue DESC")
    List<Segment> findSegmentsByCandidatIdOrderBySegmentValueDesc(@Param("candidatId") Integer candidatId);
}
