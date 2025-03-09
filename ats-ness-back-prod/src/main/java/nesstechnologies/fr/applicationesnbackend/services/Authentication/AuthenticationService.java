package nesstechnologies.fr.applicationesnbackend.services.Authentication;


import nesstechnologies.fr.applicationesnbackend.dto.AuthenticationRequest;
import nesstechnologies.fr.applicationesnbackend.dto.AuthenticationResponse;
import nesstechnologies.fr.applicationesnbackend.dto.RegistrationRequest;
import nesstechnologies.fr.applicationesnbackend.entities.RefreshToken;
import nesstechnologies.fr.applicationesnbackend.entities.utilisateur;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface AuthenticationService {
    public AuthenticationResponse authenticate(AuthenticationRequest request) throws Exception;

    public RefreshToken saveJwtToken(utilisateur user, String jwtTokenString);

    public utilisateur register(RegistrationRequest request) throws IOException;

    public String buildEmail2(utilisateur user, String link);

    public String confirmEmailToken(String token);

    public void revokeAllUserTokens(utilisateur user);

    public String buildEmailVerif(String token, utilisateur user);

    public String requestResetPassword(String email);

    public String passwordResetConfirm(String mailToken, String password);

    public utilisateur currentlyAuthenticatedUser();

    public utilisateur currentlyAuthenticatedUser1();

    public ResponseEntity<?> logout();

    public AuthenticationResponse refreshAccessToken(String refreshToken);

    public utilisateur createUserAdmin(utilisateur u) throws IOException ;
    public String addMod(String email) throws IOException;
    public utilisateur updateUserFirstAttempt(String nom, String prenom, String emailSecondaire, String password, MultipartFile imageProfil) throws IOException ;
    public String createAdminAccount() throws IOException;

    }
