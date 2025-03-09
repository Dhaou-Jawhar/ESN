package nesstechnologies.fr.applicationesnbackend.repositories;

import nesstechnologies.fr.applicationesnbackend.entities.Besoins;
import nesstechnologies.fr.applicationesnbackend.entities.BesoinsTechnologies;
import org.springframework.data.jpa.repository.JpaRepository;


public interface BesoinsTechnologiesReppository extends JpaRepository<BesoinsTechnologies,Integer> {

}
