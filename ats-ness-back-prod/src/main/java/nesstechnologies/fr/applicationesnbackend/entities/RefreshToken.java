package nesstechnologies.fr.applicationesnbackend.entities;

import jakarta.persistence.*;
import lombok.*;
import nesstechnologies.fr.applicationesnbackend.enumerations.TokenType;

import java.util.Date;

@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer id;

    @Column(unique = true)
    public String token;
    public Date expiryDate;

    @Enumerated(EnumType.STRING)
    public TokenType tokenType = TokenType.BEARER;

    public boolean revoked;

    public boolean expired;

    @ManyToOne
    @JoinColumn(name = "user_id")
    public utilisateur user;

    public String toString() {
        return "RefreshToken{" +
                "id=" + id +
                ", token='" + token + '\'' +
                ", expiryDate=" + expiryDate +
                ", tokenType=" + tokenType +
                ", revoked=" + revoked +
                ", expired=" + expired +

                '}';
    }
}
