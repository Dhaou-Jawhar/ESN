package nesstechnologies.fr.applicationesnbackend.repositories;

import nesstechnologies.fr.applicationesnbackend.entities.Besoins;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BesoinsRepository  extends JpaRepository<Besoins,Integer> {
    Optional<Besoins> findByReference(String reference);

}
