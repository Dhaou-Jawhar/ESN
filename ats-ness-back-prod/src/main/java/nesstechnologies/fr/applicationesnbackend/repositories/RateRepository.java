package nesstechnologies.fr.applicationesnbackend.repositories;


import nesstechnologies.fr.applicationesnbackend.entities.Rating;
import nesstechnologies.fr.applicationesnbackend.entities.Candidat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface RateRepository extends JpaRepository<Rating, Integer> {
    @Query("SELECT r FROM Rating r WHERE r.cand = :user ")
    Rating findByUser1(@Param("user") Candidat user);

//    @Query("SELECT r FROM Rating r WHERE r.technology = :techno ")
//    Rating findByTechnology(@Param("Technology") Technology techno);

    @Query("SELECT r FROM Rating r WHERE r.technology.id = :technoId ")
    Rating findByTechno(@Param("technoId") int technoId);
    @Query("SELECT r FROM Rating r WHERE r.langues.id = :langueId ")
    Rating findByLangues(@Param("langueId") int langueId);
    @Query("SELECT r FROM Rating r WHERE r.besoins.id = :besoinId ")
    Rating findByBesoin(@Param("besoinId") int besoinId);

}
