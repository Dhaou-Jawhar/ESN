package nesstechnologies.fr.applicationesnbackend.controleurs.AuthController;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nesstechnologies.fr.applicationesnbackend.dto.AuthenticationRequest;
import nesstechnologies.fr.applicationesnbackend.dto.AuthenticationResponse;
import nesstechnologies.fr.applicationesnbackend.dto.RefreshTokenRequest;
import nesstechnologies.fr.applicationesnbackend.dto.RegistrationRequest;
import nesstechnologies.fr.applicationesnbackend.entities.utilisateur;
import nesstechnologies.fr.applicationesnbackend.repositories.UserRepo;
import nesstechnologies.fr.applicationesnbackend.services.Authentication.AuthenticationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@Slf4j
@RequiredArgsConstructor
@Tag(name = "✅ Gestion de comptes ✅", description = "APIs d'authentification et sécurité de comptes")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    private final UserRepo userRepo;

    @Operation(
            description = "Créer un compte utilisateur",
            summary = "Saisir votre adresse mail, votre futur mot de passe, votre nom et votre prénom pour crééer votre compte",
            responses = {
                    @ApiResponse(
                            description = "Succès",
                            responseCode = "200"
                    ),
                    @ApiResponse(
                            description = "Non Autorisé / Token invalide",
                            responseCode = "403"
                    ),
                    @ApiResponse(
                            description = "Erreur au niveau du serveur",
                            responseCode = "500"
                    ),
            }
    )
    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public utilisateur register(
            @ModelAttribute RegistrationRequest request) throws IOException {


            return authenticationService.register(request);
        }


    @Operation(
            description = "Se connecter à votre compte",
            summary = "Saisir votre adresse mail et votre mot de passe pour se connecter",
            responses = {
                    @ApiResponse(
                            description = "Succès",
                            responseCode = "200"
                    ),
                    @ApiResponse(
                            description = "Email incorrect",
                            responseCode = "401 "
                    ),
                    @ApiResponse(
                            description = "Mot de passe incorrect",
                            responseCode = "400"
                    ),
                    @ApiResponse(
                            description = "Erreur au niveau du serveur",
                            responseCode = "500"
                    ),
            }
    )
    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody AuthenticationRequest request) {
        try {
            AuthenticationResponse response = authenticationService.authenticate(request);
            return ResponseEntity.ok(response);
        } catch (HttpMessageNotReadableException e) {
            // Cela se produit si le JSON est mal formaté
            return ResponseEntity.badRequest().body("Invalid JSON format: " + e.getMessage());
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
        }
    }



    @Operation(
            description = "Confirmer la création de votre compte",
            summary = "Saisir le token d'activation pour confirmer votre compte",
            responses = {
                    @ApiResponse(
                            description = "Succès",
                            responseCode = "200"
                    ),
                    @ApiResponse(
                            description = "Token non trouvé",
                            responseCode = "400"
                    ),
                    @ApiResponse(
                            description = "Erreur au niveau du serveur",
                            responseCode = "500"
                    ),
            }
    )
    @PostMapping("/confirm")
    public ResponseEntity<String> confirm(@RequestParam String token) {
        String confirmationMessage = authenticationService.confirmEmailToken(token);
        return ResponseEntity.ok().contentType(MediaType.TEXT_PLAIN).body(confirmationMessage);
    }

    @Operation(
            description = "Demander un mail de modification de mot de passe",
            summary = "Saisir votre adresse mail pour demander un mail de changement de mot de passe",
            responses = {
                    @ApiResponse(
                            description = "Succès",
                            responseCode = "200"
                    ),
                    @ApiResponse(
                            description = "Aucun compte insscri avec l'email saisi",
                            responseCode = "403"
                    ),

                    @ApiResponse(
                            description = "Erreur au niveau du serveur",
                            responseCode = "500"
                    ),
            }
    )
    @PostMapping("/resetPassword")
    public ResponseEntity<Map<String, String>> requestPass(@RequestParam String email) {
        String message = authenticationService.requestResetPassword(email);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }


    @Operation(
            description = "Modification du  mot de passe",
            summary = "Saisir le code reçu par mail et votre nouveau mot de passe pour changer le mot de passe",
            responses = {
                    @ApiResponse(
                            description = "Succès de réponse  serveur mais il faut bien vérifier le code reçu par mail",
                            responseCode = "200"
                    ),
                    @ApiResponse(
                            description = "Code reçu par mail incorrect",
                            responseCode = "403"
                    ),

                    @ApiResponse(
                            description = "Erreur au niveau du serveur",
                            responseCode = "500"
                    ),
            }
    )
    @PostMapping("/confirmPassword")
    public ResponseEntity<Map<String, String>> confirmPass(@RequestParam String mailToken,

                                                           @RequestParam String pass) {
        String message = authenticationService.passwordResetConfirm(mailToken, pass);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }


    @Operation(
            description = "Renouveler votre token si l'actuel est expiré",
            summary = "Saisir votre Refresh token reçu lors de la connexion",
            responses = {
                    @ApiResponse(
                            description = "Succès",
                            responseCode = "200"
                    ),
                    @ApiResponse(
                            description = "Refresh token incorrect",
                            responseCode = "403"
                    ),

                    @ApiResponse(
                            description = "Erreur au niveau du serveur",
                            responseCode = "500"
                    ),
            }
    )
    @PostMapping("/refreshToken")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        try {
            AuthenticationResponse response = authenticationService.refreshAccessToken(refreshTokenRequest.getRefreshToken());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @Operation(
            description = "Se déconnecter",
            summary = "Se déconnecter de votre compte",
            responses = {
                    @ApiResponse(
                            description = "Succès",
                            responseCode = "200"
                    ),

                    @ApiResponse(
                            description = "Erreur au niveau du serveur",
                            responseCode = "500"
                    ),
            }
    )
    @SecurityRequirement(name = "Token Authentification")
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return authenticationService.logout();
    }


    @Operation(
            description = "Afficher un utilisateur",
            summary = "Saisir votre Refresh token reçu lors de la connexion",
            responses = {
                    @ApiResponse(
                            description = "Succès",
                            responseCode = "200"
                    ),
                    @ApiResponse(
                            description = "Refresh token incorrect",
                            responseCode = "403"
                    ),

                    @ApiResponse(
                            description = "Erreur au niveau du serveur",
                            responseCode = "500"
                    ),
            }
    )
    @SecurityRequirement(name = "Token Authentification")
    @GetMapping("/getUser/{email}")
    public utilisateur getOneUser(@PathVariable String email) {
        return userRepo.findByEmail2(email);
    }


    @Operation(
            description = "Créer un compte utilisateur avec le compte admin",
            summary = "Saisir votre adresse mail, votre futur mot de passe, votre nom et votre prénom pour crééer votre compte",
            responses = {
                    @ApiResponse(
                            description = "Succès",
                            responseCode = "200"
                    ),
                    @ApiResponse(
                            description = "Non Autorisé / Token invalide",
                            responseCode = "403"
                    ),
                    @ApiResponse(
                            description = "Erreur au niveau du serveur",
                            responseCode = "500"
                    ),
            }
    )
    @SecurityRequirement(name = "Token Authentification")
    @PostMapping(path = "/createUserAdmin", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public utilisateur createUserAdmin(@ModelAttribute utilisateur u) throws IOException {

        return authenticationService.createUserAdmin(u);
    }







    @Operation(
            description = "Créer un compte modérateur",
            summary = "Saisir l'email du modérateur à ajouter",
            responses = {
                    @ApiResponse(
                            description = "Succès",
                            responseCode = "200"
                    ),
                    @ApiResponse(
                            description = "Non Autorisé / Token invalide",
                            responseCode = "403"
                    ),
                    @ApiResponse(
                            description = "Erreur au niveau du serveur",
                            responseCode = "500"
                    ),
            }
    )
    @SecurityRequirement(name = "Token Authentification")
    @GetMapping("/addMod")
    public String createModAccount(@RequestParam String email) throws IOException {
        return authenticationService.addMod(email);
    }




    @PreAuthorize("isAuthenticated()")
    @PutMapping("/first-attempt")
    public ResponseEntity<?> updateUserFirstAttempt(
            @RequestParam("nom") String nom,
            @RequestParam("prenom") String prenom,
            @RequestParam("emailSecondaire") String emailSecondaire,
            @RequestParam("password1") String password,
            @RequestParam(value = "imageProfil", required = false) MultipartFile imageProfil
    ) {
        try {
            if (imageProfil != null) {
                System.err.println("Image Profil reçu: " + imageProfil.getOriginalFilename());
            } else {
                System.err.println("Aucune image reçue");
            }

            utilisateur updatedUser = authenticationService.updateUserFirstAttempt(nom, prenom, emailSecondaire, password, imageProfil);
            return ResponseEntity.ok(updatedUser);

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Erreur lors de l'upload de l'image : " + e.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Erreur : " + ex.getMessage());
        }
    }

}
