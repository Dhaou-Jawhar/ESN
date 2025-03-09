package nesstechnologies.fr.applicationesnbackend.repositories;

import nesstechnologies.fr.applicationesnbackend.entities.utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

public interface UserRepo extends JpaRepository<utilisateur, Integer> {
    Optional<utilisateur> findByEmail(String email);

    @Transactional
    @Modifying
    @Query("UPDATE utilisateur a " +
            "SET a.enabled = TRUE WHERE a.email = ?1")
    int enableUser(String email);

    @Query("SELECT u FROM utilisateur u WHERE u.email = ?1")
    utilisateur findByEmail2(String email);
    @Query("SELECT COUNT(c) FROM Candidat c WHERE c.creationDateTime BETWEEN :lastLogin AND :justLogged")
    int countCandidatesAddedInInterval(LocalDateTime lastLogin, LocalDateTime justLogged);

}
