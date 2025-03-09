package nesstechnologies.fr.applicationesnbackend.repositories;

import nesstechnologies.fr.applicationesnbackend.entities.Organigramme;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganigrammeRepository extends JpaRepository<Organigramme,Integer> {
}
