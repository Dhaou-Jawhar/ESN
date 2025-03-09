package nesstechnologies.fr.applicationesnbackend.enumerations;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum EtatCandidat {
    @JsonProperty("A Traiter")
    ATraiter,
    @JsonProperty("En cours de qualification")
    EnCoursDeQualification,
    @JsonProperty("Vivier")
    Vivier,
    @JsonProperty("Top Vivier")
    TopVivier,
    @JsonProperty("Validé")
    Validé,
    @JsonProperty("Ressource")
    Ressource,
    @JsonProperty("Sortie Prochaine")
    SortieProchaine,
    @JsonProperty("Sorti")
    Sorti}
