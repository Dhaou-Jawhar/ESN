package nesstechnologies.fr.applicationesnbackend.repositories;

import nesstechnologies.fr.applicationesnbackend.entities.Technology;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TechnologyRepo extends JpaRepository<Technology, Integer> {
    Technology findByName(String name);

}
