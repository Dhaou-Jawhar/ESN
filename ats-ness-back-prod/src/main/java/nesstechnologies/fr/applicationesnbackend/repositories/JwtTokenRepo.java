package nesstechnologies.fr.applicationesnbackend.repositories;

import nesstechnologies.fr.applicationesnbackend.entities.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface JwtTokenRepo extends JpaRepository<RefreshToken, Integer> {
    @Query(value = """
            select t from RefreshToken t inner join utilisateur u\s
            on t.user.id = u.id\s
            where u.id = :id and (t.expired = false or t.revoked = false)\s """)
    List<RefreshToken> findAllValidTokenByUser(Integer id);

    Optional<RefreshToken> findByToken(String token);

    List<RefreshToken> findByRevokedTrueOrExpiredTrue();


}
