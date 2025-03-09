package nesstechnologies.fr.applicationesnbackend.services.Authentication;


import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nesstechnologies.fr.applicationesnbackend.dto.AuthenticationRequest;
import nesstechnologies.fr.applicationesnbackend.dto.AuthenticationResponse;
import nesstechnologies.fr.applicationesnbackend.dto.RegistrationRequest;
import nesstechnologies.fr.applicationesnbackend.entities.*;
import nesstechnologies.fr.applicationesnbackend.enumerations.Role;
import nesstechnologies.fr.applicationesnbackend.enumerations.TokenType;
import nesstechnologies.fr.applicationesnbackend.exceptions.CustomException;
import nesstechnologies.fr.applicationesnbackend.repositories.JwtTokenRepo;
import nesstechnologies.fr.applicationesnbackend.repositories.UserRepo;
import nesstechnologies.fr.applicationesnbackend.repositories.mediaRepo;
import nesstechnologies.fr.applicationesnbackend.services.ConfirmationToken.ConfirmationTokenService;
import nesstechnologies.fr.applicationesnbackend.services.EmailSender.EmailSenderService;
import nesstechnologies.fr.applicationesnbackend.services.Jwt.JwtService;
import nesstechnologies.fr.applicationesnbackend.services.PasswordGenerator.PasswordGeneratorService;
import nesstechnologies.fr.applicationesnbackend.services.RefreshToken.RefreshTokenService;
import nesstechnologies.fr.applicationesnbackend.services.User.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;


@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {
    private final EmailSenderService emailSender;
    private final UserService userService;
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenRepo jwtTokenRepo;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ConfirmationTokenService tokenService;
    private final RefreshTokenService refreshTokenService;
    private final PasswordGeneratorService passwordGenerator;
    private final Cloudinary cloudinary;
    private final mediaRepo mediaRep;

    @Value("${admin.email}") // Injection depuis application.properties
    private String adminEmail;

    @Value("${ats.config.confirmation-email-redirection.url}")
    private String redirectionUrl;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {

        var user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException("Aucun utilisateur n'est inscrit avec cet e-mail!")); // Exception personnalisée

        if (!user.getEmailVerif()) {
            throw new CustomException("E-mail pas encore vérifié"); // Exception personnalisée
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException("Vérifiez votre mot de passe SVP"); // Exception personnalisée
        }

//        if (!user.getRole().equals(Role.ADMIN) && !user.getRole().equals(Role.MODERATOR)) {
//            throw new CustomException("Cet espace est dédié pour l'administrateur, saisissez les coordonnées admin pour se connecter !!!"); // Exception personnalisée
//        }

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        if (authentication.isAuthenticated() ) {
            // System
            var jwtTokenString = "";
            jwtTokenString = jwtService.generateToken(user.getEmail());
            revokeAllUserTokens(user);
            saveJwtToken(user, jwtTokenString);


            RefreshToken refreshToken = refreshTokenService.createRefreshToken(request.getEmail());
            user.setlastLogin(user.getJustLogged());
            user.setJustLogged(LocalDateTime.now());
            userRepo.save(user);
            return AuthenticationResponse.builder()
                    .accessToken(jwtService.generateToken(user.getEmail()))
                    .refreshToken(refreshToken.getToken())
                    .firstName(user.getNom())
                    .lastName(user.getPrenom())
                    .usrMail(user.getEmail())
                    .role(user.getRole().name())
                    .picture_url(user.getPictureUrl())
                    .firstAttempt(user.getFirstAttempt())
                    .build();
        } else {
            throw new UsernameNotFoundException("Requete invalide !");
        }
    }




    public utilisateur createUserAdmin(utilisateur u) throws IOException {
        // Create a new utilisateur object
        utilisateur u1 = new utilisateur();
        u1.setPassword(passwordEncoder.encode(u.getPassword()));
        u1.setNom(u.getNom());
        u1.setPrenom(u.getPrenom());
        u1.setEmail(u.getEmail());
        u1.setRole(Role.CANDIDAT);
        u1.setEnabled(true);
        u1.setEmailVerif(true);
        // Handle CV upload

        // Save the utilisateur entity
        userRepo.save(u1);
        return u1;
    }

    
    public RefreshToken saveJwtToken(utilisateur user, String jwtTokenString) {
        var jwtToken = RefreshToken.builder()
                .token(jwtTokenString)
                .user(user)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        return jwtTokenRepo.save(jwtToken);
    }

    public utilisateur register(RegistrationRequest request) throws IOException {
        utilisateur user2 = userRepo.findByEmail2(request.getEmail());
        if (user2 != null) {
            return null;
        }

        var user = utilisateur.builder()
                .nom(request.getFirstName())
                .prenom(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CANDIDAT)
                .enabled(true)
                .emailVerif(false)
                .build();






        userRepo.save(user);

        String token = UUID.randomUUID().toString();
        ConfirmationToken confirmationToken = new ConfirmationToken(token, LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(60),
                user);
        tokenService.saveConfirmationToken(confirmationToken);
        String link = redirectionUrl + "/mail-verif?token=" + token;
        emailSender.send(request.getEmail(), buildEmail2(user, link));
        var jwtTokenString = jwtService.generateJwtToken(user);


        return user;
    }

    public String buildEmail2(utilisateur user, String link) {
        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "  <head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <title>Titre de l'email</title>\n" +
                "    <style>\n" +
                "      /* Styles pour l'arrière-plan uni */\n" +
                "      body {\n" +
                "        background-color: #F5F5F5;\n" +
                "        margin: 0;\n" +
                "        padding: 0;    \n" +
                "\tfont-family: Arial, sans-serif;\n" +
                "\n" +
                "      }\n" +
                "      /* Styles pour le conteneur principal */\n" +
                "      .container {\n" +
                "        max-width: 600px;\n" +
                "        margin: 0 auto;\n" +
                "        background-color: #FFFFFF;\n" +
                "        padding: 20px;\n" +
                "        height: 100vh;\n" +
                "        display: flex;\n" +
                "        flex-direction: column;\n" +
                "        justify-content: center;\n" +
                "      }\n" +
                "      /* Styles pour le logo de l'entreprise */\n" +
                "      .logo {\n" +
                "        display: block;\n" +
                "        margin: -20px auto 20px;\n" +
                "        width: 100px;\n" +
                "        height: auto;\n" +
                "      }\n" +
                "      /* Styles pour le corps du texte */\n" +
                "      .text {\n" +
                "        text-align: center;\n" +
                "      }\n" +
                "      /* Styles pour le bouton animé */\n" +
                "      .button {\n" +
                "        display: inline-block;\n" +
                "        font-size: 16px;\n" +
                "        font-weight: bold;\n" +
                "        color: #3CAEA3;\n" +
                "        background-color: transparent;\n" +
                "        border-radius: 5px;\n" +
                "        padding: 10px 20px;\n" +
                "        border: 2px solid #3CAEA3;\n" +
                "        text-decoration: none;\n" +
                "        transition: all 0.5s ease;\n" +
                "      }\n" +
                "      .button:hover {\n" +
                "        background-color: #3CAEA3;\n" +
                "        color: #FFFFFF;\n" +
                "      }\n" +
                "    </style>\n" +
                "  </head>\n" +
                "  <body>\n" +
                "    <div class=\"container\">\n" +
                "      <img src=\"https://i.ibb.co/hFkpDMD/nesstechnologies-logo.jpg\" alt=\"Bienvenue\" padding-left=\"60%\" height=\"200px\" width=\"300px\">\n" +
                "<br>     \n" +
                " <div class=\"text\">\n" +
                "        <h1 style=\"color : #3CAEA3;\">Bonjour " + user.getNom() + " " + user.getPrenom() + "</h1>\n" +
                "        <h3>Bienvenue parmis nous! \n Appuyer sur le lien suivant pour activer votre compte:</h3>\n" +
                "<p style=\"color : red\">Le lien expire dans 15 minutes.</p>\n" +
                "        <p><a href=" + link + " class=\"button\">Lien De Vérification</a></p>\n" +
                "\n" +
                "      </div>\n" +
                "    </div>\n" +
                "  </body>\n" +
                "</html>\n";
    }


    @Transactional
    public String confirmEmailToken(String token) {
        ConfirmationToken confirmationToken = tokenService
                .getToken(token).get();
        if (confirmationToken == null) {
            return "token non trouvé";
        }

        if (confirmationToken.getConfirmedAt() != null) {
            return ("email déja confirmé");
        }

        LocalDateTime expiredAt = confirmationToken.getExpiresAt();
        if (expiredAt.isBefore(LocalDateTime.now())) {
            String token2 = UUID.randomUUID().toString();

            ConfirmationToken confirmationToken2 = new ConfirmationToken(token2, LocalDateTime.now(),
                    LocalDateTime.now().plusMinutes(60),
                    confirmationToken.getUser());
            tokenService.saveConfirmationToken(confirmationToken2);
            String link = redirectionUrl + "/mail-verif?token=" + token2;
            emailSender.send(confirmationToken.getUser().getEmail(), buildEmail2(confirmationToken.getUser(), link));
            return "E-mail expiré un nouvel e-mail a été envoyé!";
        }

        tokenService.setConfirmedAt(token);

        utilisateur user = confirmationToken.getUser();
        user.setEmailVerif(true);
        userService.enableAppUser(confirmationToken.getUser().getEmail());
        userRepo.save(user);
        return "Email confirmé avec succès! ";
    }

    public void revokeAllUserTokens(utilisateur user) {
        var validUserTokens = jwtTokenRepo.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        jwtTokenRepo.saveAll(validUserTokens);
    }

    public String buildEmailVerif(String token, utilisateur user) {

        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "  <head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <title>Titre de l'email</title>\n" +
                "    <style>\n" +
                "      /* Styles pour l'arrière-plan uni */\n" +
                "      body {\n" +
                "        background-color: #F5F5F5;\n" +
                "        margin: 0;\n" +
                "        padding: 0;    \n" +
                "\tfont-family: Arial, sans-serif;\n" +
                "\n" +
                "      }\n" +
                "      /* Styles pour le conteneur principal */\n" +
                "      .container {\n" +
                "        max-width: 600px;\n" +
                "        margin: 0 auto;\n" +
                "        background-color: #FFFFFF;\n" +
                "        padding: 20px;\n" +
                "        height: 100vh;\n" +
                "        display: flex;\n" +
                "        flex-direction: column;\n" +
                "        justify-content: center;\n" +
                "      }\n" +
                "      /* Styles pour le logo de l'entreprise */\n" +
                "      .logo {\n" +
                "        display: block;\n" +
                "        margin: -20px auto 20px;\n" +
                "        width: 100px;\n" +
                "        height: auto;\n" +
                "      }\n" +
                "      /* Styles pour le corps du texte */\n" +
                "      .text {\n" +
                "        text-align: center;\n" +
                "      }\n" +
                "      /* Styles pour le bouton animé */\n" +
                "      .button {\n" +
                "        display: inline-block;\n" +
                "        font-size: 16px;\n" +
                "        font-weight: bold;\n" +
                "        color: #3CAEA3;\n" +
                "        background-color: transparent;\n" +
                "        border-radius: 5px;\n" +
                "        padding: 10px 20px;\n" +
                "        border: 2px solid #3CAEA3;\n" +
                "        text-decoration: none;\n" +
                "        transition: all 0.5s ease;\n" +
                "      }\n" +
                "      .button:hover {\n" +
                "        background-color: #3CAEA3;\n" +
                "        color: #FFFFFF;\n" +
                "      }\n" +
                "    </style>\n" +
                "  </head>\n" +
                "  <body>\n" +
                "    <div class=\"container\">\n" +
                "      <img src=\"https://i.ibb.co/hFkpDMD/nesstechnologies-logo.jpg\" alt=\"Bienvenue\" padding-left=\"60%\" height=\"200px\" width=\"300px\">\n" +
                "<br>     \n" +
                " <div class=\"text\">\n" +
                "        <h1 style=\"color : #3CAEA3;\">Bonjour " + user.getNom() + " " + user.getPrenom() + "</h1>\n" +
                "        <p>Vous avez demandez de réinitialiser votre mot de passe,</p>\n" +
                "        <p>ceci est votre email verification code:</p>\n" +
                "\n" +
                "<p style=\"color : red\">" + token + "</p>\n" +
                "       \n" +
                "\n" +
                "      </div>\n" +
                "    </div>\n" +
                "  </body>\n" +
                "</html>\n";
    }

    @Transactional
    public String requestResetPassword(String email) {
        Optional<utilisateur> userOptional = userRepo.findByEmail(email);
        if (userOptional.isEmpty()) {
            return "Pas de compte associé à cet e-mail!";
        }
        utilisateur user = userOptional.get();

        String token = UUID.randomUUID().toString();

        ConfirmationToken confirmationToken = new ConfirmationToken(token, LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(60),
                user);
        tokenService.saveConfirmationToken(confirmationToken);
        // String link = "redirectionUrl + "/confirm?token=" + token;
        emailSender.send(user.getEmail(), buildEmailVerif(token, confirmationToken.getUser()));
        return "Vérification requise, un e-mail de vérification a été envoyé!";
    }


    @Transactional
    public String passwordResetConfirm(String mailToken, String password) {

        ConfirmationToken confirmationToken = tokenService
                .getToken(mailToken).orElse(null);
        if (confirmationToken == null) {
            return "Veuillez vérifier le code envoyé par mail!";
        }


        LocalDateTime expiredAt = confirmationToken.getExpiresAt();
        if (expiredAt.isBefore(LocalDateTime.now())) {
            String token2 = UUID.randomUUID().toString();

            ConfirmationToken confirmationToken2 = new ConfirmationToken(token2, LocalDateTime.now(),
                    LocalDateTime.now().plusMinutes(60),
                    confirmationToken.getUser());
            tokenService.saveConfirmationToken(confirmationToken2);
            emailSender.send(confirmationToken.getUser().getEmail(), token2);
            return "E-mail expiré un nouvel e-mail a été envoyé!";
        }

        tokenService.setConfirmedAt(mailToken);

        utilisateur u = confirmationToken.getUser();
        String oldPassword = (u.getPassword());
        utilisateur user = confirmationToken.getUser();
        user.setPassword(passwordEncoder.encode(password));
        userRepo.save(user);

        return "Mot de passe modifié avec succès!";
    }

    public utilisateur currentlyAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email).orElse(null);
    }

    public utilisateur currentlyAuthenticatedUser1() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepo.findByEmail(email).orElse(null);

    }


    public AuthenticationResponse refreshAccessToken(String refreshToken) {
        RefreshToken storedRefreshToken = jwtTokenRepo.findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        if (storedRefreshToken.isRevoked() || storedRefreshToken.isExpired()) {
            throw new RuntimeException("Token invalide veuillez se reconnecter svp!");
        }
        RefreshToken verifiedRefreshToken = refreshTokenService.verifyExpiration(storedRefreshToken);
        String accessToken = jwtService.generateToken(verifiedRefreshToken.getUser().getEmail());
        utilisateur u = verifiedRefreshToken.getUser();
        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .firstName(u.getNom())
                .lastName(u.getPrenom())
                .refreshToken(refreshToken)
                .role(u.getRole().toString())
                .picture_url(u.getPictureUrl())
                .usrMail(u.getEmail())
                .build();
    }


    public ResponseEntity<?> logout() {
        utilisateur u = currentlyAuthenticatedUser1();
        revokeAllUserTokens(u);
        return ResponseEntity.ok("Vous êtes maintenant déconnecté");
    }

    @Scheduled(fixedRate = 60000)
    public void deleteExpiredAndRevokedTokens() {
        List<RefreshToken> tokens = jwtTokenRepo.findAll();

        for (RefreshToken token : tokens) {
            if (token.isExpired() || token.isRevoked()) {
                jwtTokenRepo.delete(token);
            }
        }
    }




    public String addMod(String email) throws IOException {
        String password = passwordGenerator.generatePassword();
        utilisateur mod = new utilisateur();
        mod.setEmail(email);
        mod.setRole(Role.MODERATOR);
        mod.setFirstAttempt(true);
        mod.setPassword(passwordEncoder.encode(password));
        mod.setEnabled(true);
        mod.setEmailVerif(true);
        userRepo.save(mod);
        String mail = "<!DOCTYPE html>\n" +
                "<html>\n" +
                "  <head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <title>Titre de l'email</title>\n" +
                "    <style>\n" +
                "      /* Styles pour l'arrière-plan uni */\n" +
                "      body {\n" +
                "        background-color: #F5F5F5;\n" +
                "        margin: 0;\n" +
                "        padding: 0;    \n" +
                "\tfont-family: Arial, sans-serif;\n" +
                "\n" +
                "      }\n" +
                "      /* Styles pour le conteneur principal */\n" +
                "      .container {\n" +
                "        max-width: 600px;\n" +
                "        margin: 0 auto;\n" +
                "        background-color: #FFFFFF;\n" +
                "        padding: 20px;\n" +
                "        height: 100vh;\n" +
                "        display: flex;\n" +
                "        flex-direction: column;\n" +
                "        justify-content: center;\n" +
                "      }\n" +
                "      /* Styles pour le logo de l'entreprise */\n" +
                "      .logo {\n" +
                "        display: block;\n" +
                "        margin: -20px auto 20px;\n" +
                "        width: 100px;\n" +
                "        height: auto;\n" +
                "      }\n" +
                "      /* Styles pour le corps du texte */\n" +
                "      .text {\n" +
                "        text-align: center;\n" +
                "      }\n" +
                "      /* Styles pour le bouton animé */\n" +
                "      .button {\n" +
                "        display: inline-block;\n" +
                "        font-size: 16px;\n" +
                "        font-weight: bold;\n" +
                "        color: #3CAEA3;\n" +
                "        background-color: transparent;\n" +
                "        border-radius: 5px;\n" +
                "        padding: 10px 20px;\n" +
                "        border: 2px solid #3CAEA3;\n" +
                "        text-decoration: none;\n" +
                "        transition: all 0.5s ease;\n" +
                "      }\n" +
                "      .button:hover {\n" +
                "        background-color: #3CAEA3;\n" +
                "        color: #FFFFFF;\n" +
                "      }\n" +
                "    </style>\n" +
                "  </head>\n" +
                "  <body>\n" +
                "    <div class=\"container\">\n" +
                "      <img src=\"https://i.ibb.co/hFkpDMD/nesstechnologies-logo.jpg\" alt=\"Bienvenue\" padding-left=\"60%\" height=\"200px\" width=\"300px\">\n" +
                "<br>     \n" +
                " <div class=\"text\">\n" +
                "        <h1 style=\"color : #3CAEA3;\">Cher modérateur</h1>\n" +
                "        <p>Vu que votre compte sera utilisé pour la première fois</p>\n" +
                "        <p>ci-dessous votre mot de passe:</p>\n" +
                "\n" +
                "<p style=\"color : red\">"+password+"</p>\n" +
                "       \n" +
                "\n" +
                "      </div>\n" +
                "    </div>\n" +
                "  </body>\n" +
                "</html>\n";
        emailSender.send(mod.getEmail(), mail);
        //String token = jwtService.generateJwtToken(mod);
        String result = " Mod account : "+mod.getEmail()+" | "+ password;
        return result;
    }




    @Transactional
    public utilisateur updateUserFirstAttempt(String nom, String prenom, String emailSecondaire, String password, MultipartFile imageProfil) throws IOException {
        // Récupérer l'utilisateur par ID
        utilisateur user = currentlyAuthenticatedUser();

        // Modifier les champs de l'utilisateur
        user.setNom(nom);
        user.setPrenom(prenom);
        user.setEmailSecondaire(emailSecondaire);
        user.setPassword(passwordEncoder.encode(password)); // Assure-toi d'encoder le mot de passe en production
        // Mettre à jour l'image si elle existe
        if (imageProfil != null && !imageProfil.isEmpty()) {
            String pictureUrl = uploadFileToCloudinary(imageProfil);
            user.setPictureUrl(pictureUrl);
        }
        user.setFirstAttempt(false);

        // Sauvegarder les changements
        return userRepo.save(user);
    }

    // Méthode pour uploader les fichiers sur Cloudinary
    private String uploadFileToCloudinary(MultipartFile file) throws IOException {
        return cloudinary.uploader()
                .upload(file.getBytes(), Map.of("public_id", UUID.randomUUID().toString()))
                .get("url").toString();
    }









    public String createAdminAccount() throws IOException {
        if(userRepo.findByEmail(adminEmail).isPresent()) {
            System.err.println("ADMIN DEJA CREE ET EXISTANT");
            return adminEmail;
        }
        else {

        String password = passwordGenerator.generatePassword();
        utilisateur admin = new utilisateur();
        admin.setEmail(adminEmail);
        admin.setRole(Role.ADMIN);
        admin.setFirstAttempt(true);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setEnabled(true);
        admin.setEmailVerif(true);
        userRepo.save(admin);
        String mail = "<!DOCTYPE html>\n" +
                "<html>\n" +
                "  <head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <title>Titre de l'email</title>\n" +
                "    <style>\n" +
                "      /* Styles pour l'arrière-plan uni */\n" +
                "      body {\n" +
                "        background-color: #F5F5F5;\n" +
                "        margin: 0;\n" +
                "        padding: 0;    \n" +
                "\tfont-family: Arial, sans-serif;\n" +
                "\n" +
                "      }\n" +
                "      /* Styles pour le conteneur principal */\n" +
                "      .container {\n" +
                "        max-width: 600px;\n" +
                "        margin: 0 auto;\n" +
                "        background-color: #FFFFFF;\n" +
                "        padding: 20px;\n" +
                "        height: 100vh;\n" +
                "        display: flex;\n" +
                "        flex-direction: column;\n" +
                "        justify-content: center;\n" +
                "      }\n" +
                "      /* Styles pour le logo de l'entreprise */\n" +
                "      .logo {\n" +
                "        display: block;\n" +
                "        margin: -20px auto 20px;\n" +
                "        width: 100px;\n" +
                "        height: auto;\n" +
                "      }\n" +
                "      /* Styles pour le corps du texte */\n" +
                "      .text {\n" +
                "        text-align: center;\n" +
                "      }\n" +
                "      /* Styles pour le bouton animé */\n" +
                "      .button {\n" +
                "        display: inline-block;\n" +
                "        font-size: 16px;\n" +
                "        font-weight: bold;\n" +
                "        color: #3CAEA3;\n" +
                "        background-color: transparent;\n" +
                "        border-radius: 5px;\n" +
                "        padding: 10px 20px;\n" +
                "        border: 2px solid #3CAEA3;\n" +
                "        text-decoration: none;\n" +
                "        transition: all 0.5s ease;\n" +
                "      }\n" +
                "      .button:hover {\n" +
                "        background-color: #3CAEA3;\n" +
                "        color: #FFFFFF;\n" +
                "      }\n" +
                "    </style>\n" +
                "  </head>\n" +
                "  <body>\n" +
                "    <div class=\"container\">\n" +
                "      <img src=\"https://i.ibb.co/hFkpDMD/nesstechnologies-logo.jpg\" alt=\"Bienvenue\" padding-left=\"60%\" height=\"200px\" width=\"300px\">\n" +
                "<br>     \n" +
                " <div class=\"text\">\n" +
                "        <h1 style=\"color : #3CAEA3;\">Cher administrateur,</h1>\n" +
                "        <p>Vu que votre compte sera utilisé pour la première fois</p>\n" +
                "        <p>ci-dessous votre mot de passe:</p>\n" +
                "\n" +
                "<p style=\"color : red\">"+password+"</p>\n" +
                "       \n" +
                "\n" +
                "      </div>\n" +
                "    </div>\n" +
                "  </body>\n" +
                "</html>\n";
        emailSender.send(admin.getEmail(), mail);
        //String token = jwtService.generateJwtToken(mod);
        String result = " Admin account : "+admin.getEmail()+" | "+ password;
        return result;
    }
    }
}
