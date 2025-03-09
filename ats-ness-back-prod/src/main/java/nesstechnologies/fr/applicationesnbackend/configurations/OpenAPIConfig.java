package nesstechnologies.fr.applicationesnbackend.configurations;


import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
@SecurityScheme(
        name = "Token Authentification",
        description = "Saisissez votre token ici!",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        scheme = "bearer",
        in = SecuritySchemeIn.HEADER
)
public class OpenAPIConfig {


    @Value("${server.port}")  // Use Spring Boot's server port
    private String serverPort;

    @Bean
    public OpenAPI myOpenAPI() {
        Contact contact = new Contact();
        contact.setEmail("contact@nessTechno.fr");
        contact.setName("Ness Technologies");
        contact.setUrl("https://www.nesstechnologies.fr/");

        Info info = new Info()
                .title("Ness Technologies TEST DES APIs")
                .contact(contact)
                .description("Liste des APIs développés par Ness Technologies.");

        return new OpenAPI().info(info);
    }

}