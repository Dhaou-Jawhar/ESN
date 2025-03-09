package nesstechnologies.fr.applicationesnbackend.mapper;

import nesstechnologies.fr.applicationesnbackend.dto.*;
import nesstechnologies.fr.applicationesnbackend.entities.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EntitiesMapper {




    // CandidatForActionsDTO Mappings
//    @Mappings({
//            @Mapping(source = "candidat.utilisateur.nom", target = "nom"),
//            @Mapping(source = "candidat.utilisateur.prenom", target = "prenom"),
//            @Mapping(source = "candidat.utilisateur.email", target = "email"),
//            @Mapping(source = "candidat.utilisateur.emailSecondaire", target = "emailSecondaire"),
////            @Mapping(source = "candidat.utilisateur.telephone", target = "telephone"),
////            @Mapping(source = "candidat.utilisateur.responsable", target = "responsable"),
////            @Mapping(source = "candidat.utilisateur.dateDeCreation", target = "creationDateTime"),
//            @Mapping(source = "candidat.langues", target = "langues"),
//            @Mapping(source = "candidat.certifications", target = "certifications"),
//            @Mapping(source = "candidat.experiences", target = "experiences"),
//            @Mapping(source = "candidat.formations", target = "formations"),
//            @Mapping(source = "candidat.ratings", target = "ratings"),
//            @Mapping(source = "candidat.ratedTechnologies", target = "ratedTechnologies"),
//            @Mapping(source = "candidat.actions", target = "actions")
//    })
    CandidatForActionsDTO toCandidatForActionsDTO(Candidat candidat);

    Candidat toEntity(CandidatForActionsDTO candidatDTO);

    // Langues Mapping
    LanguesDTO toLanguesDTO(Langues langues);
    Langues toEntity(LanguesDTO languesDTO);

    //ClientToActions
    ClientToActionsDTO toClientToActionsDTO(Client client);
    Client toEntity(ClientToActionsDTO clientToActionsDTO);


    // Certifications Mapping
    CertificationsDTO toCertificationsDTO(Certifications certifications);
    Certifications toEntity(CertificationsDTO certificationsDTO);

    // Experiences Mapping
    ExperiencesDTO toExperiencesDTO(Experiences experiences);
    Experiences toEntity(ExperiencesDTO experiencesDTO);

    // Formations Mapping
    FormationsDTO toFormationsDTO(Formations formations);
    Formations toEntity(FormationsDTO formationsDTO);

    // Profil Mapping
    ProfilDTO toProfilDTO(Profil profil);
    Profil toEntity(ProfilDTO profilDTO);

    // Referentiel Mapping
    ReferentielDTO toReferentielDTO(Referentiel referentiel);
    Referentiel toEntity(ReferentielDTO referentielDTO);

    // Rating Mapping
    RatingDTO toRatingDTO(Rating rating);
    Rating toEntity(RatingDTO ratingDTO);

    // Technology Mapping
    TechnologyDTO toTechnologyDTO(Technology technology);
    Technology toEntity(TechnologyDTO technologyDTO);

    // Actions Mapping
    ActionsSimpleDTO toActionsSimpleDTO(Actions actions);
    Actions toEntity(ActionsSimpleDTO actionsSimpleDTO);

    List<ActionsSimpleDTO> toActionsSimpleDTOList(List<Actions> actions);

    CandidatDTO toCnadidatDTO(Candidat candidat);
    Candidat toEntity(CandidatDTO candidatDTO);
    List<ActionsToCandidatDTO> toActionsToCandidatDTOList(List<Actions> actions);

    // List Mappings for collections
    List<LanguesDTO> toLanguesDTOList(List<Langues> langues);
    List<Langues> toLanguesEntityList(List<LanguesDTO> languesDTO);

    List<CertificationsDTO> toCertificationsDTOList(List<Certifications> certifications);
    List<Certifications> toCertificationsEntityList(List<CertificationsDTO> certificationsDTO);

    List<ExperiencesDTO> toExperiencesDTOList(List<Experiences> experiences);
    List<Experiences> toExperiencesEntityList(List<ExperiencesDTO> experiencesDTO);

    List<FormationsDTO> toFormationsDTOList(List<Formations> formations);
    List<Formations> toFormationsEntityList(List<FormationsDTO> formationsDTO);

    List<RatingDTO> toRatingDTOList(List<Rating> ratings);
    List<Rating> toRatingEntityList(List<RatingDTO> ratingsDTO);

    List<TechnologyDTO> toTechnologyDTOList(List<Technology> technologies);
    List<Technology> toTechnologyEntityList(List<TechnologyDTO> technologiesDTO);


    // Mapping simplifié
    ClientSimpleDTO toClientSimpleDTO(Client client);
    List<ClientSimpleDTO> toClientSimpleDTOList(List<Client> clients);

    SocieteDTO toSocieteDTO(Societe societe);
    // Client mappers
    ClientDTO toClientDTO(Client client);

    Client toEntity(ClientDTO clientDTO);

    // Besoins mappers
    BesoinsDTO toBesoinsDTO(Besoins besoins);

    Besoins toEntity(BesoinsDTO besoinsDTO);

  // Avoid circular dependency by not including besoins in SocieteSimpleDTO
    List<ClientDTO> toClientDTOList(List<Client> clients);

    List<BesoinsDTO> toBesoinsDTOList(List<Besoins> besoins);
    Societe toEntity(SocieteSimpleDTO societeSimpleDTO);

    // Other mappers


    ProspectionDTO toProspectionDTO(Prospection prospection);
    Prospection toEntity(ProspectionDTO prospectionDTO);

    ProfilReferentielDTO toProfilReferentielDTO(ProfilReferentiel profilReferentiel);
    ProfilReferentiel toEntity(ProfilReferentielDTO profilReferentielDTO);

    ProfilBesoinsDTO toProfilBesoinsDTO(ProfilBesoins profilBesoins);
    ProfilBesoins toEntity(ProfilBesoinsDTO profilBesoinsDTO);

    OrganigrammeDTO toOrganigrammeDTO(Organigramme organigramme);
    Organigramme toEntity(OrganigrammeDTO organigrammeDTO);

    MediaDTO toMediaDTO(Media media);
    Media toEntity(MediaDTO mediaDTO);

    LinkedInDTO toLinkedInDTO(LinkedIn linkedIn);
    LinkedIn toEntity(LinkedInDTO linkedInDTO);

    BesoinsTechnologiesDTO toBesoinsTechnologiesDTO(BesoinsTechnologies besoins);
    BesoinsTechnologies toEntity(BesoinsTechnologiesDTO technologiesDTO);

    // StatistiquesProfil Mapping
    StatistiquesProfilDTO toStatistiquesProfilDTO(StatistiquesProfil statistiquesProfil);
    StatistiquesProfil toEntity(StatistiquesProfilDTO statistiquesProfilDTO);

    // Segment Mapping
    SegmentDTO toSegmentDTO(Segment segment);
    Segment toEntity(SegmentDTO segmentDTO);

    // SousSegment Mapping
    SousSegmentDTO toSousSegmentDTO(SousSegment sousSegment);
    SousSegment toEntity(SousSegmentDTO sousSegmentDTO);

    // Technologie Mapping
    TechnologieDTO toTechnologieDTO(Technologie technologie);
    Technologie toEntity(TechnologieDTO technologieDTO);

    // List Mappings for collections (for StatistiquesProfil and its relations)
    List<SegmentDTO> toSegmentDTOList(List<Segment> segments);
    List<Segment> toSegmentEntityList(List<SegmentDTO> segmentDTOs);

    List<SousSegmentDTO> toSousSegmentDTOList(List<SousSegment> sousSegments);
    List<SousSegment> toSousSegmentEntityList(List<SousSegmentDTO> sousSegmentDTOs);

    List<TechnologieDTO> toTechnologieDTOList(List<Technologie> technologies);
    List<Technologie> toTechnologieEntityList(List<TechnologieDTO> technologieDTOs);

  
}
