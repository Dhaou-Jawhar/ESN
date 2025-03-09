package nesstechnologies.fr.applicationesnbackend.configurations;

import jakarta.annotation.PostConstruct;
import nesstechnologies.fr.applicationesnbackend.services.Authentication.AuthenticationService;
import org.springframework.stereotype.Component;

@Component
public class AdminAccountInitializer {
    private final AuthenticationService authenticationService;

    public AdminAccountInitializer(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostConstruct
    public void init() {
        try {
            String result = authenticationService.createAdminAccount();
            System.err.println("Compte administrateur créé : " + result);
        } catch (Exception e) {
            System.err.println("Erreur lors de la création du compte administrateur : " + e.getMessage());
        }
    }
}
