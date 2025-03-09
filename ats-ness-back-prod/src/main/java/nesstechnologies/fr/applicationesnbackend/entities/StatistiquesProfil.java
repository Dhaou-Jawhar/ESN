package nesstechnologies.fr.applicationesnbackend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"segments","sousSegments","technologie"})

public class StatistiquesProfil implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Builder.Default
    @OneToMany(mappedBy = "statistiquesProfil", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Segment> segments = new ArrayList<>();
    @Builder.Default
    @OneToMany(mappedBy = "statistiquesProfil", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SousSegment> sousSegments = new ArrayList<>();
    @Builder.Default
    @OneToMany(mappedBy = "statistiquesProfil", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Technologie> technologie = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "candidat_id")
    private Candidat candidat;
}
