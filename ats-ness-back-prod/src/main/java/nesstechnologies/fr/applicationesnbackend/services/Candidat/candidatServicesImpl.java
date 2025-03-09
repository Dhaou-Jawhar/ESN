package nesstechnologies.fr.applicationesnbackend.services.Candidat;

import com.cloudinary.Cloudinary;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import nesstechnologies.fr.applicationesnbackend.dto.CandidatDTO;
import nesstechnologies.fr.applicationesnbackend.entities.*;
import nesstechnologies.fr.applicationesnbackend.enumerations.EtatCandidat;
import nesstechnologies.fr.applicationesnbackend.enumerations.Role;
import nesstechnologies.fr.applicationesnbackend.exceptions.CustomException;
import nesstechnologies.fr.applicationesnbackend.mapper.EntitiesMapper;
import nesstechnologies.fr.applicationesnbackend.repositories.*;
import nesstechnologies.fr.applicationesnbackend.services.Authentication.AuthenticationService;
import org.hibernate.Hibernate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class candidatServicesImpl implements candidatServices{

    private final candidatRepository candidatRepo;
    private final UserRepo utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final Cloudinary cloudinary;
    private final UserRepo userRepo;
    private  final AuthenticationService authenticationService;
    private final ProfilRepository profilRepo;
    private final ProfilReferentielRepository profilReferentielRepo;
    private final ExperiencesRepository experiencesRepo;
    private final FormationsRepository formationsRepo;
    private final CertificationsRepository certificationsRepo;
    private final LanguesRepository languesRepo;
    private final ReferentielRepository referentielRepo;
    private final StatistiquesProfilRepository statestiquesProfilRepo;
    private final EntitiesMapper entitiesMapper;


    @Override
    public utilisateur createUser(utilisateur u) {
        utilisateur u1 = new utilisateur();
        u1.setPassword(passwordEncoder.encode(u.getPassword()));
        u1.setNom(u.getNom());
        u1.setPrenom(u.getPrenom());
        u1.setEmail(u.getEmail());
        u1.setRole(Role.CANDIDAT);
        u1.setEnabled(true);
        u1.setEmailVerif(true);

        // Save utilisateur
        utilisateurRepository.save(u1);
        return u1;
    }

//    @Override
//    public candidat createCandidat(utilisateur u, candidat candidateData, MultipartFile cvFile, MultipartFile imgFile) throws IOException {
//        // Check if the email already exists
//        String email = candidateData.getEmail();
//        utilisateur existingUser = userRepo.findByEmail2(email);
//        if (existingUser != null) {
//            throw new CustomException("L'email " + email + " existe déjà.");
//        }
//
//        // First, create and save the Utilisateur entity
//        utilisateur newUser = createUser(u);
//        utilisateur currentlyAuthUser = authenticationService.currentlyAuthenticatedUser();
//        String respo = (currentlyAuthUser.getNom()+" "+currentlyAuthUser.getPrenom());
//        // Create a new Candidat object linked to the utilisateur
//        candidat candidat = new candidat();
//        candidat.setUtilisateur(newUser);
//
//        // Handle CV upload
//        if (cvFile != null && !cvFile.isEmpty()) {
//            String cvUrl = cloudinary.uploader()
//                    .upload(cvFile.getBytes(), Map.of("public_id", UUID.randomUUID().toString()))
//                    .get("url").toString();
//            candidat.setCVUrl(cvUrl); // Set the CV URL in Candidat
//        }
//
//        // Handle image upload
//        if (imgFile != null && !imgFile.isEmpty()) {
//            String imgUrl = cloudinary.uploader()
//                    .upload(imgFile.getBytes(), Map.of("public_id", UUID.randomUUID().toString()))
//                    .get("url").toString();
//            newUser.setPictureUrl(imgUrl); // Set the Picture URL in Candidat
//            candidat.setPictureUrl(imgUrl);
//        }
//
//        // Set other Candidat details from the provided data
//        candidat.setTitre(candidateData.getTitre());
//        candidat.setTjmMin(candidateData.getTjmMin());
//        candidat.setTjmSouhaite(candidateData.getTjmSouhaite());
//        candidat.setSalaireMin(candidateData.getSalaireMin());
//        candidat.setSalaireSouhaite(candidateData.getSalaireSouhaite());
//        candidat.setEmail(candidateData.getEmail());
//        candidat.setTelephone(candidateData.getTelephone());
//        candidat.setNationalite(candidateData.getNationalite());
//        candidat.setAdresse(candidateData.getAdresse());
//        candidat.setVille(candidateData.getVille());
//        candidat.setCodePostal(candidateData.getCodePostal());
//        candidat.setDepartement(candidateData.getDepartement());
//        candidat.setEtat(EtatCandidat.ATraiter);
//        candidat.setNiveau(candidateData.getNiveau());
//        candidat.setProfils(candidateData.getProfils());
//        candidat.setResponsable(respo);
//        candidat.setCreationDateTime(LocalDateTime.now());
//        System.err.println(candidat.getResponsable());
//        candidat.setDisponibilite(candidateData.getDisponibilite());
//        candidat.setDateDeCreation(LocalDateTime.now());
//
//        candidat.setProfils(candidat.getProfils());
//        // Set technology fields (Lists) from the provided data
//        candidat.setWebFrontTechnologies(candidateData.getWebFrontTechnologies());
//        candidat.setWebBackTechnologies(candidateData.getWebBackTechnologies());
//        candidat.setAutomatisationTestTechnologies(candidateData.getAutomatisationTestTechnologies());
//        candidat.setWebFullStackTechnologies(candidateData.getWebFullStackTechnologies());
//        candidat.setSoftwareTechnologies(candidateData.getSoftwareTechnologies());
//        candidat.setMobileTechnologies(candidateData.getMobileTechnologies());
//        candidat.setIaTechnologies(candidateData.getIaTechnologies());
//        candidat.setTestAutomationTechnologies(candidateData.getTestAutomationTechnologies());
//        candidat.setBlockchainTechnologies(candidateData.getBlockchainTechnologies());
//        candidat.setEmbeddedSystemsTechnologies(candidateData.getEmbeddedSystemsTechnologies());
//        candidat.setApiTechnologies(candidateData.getApiTechnologies());
//        candidat.setDevOpsTechnologies(candidateData.getDevOpsTechnologies());
//        candidat.setIoTTechnologies(candidateData.getIoTTechnologies());
//        candidat.setCrmerpTechnologies(candidateData.getCrmerpTechnologies());
//        candidat.setCmsTechnologies(candidateData.getCmsTechnologies());
//        candidat.setLowCodeNoCodeTechnologies(candidateData.getLowCodeNoCodeTechnologies());
//
//        // Set other details
//        candidat.setDateDerniereMiseAJour(LocalDate.now());
//
//        // Save the Candidat entity
//        candidatRepo.save(candidat);
//
//        return candidat;
//    }


    @Override
    public Candidat getCandidatById(int id) {
        // Rechercher le candidat par ID
        Optional<Candidat> candidatOpt = candidatRepo.findById(id);

        if (candidatOpt.isEmpty()) {
            throw new EntityNotFoundException("Candidat avec l'ID " + id + " n'existe pas.");
        }

        Candidat candidat = candidatOpt.get();
        StatistiquesProfil stats = candidat.getStatistiquesProfil();

        if (stats != null) {
            // Trier les segments par segmentValue
            List<Segment> sortedSegments = stats.getSegments().stream()
                    .sorted((s1, s2) -> Double.compare(
                            Double.parseDouble(s2.getSegmentValue().replace("%", "")),
                            Double.parseDouble(s1.getSegmentValue().replace("%", ""))
                    ))
                    .toList();
            stats.setSegments(sortedSegments);

            // Trier les sous-segments par sousSegmentValue
            List<SousSegment> sortedSousSegments = stats.getSousSegments().stream()
                    .sorted((ss1, ss2) -> Double.compare(
                            Double.parseDouble(ss2.getSousSegmentValue().replace("%", "")),
                            Double.parseDouble(ss1.getSousSegmentValue().replace("%", ""))
                    ))
                    .toList();
            stats.setSousSegments(sortedSousSegments);

            // Trier les technologies par technoValue
            List<Technologie> sortedTechnologies = stats.getTechnologie().stream()
                    .sorted((t1, t2) -> Double.compare(
                            Double.parseDouble(t2.getTechnoValue().replace("%", "")),
                            Double.parseDouble(t1.getTechnoValue().replace("%", ""))
                    ))
                    .toList();
            stats.setTechnologie(sortedTechnologies);
        }

        return candidat;
    }


    @Override
    @Transactional
    public Candidat updateCandidat(int id, Candidat updatedCandidatData) throws IOException {
        // Vérifier si le candidat existe
        Optional<Candidat> optionalCandidat = candidatRepo.findById(id);
        if (!optionalCandidat.isPresent()) {
            throw new EntityNotFoundException("Candidat non trouvé");
        }

        Candidat existingCandidat = optionalCandidat.get();

        // Mise à jour des détails de base du candidat
        updateBasicDetails(existingCandidat, updatedCandidatData);

        // Mise à jour des profils
        if (updatedCandidatData.getProfils() != null) {
            updateProfils(existingCandidat, updatedCandidatData.getProfils());
        }

        // Mise à jour des référentiels
        if (updatedCandidatData.getReferentiels() != null) {
            updateReferentiels(existingCandidat, updatedCandidatData.getReferentiels());
        }

        // Mise à jour des expériences
        if (updatedCandidatData.getExperiences() != null) {
            updateExperiences(existingCandidat, updatedCandidatData.getExperiences());
        }

        // Mise à jour des certifications
        if (updatedCandidatData.getCertifications() != null) {
            updateCertifications(existingCandidat, updatedCandidatData.getCertifications());
        }

        // Mise à jour des certifications
        if (updatedCandidatData.getLangues() != null) {
            updateLangues(existingCandidat, updatedCandidatData.getLangues());
        }

        // Mise à jour des formations
        if (updatedCandidatData.getFormations() != null) {
            updateFormations(existingCandidat, updatedCandidatData.getFormations());
        }

        // Sauvegarder les modifications
        return candidatRepo.save(existingCandidat);
    }
    // Méthode pour mettre à jour les détails basiques du candidat
    private void updateBasicDetails(Candidat existingCandidat, Candidat updatedCandidatData) {
        existingCandidat.setNom(updatedCandidatData.getNom());
        existingCandidat.setPrenom(updatedCandidatData.getPrenom());
        existingCandidat.setEmail(updatedCandidatData.getEmail());
        existingCandidat.setEmailSecondaire(updatedCandidatData.getEmailSecondaire());
        existingCandidat.setTitre(updatedCandidatData.getTitre());
        existingCandidat.setDateDerniereMiseAJour(LocalDateTime.now());

        if (updatedCandidatData.getTjmMin() != null) {
            existingCandidat.setTjmMin(updatedCandidatData.getTjmMin());
        }
        if (updatedCandidatData.getTjmSouhaite() != null) {
            existingCandidat.setTjmSouhaite(updatedCandidatData.getTjmSouhaite());
        }
        if (updatedCandidatData.getSalaireMin() != null) {
            existingCandidat.setSalaireMin(updatedCandidatData.getSalaireMin());
        }
        if (updatedCandidatData.getSalaireSouhaite() != null) {
            existingCandidat.setSalaireSouhaite(updatedCandidatData.getSalaireSouhaite());
        }

        existingCandidat.setStatusCandidat(updatedCandidatData.getStatusCandidat());
        existingCandidat.setComplement(updatedCandidatData.getComplement());
        existingCandidat.setCommentaireGeneralite(updatedCandidatData.getCommentaireGeneralite());
        existingCandidat.setJobboard(updatedCandidatData.getJobboard());
        existingCandidat.setAmbassadeur(updatedCandidatData.isAmbassadeur());
        existingCandidat.setEcouteDuMarche(updatedCandidatData.isEcouteDuMarche());
        existingCandidat.setCvAJour(updatedCandidatData.isCvAJour());
        existingCandidat.setSouhaitsCandidat(updatedCandidatData.getSouhaitsCandidat());
        existingCandidat.setDureeTrajet(updatedCandidatData.getDureeTrajet());
        existingCandidat.setDureeGarePrincipale(updatedCandidatData.getDureeGarePrincipale());
        existingCandidat.setDepartementTrajet(updatedCandidatData.getDepartementTrajet());
        existingCandidat.setReferencesClients(updatedCandidatData.getReferencesClients());
        existingCandidat.setDossierCompetences(updatedCandidatData.isDossierCompetences());
        existingCandidat.setDateMissions(updatedCandidatData.isDateMissions());
        existingCandidat.setFormatWord(updatedCandidatData.isFormatWord());
        existingCandidat.setHabilitable(updatedCandidatData.isHabilitable());
        existingCandidat.setJesaispas(updatedCandidatData.isJesaispas());
        existingCandidat.setPreavis(updatedCandidatData.getPreavis());
        existingCandidat.setTJM(updatedCandidatData.getTJM());
        existingCandidat.setSalaire(updatedCandidatData.getSalaire());
        existingCandidat.setTelephone(updatedCandidatData.getTelephone());
        existingCandidat.setNationalite(updatedCandidatData.getNationalite());
        existingCandidat.setAdresse(updatedCandidatData.getAdresse());
        existingCandidat.setVille(updatedCandidatData.getVille());
        existingCandidat.setCodePostal(updatedCandidatData.getCodePostal());
        existingCandidat.setDepartement(updatedCandidatData.getDepartement());
        existingCandidat.setInfosAClarifier(updatedCandidatData.getInfosAClarifier());
        existingCandidat.setComments(updatedCandidatData.getComments());
        existingCandidat.setCVNess(updatedCandidatData.getCVNess());
        existingCandidat.setCVUrl(updatedCandidatData.getCVUrl());
        existingCandidat.setPictureUrl(updatedCandidatData.getPictureUrl());
        existingCandidat.setReferencesClients(updatedCandidatData.getReferencesClients());

        if (updatedCandidatData.getNiveau() != null) {
            existingCandidat.setNiveau(updatedCandidatData.getNiveau());
        }
    }

    // Méthode pour mettre à jour les profils
    private void updateProfils(Candidat existingCandidat, List<Profil> newProfils) {
        profilRepo.deleteAll(existingCandidat.getProfils());

        List<Profil> updatedProfils = newProfils.stream().map(profil -> {
            Profil newProfil = new Profil();
            newProfil.setNom(profil.getNom());
            newProfil.setLien(profil.getLien());
            newProfil.setCandidat(existingCandidat);
            return newProfil;
        }).collect(Collectors.toList());

        existingCandidat.setProfils(updatedProfils);
        profilRepo.saveAll(updatedProfils);
    }

    private void updateReferentiels(Candidat existingCandidat, List<Referentiel> newReferentiels) {
        // Récupérer les référentiels existants
        List<Referentiel> existingReferentiels = existingCandidat.getReferentiels();

        // Supprimer les profils liés pour chaque référentiel existant
        if (existingReferentiels != null) {
            for (Referentiel referentiel : existingReferentiels) {
                if (referentiel.getProfilReferentiels() != null) {
                    profilReferentielRepo.deleteAll(referentiel.getProfilReferentiels());
                }
            }
            referentielRepo.deleteAll(existingReferentiels); // Supprimer les référentiels après avoir supprimé leurs profils
        }

        // Créer les nouveaux référentiels et leurs profils
        List<Referentiel> updatedReferentiels = newReferentiels.stream().map(ref -> {
            Referentiel newReferentiel = new Referentiel();

            // Mettre à jour les profils associés
            if (ref.getProfilReferentiels() != null) {
                List<ProfilReferentiel> newProfilReferentiels = ref.getProfilReferentiels().stream().map(profilRef -> {
                    ProfilReferentiel newProfilReferentiel = new ProfilReferentiel();
                    newProfilReferentiel.setProfil(profilRef.getProfil());
                    newProfilReferentiel.setNiveau(profilRef.getNiveau());
                    newProfilReferentiel.setReferentiel(newReferentiel);
                    return newProfilReferentiel;
                }).collect(Collectors.toList());
                newReferentiel.setProfilReferentiels(newProfilReferentiels);
            }

            newReferentiel.setSegments(ref.getSegments());
            newReferentiel.setSousSegments(ref.getSousSegments());
            newReferentiel.setTechnologie(ref.getTechnologie());
            newReferentiel.setCandidat(existingCandidat);

            return newReferentiel;
        }).collect(Collectors.toList());

        // Sauvegarder les nouveaux référentiels
        referentielRepo.saveAll(updatedReferentiels);

        // Mettre à jour les référentiels du candidat
        existingCandidat.setReferentiels(updatedReferentiels);
    }


    // Méthode pour mettre à jour les expériences
    private void updateExperiences(Candidat existingCandidat, List<Experiences> newExperiences) {
        experiencesRepo.deleteAll(existingCandidat.getExperiences());

        List<Experiences> updatedExperiences = newExperiences.stream().map(exp -> {
            Experiences newExperience = new Experiences();
            newExperience.setTitre(exp.getTitre());
            newExperience.setDateDeb(exp.getDateDeb());
            newExperience.setDateFin(exp.getDateFin());
            newExperience.setClient(exp.getClient());
            newExperience.setDescription(exp.getDescription());
            newExperience.setCandidat1(existingCandidat);
            return newExperience;
        }).collect(Collectors.toList());

        existingCandidat.setExperiences(updatedExperiences);
        experiencesRepo.saveAll(updatedExperiences);
    }

    // Méthode pour mettre à jour les certifications
    private void updateCertifications(Candidat existingCandidat, List<Certifications> newCertifications) {
        certificationsRepo.deleteAll(existingCandidat.getCertifications());

        List<Certifications> updatedCertifications = newCertifications.stream().map(cert -> {
            Certifications newCertification = new Certifications();
            newCertification.setTitreCertif(cert.getTitreCertif());
            newCertification.setEtablissementCertif(cert.getEtablissementCertif());
            newCertification.setPaysCertif(cert.getPaysCertif());
            newCertification.setCommentaireCertif(cert.getCommentaireCertif());
            newCertification.setAnneeObtentionCertif(cert.getAnneeObtentionCertif());
            newCertification.setCandidat(existingCandidat);
            return newCertification;
        }).collect(Collectors.toList());

        existingCandidat.setCertifications(updatedCertifications);
        certificationsRepo.saveAll(updatedCertifications);
    }

    // Méthode pour mettre à jour les formations
    // Log des formations avant et après la mise à jour
    private void updateFormations(Candidat existingCandidat, List<Formations> newFormations) {
        if (newFormations != null) {
            // Afficher les formations envoyées
            System.out.println("Formations envoyées : " + newFormations);

            // Supprimer les anciennes formations
            formationsRepo.deleteAll(existingCandidat.getFormations());

            // Log après suppression
            System.err.println("Anciennes formations supprimées.");

            // Création des nouvelles formations
            List<Formations> updatedFormations = newFormations.stream().map(formation -> {
                Formations newFormation = new Formations();
                newFormation.setTitre(formation.getTitre());
                newFormation.setEtablissement(formation.getEtablissement());
                newFormation.setAnneeObtention(formation.getAnneeObtention());
                newFormation.setCommentaire(formation.getCommentaire());
                newFormation.setPays(formation.getPays());
                newFormation.setCandidat(existingCandidat);

                // Log de chaque formation ajoutée
                System.out.println("Nouvelle formation ajoutée : " + newFormation);
                return newFormation;
            }).collect(Collectors.toList());

            // Associer les nouvelles formations au candidat
            existingCandidat.setFormations(updatedFormations);

            // Sauvegarder les formations
            formationsRepo.saveAll(updatedFormations);
            System.err.println("Formations sauvegardées : " + updatedFormations);
        }
    }



    private void updateLangues(Candidat existingCandidat, List<Langues> newLangues) {
        if (newLangues != null) {
            // Afficher les formations envoyées
            System.out.println("Formations envoyées : " + newLangues);

            // Supprimer les anciennes formations
            languesRepo.deleteAll(existingCandidat.getLangues());

            // Log après suppression
            System.err.println("Anciennes formations supprimées.");

            // Création des nouvelles formations
            List<Langues> updatedLangues = newLangues.stream().map(formation -> {
                Langues newLangue = new Langues();
                newLangue.setName(formation.getName());
                newLangue.setCommentaire(formation.getCommentaire());
                newLangue.setLev(formation.getLev());
                newLangue.setCandidat(existingCandidat);

                // Log de chaque formation ajoutée
                System.out.println("Nouvelle formation ajoutée : " + newLangue);
                return newLangue;
            }).collect(Collectors.toList());

            // Associer les nouvelles formations au candidat
            existingCandidat.setLangues(updatedLangues);

            // Sauvegarder les formations
            languesRepo.saveAll(updatedLangues);
            System.err.println("Formations sauvegardées : " + updatedLangues);
        }
    }

    private StatistiquesProfil mapToStatestiquesProfil(Candidat candidat, StatistiquesProfil existingStatsParam) {
        final StatistiquesProfil stats = (existingStatsParam == null) ? new StatistiquesProfil() : existingStatsParam;

        // Clear existing lists to prevent duplicates
        stats.getSegments().clear();
        stats.getSousSegments().clear();
        stats.getTechnologie().clear();

        // Map Segments
        if (candidat.getStatistiquesProfil() != null && candidat.getStatistiquesProfil().getSegments() != null) {
            candidat.getStatistiquesProfil().getSegments().forEach(segment -> {
                Segment newSegment = new Segment();
                newSegment.setSegmentKey(segment.getSegmentKey());
                newSegment.setSegmentValue(segment.getSegmentValue());
                newSegment.setStatistiquesProfil(stats); // Association bidirectionnelle
                stats.getSegments().add(newSegment); // Ajout au StatistiquesProfil
            });
        }

        // Map SousSegments
        if (candidat.getStatistiquesProfil() != null && candidat.getStatistiquesProfil().getSousSegments() != null) {
            candidat.getStatistiquesProfil().getSousSegments().forEach(sousSegment -> {
                SousSegment newSousSegment = new SousSegment();
                newSousSegment.setSousSegmentKey(sousSegment.getSousSegmentKey());
                newSousSegment.setSousSegmentValue(sousSegment.getSousSegmentValue());
                newSousSegment.setStatistiquesProfil(stats); // Association bidirectionnelle
                stats.getSousSegments().add(newSousSegment); // Ajout au StatistiquesProfil
            });
        }

        // Map Technologies
        if (candidat.getStatistiquesProfil() != null && candidat.getStatistiquesProfil().getTechnologie() != null) {
            candidat.getStatistiquesProfil().getTechnologie().forEach(technologie -> {
                Technologie newTechnologie = new Technologie();
                newTechnologie.setTechnoKey(technologie.getTechnoKey());
                newTechnologie.setTechnoValue(technologie.getTechnoValue());
                newTechnologie.setStatistiquesProfil(stats); // Association bidirectionnelle
                stats.getTechnologie().add(newTechnologie); // Ajout au StatistiquesProfil
            });
        }

        stats.setCandidat(candidat);
        return stats;
    }



    @Override
    @Transactional
    public Candidat createCandidat(
            Candidat c, // Données mises à jour du candidat
            MultipartFile cvFile
    ) throws IOException {

        utilisateur currentlyAuthUser = authenticationService.currentlyAuthenticatedUser();
        String respo = (currentlyAuthUser.getNom()+" "+currentlyAuthUser.getPrenom());
        // Mettre à jour les détails basiques du candidat
        c.setNom(c.getNom());
        c.setPrenom(c.getPrenom());
        c.setEmail(c.getEmail());
        c.setEmailSecondaire(c.getEmailSecondaire());
        c.setResponsable(respo);
        c.setTitre(c.getTitre());
        c.setTjmMin(c.getTjmMin());
        c.setTjmSouhaite(c.getTjmSouhaite());
        c.setSalaireMin(c.getSalaireMin());
        c.setSalaireSouhaite(c.getSalaireSouhaite());
        c.setEmail(c.getEmail());
        c.setStatusCandidat(c.getStatusCandidat());
        c.setEmailSecondaire(c.getEmailSecondaire());
        c.setComplement(c.getComplement());
        c.setCommentaireGeneralite(c.getCommentaireGeneralite());
        c.setJobboard(c.getJobboard());
        c.setAmbassadeur(c.isAmbassadeur());
        c.setEcouteDuMarche(c.isEcouteDuMarche());
        c.setCvAJour(c.isCvAJour());
        c.setSouhaitsCandidat(c.getSouhaitsCandidat());
        c.setDureeTrajet(c.getDureeTrajet());
        c.setDureeGarePrincipale(c.getDureeGarePrincipale());
        c.setDepartementTrajet(c.getDepartementTrajet());
        c.setReferencesClients(c.getReferencesClients());
        c.setDossierCompetences(c.isDossierCompetences());
        c.setDateMissions(c.isDateMissions());
        c.setFormatWord(c.isFormatWord());
        c.setHabilitable(c.isHabilitable());
        c.setJesaispas(c.isJesaispas());
        c.setPreavis(c.getPreavis());
        c.setTJM(c.getTJM());
        c.setSalaire(c.getSalaire());
        c.setTelephone(c.getTelephone());
        c.setNationalite(c.getNationalite());
        c.setAdresse(c.getAdresse());
        c.setVille(c.getVille());
        c.setCodePostal(c.getCodePostal());
        c.setDepartement(c.getDepartement());
        c.setInfosAClarifier(c.getInfosAClarifier());
        c.setComments(c.getComments());
        c.setTitre(c.getTitre());
        c.setTjmMin(c.getTjmMin());
        c.setTjmSouhaite(c.getTjmSouhaite());
        c.setSalaireMin(c.getSalaireMin());
        c.setSalaireSouhaite(c.getSalaireSouhaite());
        c.setEmail(c.getEmail());
        c.setTelephone(c.getTelephone());
        c.setNationalite(c.getNationalite());
        c.setAdresse(c.getAdresse());
        c.setVille(c.getVille());
        c.setCodePostal(c.getCodePostal());
        c.setDepartement(c.getDepartement());
        c.setEtat(EtatCandidat.ATraiter);
        c.setNiveau(c.getNiveau());
        c.setProfils(c.getProfils());
        c.setResponsable(respo);
        c.setCreationDateTime(LocalDateTime.now());
        c.setDisponibilite(c.getDisponibilite());
        c.setDateDeCreation(LocalDateTime.now());
        c.setDateDerniereMiseAJour(LocalDateTime.now());

        // Mise à jour des profils
        if (c.getProfils() != null) {
            // Supprimer les anciens profils

            // Ajouter les nouveaux profils
            List<Profil> newProfils = c.getProfils().stream().map(profil -> {
                Profil newProfil = new Profil();
                newProfil.setNom(profil.getNom());
                newProfil.setLien(profil.getLien());
                newProfil.setCandidat(c);
                return newProfil;
            }).collect(Collectors.toList());

            profilRepo.saveAll(newProfils); // Enregistrer tous les nouveaux profils
            c.setProfils(newProfils); // Mettre à jour les profils de l'existant
        }

        // Mise à jour ou création de la statistique du profil
        // Traiter les statistiques
        if (c.getStatistiquesProfil() != null) {
            StatistiquesProfil stats = mapToStatestiquesProfil(c, null);
            statestiquesProfilRepo.save(stats);
            c.setStatistiquesProfil(stats);
        }




        if (c.getReferentiels() != null) {
            // Supprimer les anciens profils
            List<Referentiel> newReferentiels = c.getReferentiels().stream().map(ref -> {
                Referentiel newReferentiel = new Referentiel();
                //  newReferentiel.setProfil(ref.getProfil());
                newReferentiel.setSegments(ref.getSegments());
                newReferentiel.setSousSegments(ref.getSousSegments());
                newReferentiel.setTechnologie(ref.getTechnologie());
                newReferentiel.setCandidat(c);
                return newReferentiel;
            }).collect(Collectors.toList());

            referentielRepo.saveAll(newReferentiels);
            c.setReferentiels(newReferentiels);
        }

        // Mise à jour des expériences
        if (c.getExperiences() != null) {
            // Supprimer les anciennes expériences

            // Ajouter les nouvelles expériences
            List<Experiences> newExperiences = c.getExperiences().stream().map(exp -> {
                Experiences newExperience = new Experiences();
                newExperience.setTitre(exp.getTitre());
                newExperience.setDateDeb(exp.getDateDeb());
                newExperience.setDateFin(exp.getDateFin());
                newExperience.setClient(exp.getClient());
                newExperience.setDescription(exp.getDescription());
                newExperience.setCandidat1(c); // Associer l'expérience au candidat
                return newExperience;
            }).collect(Collectors.toList());

            experiencesRepo.saveAll(newExperiences); // Enregistrer toutes les nouvelles expériences
            c.setExperiences(newExperiences);
        }

        // Mise à jour des certifications
        if (c.getCertifications() != null) {
            // Supprimer les anciennes certifications

            // Ajouter les nouvelles certifications
            List<Certifications> newCertifications = c.getCertifications().stream().map(cert -> {
                Certifications newCertification = new Certifications();
                newCertification.setTitreCertif(cert.getTitreCertif());
                newCertification.setEtablissementCertif(cert.getEtablissementCertif());
                newCertification.setPaysCertif(cert.getPaysCertif());
                newCertification.setCommentaireCertif(cert.getCommentaireCertif());
                newCertification.setAnneeObtentionCertif(cert.getAnneeObtentionCertif());
                newCertification.setCandidat(c); // Associer la certification au candidat
                return newCertification;
            }).collect(Collectors.toList());

            certificationsRepo.saveAll(newCertifications); // Enregistrer toutes les nouvelles certifications
            c.setCertifications(newCertifications);
        }

        // Mise à jour des langues
        if (c.getLangues() != null) {
            // Supprimer les anciennes langues

            // Ajouter les nouvelles langues
            List<Langues> newLangues = c.getLangues().stream().map(langue -> {
                Langues newLangue = new Langues();
                newLangue.setName(langue.getName());
                newLangue.setLev(langue.getLev());
                newLangue.setCandidat(c); // Associer la langue au candidat
                return newLangue;
            }).collect(Collectors.toList());

            languesRepo.saveAll(newLangues); // Enregistrer toutes les nouvelles langues
            c.setLangues(newLangues);
        }

        // Mise à jour des formations
        if (c.getFormations() != null) {
            // Supprimer les anciennes formations

            // Ajouter les nouvelles formations
            List<Formations> newFormations = c.getFormations().stream().map(formation -> {
                Formations newFormation = new Formations();
                newFormation.setTitre(formation.getTitre());
                newFormation.setEtablissement(formation.getEtablissement());
                newFormation.setAnneeObtention(formation.getAnneeObtention());
                newFormation.setCommentaire(formation.getCommentaire());
                newFormation.setCandidat(c); // Associer la formation au candidat
                return newFormation;
            }).collect(Collectors.toList());

            formationsRepo.saveAll(newFormations); // Enregistrer toutes les nouvelles formations
            c.setFormations(newFormations);
        }

        // Mise à jour du CV
        if (cvFile != null && !cvFile.isEmpty()) {
            String cvUrl = uploadFileToCloudinary(cvFile);
            c.setCVUrl(cvUrl);
        }


        // Sauvegarder les changements du candidat
        candidatRepo.save(c);
        return c;
    }

    // Méthode pour uploader les fichiers sur Cloudinary
    private String uploadFileToCloudinary(MultipartFile file) throws IOException {
        return cloudinary.uploader()
                .upload(file.getBytes(), Map.of("public_id", UUID.randomUUID().toString()))
                .get("url").toString();
    }










    @Override
    public void deleteCandidat(int id) {
        if (!candidatRepo.existsById(id)) {
            throw new CustomException("Candidat avec ID " + id + " non trouvé.");
        }
        candidatRepo.deleteById(id);
    }



    @Override
    public Page<CandidatDTO> getAllCandidats(int page, int size) {
        // Création de la pagination avec les paramètres page et size
        Pageable pageable = PageRequest.of(page, size);

        // Récupération de la page d'actions
        Page<Candidat> candidatPage = candidatRepo.findAll(pageable);

        // Mapping des entités Actions en ActionsSimpleDTO
        Page<CandidatDTO> actionsDTOPage = candidatPage.map(entitiesMapper::toCnadidatDTO);

        return actionsDTOPage;
    }


    @Override
    public Candidat updateEtat(int id, String etat) {

        Candidat c = candidatRepo.findById(id).get();

            EtatCandidat etatEnum = EtatCandidat.valueOf(etat);
            c.setEtat(etatEnum);

        // Save and return the updated candidate
        Candidat updatedCandidat = candidatRepo.save(c);

        return updatedCandidat;
    }

    @Override
    public int countAddedCandidatesInInterval() {
        utilisateur currentlyAuthUser = authenticationService.currentlyAuthenticatedUser();
        LocalDateTime lastLogin = currentlyAuthUser.getlastLogin();
        LocalDateTime justLogged = currentlyAuthUser.getJustLogged();
        return userRepo.countCandidatesAddedInInterval(lastLogin,justLogged);
    }

    public Candidat updateCandidatFiles(int id ,
                                        MultipartFile cvFile, // Fichier CV
                                        MultipartFile imgFile, // Fichier image
                                        MultipartFile cvNessFile ){
    Candidat existingCandidat =candidatRepo.findById(id).get();
        try {
        // Mise à jour du CV
        if (cvFile != null && !cvFile.isEmpty()) {
            String cvUrl = uploadFileToCloudinary(cvFile);
            existingCandidat.setCVUrl(cvUrl);
            System.err.println("CV URL set: " + cvUrl);
        }

        // Mise à jour de l'image
        if (imgFile != null && !imgFile.isEmpty()) {
            String imgUrl = uploadFileToCloudinary(imgFile);
            existingCandidat.setPictureUrl(imgUrl);
            System.err.println("Image URL set: " + imgUrl);
        }

        // Mise à jour du CV Ness
        if (cvNessFile != null && !cvNessFile.isEmpty()) {
            String cvNessUrl = uploadFileToCloudinary(cvNessFile);
            existingCandidat.setCVNess(cvNessUrl);
            System.err.println("CV Ness URL set: " + cvNessUrl);
        }
    } catch (IOException e) {
        System.out.println("Error uploading file: " + e.getMessage());
    }
        candidatRepo.save(existingCandidat);
        return existingCandidat;
    }



    @Transactional
    public List<Actions> getActionsByCandidatId(int candidatId) {
        Candidat candidat = candidatRepo.findById(candidatId)
                .orElseThrow(() -> new EntityNotFoundException("Candidat avec ID " + candidatId + " non trouvé."));

        List<Actions> actions = candidat.getActions();
        actions.forEach(action -> Hibernate.initialize(action.getBesoin())); // Initialiser les relations nécessaires
        return actions;
    }

    @Override
    public long getTotalCandidats() {
        return candidatRepo.count(); // Méthode fournie par JpaRepository

    }

    public long getNombreCandidatsRessource() {
        return candidatRepo.countByEtat(EtatCandidat.Ressource);
    }

    @Override
    public Map<String, Long> getNombreCandidatsVivier() {
        // Créer un map pour stocker les résultats
        Map<String, Long> result = new HashMap<>();

        // Compter les candidats pour l'état "Vivier"
        long nbrVivier = candidatRepo.countByEtatVivier(new EtatCandidat[] { EtatCandidat.Vivier });
        result.put("vivier", nbrVivier);

        // Compter les candidats pour l'état "Top Vivier"
        long nbrTopVivier = candidatRepo.countByEtatVivier(new EtatCandidat[] { EtatCandidat.TopVivier });
        result.put("TopVivier", nbrTopVivier);

        return result;
    }

    @Override
    public Map<String, Object> getPourcentageCandidatsVivier() {
        // Compter le nombre total de candidats
        long totalCandidats = candidatRepo.count();

        // Compter le nombre de candidats dans l'état "Vivier"
        long nbrVivier = candidatRepo.countByEtatVivier(new EtatCandidat[] { EtatCandidat.Vivier });

        // Calculer le pourcentage
        double pourcentage = (totalCandidats == 0) ? 0 : ((double) nbrVivier / totalCandidats) * 100;

        // Créer un Map pour retourner le nombre et le pourcentage
        Map<String, Object> response = new HashMap<>();
        response.put("nbrVivier", nbrVivier); // Nombre de candidats Vivier
        response.put("pourcentageVivier", String.format("%.2f %%", pourcentage)); // Pourcentage de Vivier

        return response;
    }


    @Override
    public Map<String, Object> getPourcentageCandidatsTopVivier() {
        // Compter le nombre total de candidats
        long totalCandidats = candidatRepo.count();

        // Compter le nombre de candidats dans l'état "Top Vivier"
        long nbrTopVivier = candidatRepo.countByEtatVivier(new EtatCandidat[] { EtatCandidat.TopVivier });

        // Calculer le pourcentage
        double pourcentage = (totalCandidats == 0) ? 0 : ((double) nbrTopVivier / totalCandidats) * 100;

        // Créer un Map pour retourner le nombre et le pourcentage
        Map<String, Object> response = new HashMap<>();
        response.put("nbrTopVivier", nbrTopVivier); // Nombre de candidats Top Vivier
        response.put("pourcentageTopVivier", String.format("%.2f %%", pourcentage)); // Pourcentage de Top Vivier

        return response;
    }



    @Override
    public Map<String, Object> getPourcentageCandidatsEnCoursDeQualification() {
        // Compter le nombre total de candidats
        long totalCandidats = candidatRepo.count();

        // Compter le nombre de candidats dans l'état "En Cours de Qualification"
        long nbrEnCoursDeQualification = candidatRepo.countByEtatVivier(new EtatCandidat[] { EtatCandidat.EnCoursDeQualification });

        // Calculer le pourcentage
        double pourcentage = (totalCandidats == 0) ? 0 : ((double) nbrEnCoursDeQualification / totalCandidats) * 100;

        // Créer un Map pour retourner le nombre et le pourcentage
        Map<String, Object> response = new HashMap<>();
        response.put("nbrEnCoursDeQualification", nbrEnCoursDeQualification); // Nombre de candidats En Cours de Qualification
        response.put("pourcentageEnCoursDeQualification", String.format("%.2f %%", pourcentage)); // Pourcentage de En Cours de Qualification

        return response;
    }


    @Override
    public Map<String, Object> getPourcentageCandidatsNonVivierTopVivierEnCours() {
        // Compter le nombre total de candidats
        long totalCandidats = candidatRepo.count();

        // Compter les candidats qui ne sont pas dans les trois états spécifiés
        long nbrNonVivierTopVivierEnCours = candidatRepo.countByEtatNotIn(
                Arrays.asList(EtatCandidat.Vivier, EtatCandidat.TopVivier, EtatCandidat.EnCoursDeQualification)
        );

        // Calculer le pourcentage
        double pourcentage = (totalCandidats == 0) ? 0 : ((double) nbrNonVivierTopVivierEnCours / totalCandidats) * 100;

        // Construire la réponse
        Map<String, Object> response = new HashMap<>();
        response.put("nbrCandidatsNonVivierTopVivierEnCours", nbrNonVivierTopVivierEnCours); // Nombre total
        response.put("pourcentage", String.format("%.2f %%", pourcentage)); // Pourcentage

        return response;
    }




}
