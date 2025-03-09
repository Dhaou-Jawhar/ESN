package nesstechnologies.fr.applicationesnbackend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nesstechnologies.fr.applicationesnbackend.enumerations.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "_user")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class utilisateur implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nom;
    private String prenom;
    private String email;
    private String emailSecondaire;
    private String password;
    private Boolean firstAttempt = true;


    private Boolean enabled = true;
    private String PictureUrl; // URL du CV au format Ness Technology
    private LocalDateTime lastLogin;
    private LocalDateTime justLogged;

    @Enumerated(EnumType.STRING)
    private Role role;
    private Boolean emailVerif;




    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    // Getters and setters
    public LocalDateTime getJustLogged() {
        return justLogged;
    }

    public void setJustLogged(LocalDateTime justLogged) {
        this.justLogged = justLogged;
    }

    public LocalDateTime getlastLogin() {
        return lastLogin;
    }

    public void setlastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }

}
