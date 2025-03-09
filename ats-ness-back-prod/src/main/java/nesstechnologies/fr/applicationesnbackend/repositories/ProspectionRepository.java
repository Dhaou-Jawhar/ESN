package nesstechnologies.fr.applicationesnbackend.repositories;

import nesstechnologies.fr.applicationesnbackend.entities.Profil;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProspectionRepository extends JpaRepository<Profil, Integer> {
}
