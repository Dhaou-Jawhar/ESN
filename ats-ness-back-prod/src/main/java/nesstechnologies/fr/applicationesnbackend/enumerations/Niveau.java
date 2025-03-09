package nesstechnologies.fr.applicationesnbackend.enumerations;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum Niveau {
    @JsonProperty("Junior")
    Junior,

    @JsonProperty("Intermédiaire")
    Intermediaire,

    @JsonProperty("Confirmé")
    Confirmé,

    @JsonProperty("Senior")
    Senior,

    @JsonProperty("Expert")
    Expert,

    @JsonProperty("Maitre")
    Maitre,

    @JsonProperty("Lead")
    Lead
    }
