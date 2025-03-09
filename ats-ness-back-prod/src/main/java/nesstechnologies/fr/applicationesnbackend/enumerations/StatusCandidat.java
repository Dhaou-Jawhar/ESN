package nesstechnologies.fr.applicationesnbackend.enumerations;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum StatusCandidat {
    @JsonProperty("Indépendant")
    Independant,
    @JsonProperty("Salarié")
    Salarie,
    @JsonProperty("Portage")
    Portage,
    @JsonProperty("Partenaire")
    Partenaire,
    @JsonProperty("Ouvert au CDI")
    ouvertauCDI
}
