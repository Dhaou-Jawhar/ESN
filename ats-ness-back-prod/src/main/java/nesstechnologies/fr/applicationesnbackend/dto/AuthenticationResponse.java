package nesstechnologies.fr.applicationesnbackend.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AuthenticationResponse {
    private String accessToken;
    private String refreshToken;
    private String firstName;
    private String lastName;
    private String usrMail;
    private String role;
    private String picture_url;
    private Boolean firstAttempt = true;

}


