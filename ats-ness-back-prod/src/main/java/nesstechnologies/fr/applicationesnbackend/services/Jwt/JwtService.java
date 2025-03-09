package nesstechnologies.fr.applicationesnbackend.services.Jwt;

import io.jsonwebtoken.Claims;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;
import java.util.function.Function;

public interface JwtService {
    public String generateJwtToken(UserDetails userDetails);

    public String generateJwtToken(Map<String, Object> extraClaims, UserDetails userDetails);

    public String extractUsername(String token);

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver);

    public Claims extractAllClaims(String jwtToken);

    public String generateToken(String userName);

    public boolean isJwtTokenValid(String jwtToken, UserDetails userDetails);

    public boolean isJwtTokenExpired(String jwtToken);
}
