package nesstechnologies.fr.applicationesnbackend.repositories;

import nesstechnologies.fr.applicationesnbackend.entities.ProfilBesoins;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfilBesoinsRepository extends JpaRepository<ProfilBesoins, Integer> {
    // Trouve un ProfilBesoins en fonction de l'ID du Besoin
    Optional<ProfilBesoins> findByBesoinsId(int besoinsId);
}
