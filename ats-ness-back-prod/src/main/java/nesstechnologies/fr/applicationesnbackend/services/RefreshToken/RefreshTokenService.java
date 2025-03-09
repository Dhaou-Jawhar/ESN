package nesstechnologies.fr.applicationesnbackend.services.RefreshToken;


import nesstechnologies.fr.applicationesnbackend.entities.RefreshToken;

import java.util.List;

public interface RefreshTokenService {
    public void removeToken(RefreshToken token);

    public List<RefreshToken> findRevokedOrExpiredTokens();

    public void removeRevokedAndExpiredRefreshTokens();

    public RefreshToken createRefreshToken(String email);

    public RefreshToken verifyExpiration(RefreshToken token);
}
