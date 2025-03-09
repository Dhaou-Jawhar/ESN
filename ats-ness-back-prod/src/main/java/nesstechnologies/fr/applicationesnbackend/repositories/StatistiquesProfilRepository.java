package nesstechnologies.fr.applicationesnbackend.repositories;

import nesstechnologies.fr.applicationesnbackend.entities.StatistiquesProfil;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StatistiquesProfilRepository extends JpaRepository<StatistiquesProfil, Integer> {
    @EntityGraph(attributePaths = {"segments", "sousSegments", "technologie"})
    Optional<StatistiquesProfil> findById(Integer id);
}
