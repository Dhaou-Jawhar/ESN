package nesstechnologies.fr.applicationesnbackend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table( name = "Rating")
public class Rating implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private float value;
    private LocalDateTime ratedAt;
    @JsonIgnore
    @ManyToOne
    private Candidat cand;
    @JsonIgnore
    @ManyToOne
    private Technology technology;
    @JsonIgnore
    @ManyToOne
    private Langues langues;
    @JsonIgnore
    @ManyToOne
    private Candidat candidate;

    @JsonIgnore
    @ManyToOne
    private Besoins besoins;

}