package nesstechnologies.fr.applicationesnbackend.services.RefreshToken;


import nesstechnologies.fr.applicationesnbackend.entities.RefreshToken;
import nesstechnologies.fr.applicationesnbackend.repositories.JwtTokenRepo;
import nesstechnologies.fr.applicationesnbackend.repositories.UserRepo;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {
    private final JwtTokenRepo jwtTokenRepo;
    private final UserRepo userInfoRepository;
   private static final long EXPIRATION_TIME = 1 * 60 * 60 * 1000;
   //private static final long EXPIRATION_TIME =  120 * 1000;


    public RefreshTokenServiceImpl(JwtTokenRepo jwtTokenRepo, UserRepo userInfoRepository) {
        this.jwtTokenRepo = jwtTokenRepo;
        this.userInfoRepository = userInfoRepository;
    }

    public void removeToken(RefreshToken token) {
        jwtTokenRepo.delete(token);
    }

    public List<RefreshToken> findRevokedOrExpiredTokens() {
        return jwtTokenRepo.findByRevokedTrueOrExpiredTrue();
    }

    @Scheduled(fixedDelay = 60000)
    public void removeRevokedAndExpiredRefreshTokens() {
        List<RefreshToken> revokedOrExpiredTokens = findRevokedOrExpiredTokens();

        for (RefreshToken token : revokedOrExpiredTokens) {
            removeToken(token);
            System.err.print(token);
        }
    }

    public RefreshToken createRefreshToken(String email) {
        Date currentTime = new Date();
        Date expirationTime = new Date(currentTime.getTime() + EXPIRATION_TIME);
        RefreshToken refreshToken = RefreshToken.builder()
                .user(userInfoRepository.findByEmail(email).get())
                .token(UUID.randomUUID().toString())

                .expiryDate(expirationTime)
                .build();
        return jwtTokenRepo.save(refreshToken);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(new Date()) < 0) {
            jwtTokenRepo.delete(token);
            throw new RuntimeException("Refresh token expiré. Veuillez reconnecter SVP!");
        }
        return token;
    }


}
