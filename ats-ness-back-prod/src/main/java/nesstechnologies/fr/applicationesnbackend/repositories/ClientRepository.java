package nesstechnologies.fr.applicationesnbackend.repositories;

import nesstechnologies.fr.applicationesnbackend.entities.Client;
import nesstechnologies.fr.applicationesnbackend.entities.Societe;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;


public interface ClientRepository extends JpaRepository<Client,Integer> {
    Page<Client> findAll(Pageable pageable);
    @Query("SELECT c FROM Client c JOIN FETCH c.societe WHERE c.id = :id")
    Optional<Client> findByIdWithSociete(@Param("id") Integer id);

    @Query("SELECT c FROM Client c WHERE CONCAT(c.nom, ' ', c.prenom) = :nomComplet")
    Client findByNomComplet(@Param("nomComplet") String nomComplet);

}
