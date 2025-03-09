package nesstechnologies.fr.applicationesnbackend.services.Client;

import com.cloudinary.Cloudinary;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.transaction.Transactional;
import nesstechnologies.fr.applicationesnbackend.dto.ActionsSimpleDTO;
import nesstechnologies.fr.applicationesnbackend.dto.ClientDTO;
import nesstechnologies.fr.applicationesnbackend.dto.SocieteSimpleDTO;
import nesstechnologies.fr.applicationesnbackend.entities.*;
import nesstechnologies.fr.applicationesnbackend.mapper.EntitiesMapper;
import nesstechnologies.fr.applicationesnbackend.repositories.*;
import nesstechnologies.fr.applicationesnbackend.services.Authentication.AuthenticationService;
import nesstechnologies.fr.applicationesnbackend.services.Besoins.BesoinsServices;
import nesstechnologies.fr.applicationesnbackend.services.Societe.SocieteServices;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ClientServicesImpl implements ClientServices {
    private final ClientRepository clientRepository;
    private final SocieteRepository societeRepository;
    private  final AuthenticationService authenticationService;
    private final BesoinsServices besoinsServices;
    private final Cloudinary cloudinary;
    private final mediaRepo mediaRep;
    private final BesoinsRepository besoinsRepository;
    private final ProfilBesoinsRepository profilBesoinsRepository;
    private final ReferentielRepository referentielRepository;
    private final BesoinsTechnologiesReppository besoinsTechnologiesReppository;
    private final EntitiesMapper entitiesMapper;

    public ClientServicesImpl(ClientRepository clientRepository, SocieteRepository societeRepository, AuthenticationService authenticationService, SocieteServices societeServices, BesoinsServices besoinsServices, Cloudinary cloudinary, mediaRepo mediaRep, BesoinsRepository besoinsRepository, ProfilBesoinsRepository profilBesoinsRepository, ReferentielRepository referentielRepository, BesoinsTechnologiesReppository besoinsTechnologiesReppository, EntitiesMapper entitiesMapper) {
        this.clientRepository = clientRepository;
        this.societeRepository = societeRepository;
        this.authenticationService = authenticationService;
        this.besoinsServices = besoinsServices;
        this.cloudinary = cloudinary;
        this.mediaRep = mediaRep;
        this.besoinsRepository = besoinsRepository;
        this.profilBesoinsRepository = profilBesoinsRepository;
        this.referentielRepository = referentielRepository;
        this.besoinsTechnologiesReppository = besoinsTechnologiesReppository;
        this.entitiesMapper = entitiesMapper;
    }

    @Override
    public Client createClient(Client c) throws Exception {
        utilisateur currentlyAuthUser = authenticationService.currentlyAuthenticatedUser();
        String manager = currentlyAuthUser.getNom() + " " + currentlyAuthUser.getPrenom();
        c.setManager(manager);
        c.setDateDeCreation(LocalDateTime.now());
        c.setDateDerniereMiseAJour(LocalDateTime.now());
        Societe existingSociete = societeRepository.findByNom(c.getSociete().getNom());
        c.setSociete(existingSociete);
        c.setSecteur(existingSociete.getSecteur());
        if(c.getProspection()!=null){
            System.err.println("Prospection reçue : " + c.getProspection());

            Prospection prospection = c.getProspection();
            prospection.setDatePremiereAction(LocalDateTime.now());
            prospection.setDateDerniereAction(LocalDateTime.now());
            prospection.setNbrMails(0);
            prospection.setNbrAppels(0);
            prospection.setNbrJoursDepuisDerniereAction(0);
            if(prospection.isAjoutLinkedIn()){
                prospection.setDateajoutLinkedIn(LocalDateTime.now());
            }
            if(prospection.isLinkedqInAccepte()){
                prospection.setDateAcceptationLinkedIn(LocalDateTime.now());
            }
            if(prospection.isMailLinkedInEnvoye()){
                prospection.setDateEnvoiMailLinkedIn(LocalDateTime.now());
            }
            prospection.setNbrAppels(prospection.getNbrAppels());
            prospection.setNbrMails(prospection.getNbrMails());
            c.setProspection(prospection);
        } else {
            System.err.println("Prospection est null");
        }
        if (c.getReferentiel() != null) {
            Referentiel referentiel = c.getReferentiel();
            if (referentiel.getProfilReferentiels() != null) {
                List<ProfilReferentiel> profilReferentiels = referentiel.getProfilReferentiels();
                for (ProfilReferentiel profilReferentiel : profilReferentiels) {
                    // Affecter le referentiel à chaque profilReferentiel
                    profilReferentiel.setReferentiel(referentiel);
                }
            }
        }

            if (c.getBesoins() != null) {
                List<Besoins> besoins = c.getBesoins();
                for (Besoins besoin : besoins) {
                    besoinsServices.createBesoinToClient(besoin,c);
                    // Affecter le referentiel à chaque profilReferentiel
                    besoin.setClient(c);
                }
            }


        return clientRepository.save(c);
    }

    @Override
    public ClientDTO getClientById(Integer id) {
        Client client = clientRepository.findByIdWithSociete(id)
                .orElseThrow(() -> new IllegalArgumentException("Client not found"));

        // MapStruct pour Client
        ClientDTO clientDTO = entitiesMapper.toClientDTO(client);

        // Si Societe existe, mapper et inclure dans le DTO
        if (client.getSociete() != null) {
            SocieteSimpleDTO societeDTO = SocieteSimpleDTO.builder()
                    .nom(client.getSociete().getNom())
                    .build();
            clientDTO.setSociete(societeDTO);
        }
// Mapper les actions associées
        if (client.getActions() != null && !client.getActions().isEmpty()) {
            List<ActionsSimpleDTO> actionsDTOList = client.getActions().stream()
                    .map(action -> ActionsSimpleDTO.builder()
                            .id(action.getId())
                            .type(action.getType())
                            .dateDeCreation(action.getDateDeCreation())
                            .dateMiseAJour(action.getDateMiseAJour())
                            .commentaires(action.getCommentaires())
                            .prochainRdvPlanifie(action.isProchainRdvPlanifie())
                            .dateProchainRdvPlanifie(action.getDateProchainRdvPlanifie())
                            .manager(action.getManager())
                            .etatPersonneConcerne(action.getEtatPersonneConcerne())
                            .build())
                    .toList();
            clientDTO.setActions(actionsDTOList);
        }
        return clientDTO;
    }


    @Override
    @Transactional
    public Client updateClient(Integer clientId, Client updatedClientData) {
        // Retrieve the existing client
        Client existingClient = clientRepository.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Client with id " + clientId + " not found"));

        // Update manager and last update date
        utilisateur currentlyAuthUser = authenticationService.currentlyAuthenticatedUser();
        String manager = currentlyAuthUser.getNom() + " " + currentlyAuthUser.getPrenom();
        existingClient.setManager(manager);
        existingClient.setDateDerniereMiseAJour(LocalDateTime.now());

        // Update basic client fields
        updateBasicClientFields(existingClient, updatedClientData);

        // Update Organigramme
        updateOrganigramme(existingClient, updatedClientData);

        // Update Referentiel and ProfilReferentiels
        updateReferentiel(existingClient, updatedClientData);

        // Update LinkedIn
        updateLinkedIn(existingClient, updatedClientData);

        // Update Prospection
        updateProspection(existingClient, updatedClientData);

        // Handle the Societe relationship
        updateSociete(existingClient, updatedClientData);

        // Save and return the updated client
        return clientRepository.save(existingClient);
    }

    private void updateBasicClientFields(Client existingClient, Client updatedClientData) {
        existingClient.setAmbassadeur(updatedClientData.isAmbassadeur());
        existingClient.setPoste(updatedClientData.getPoste());
        existingClient.setSecteur(updatedClientData.getSecteur());
        existingClient.setLocalisation(updatedClientData.getLocalisation());
        existingClient.setGenre(updatedClientData.getGenre());
        existingClient.setNom(updatedClientData.getNom());
        existingClient.setPrenom(updatedClientData.getPrenom());
        existingClient.setEmail(updatedClientData.getEmail());
        existingClient.setEmailSecondaire(updatedClientData.getEmailSecondaire());
        existingClient.setTelephonePrso(updatedClientData.getTelephonePrso());
        existingClient.setTelephonePro(updatedClientData.getTelephonePro());
        existingClient.setStatut(updatedClientData.getStatut());
        existingClient.setCommentaireProfilsRecherches(updatedClientData.getCommentaireProfilsRecherches());
        existingClient.setPersonnalite(updatedClientData.getPersonnalite());
        existingClient.setModeDeFonctionnement(updatedClientData.getModeDeFonctionnement());
        existingClient.setPreferenceDeCommunication(updatedClientData.getPreferenceDeCommunication());
    }

    private void updateOrganigramme(Client existingClient, Client updatedClientData) {
        if (updatedClientData.getOrganigramme() != null) {
            if (existingClient.getOrganigramme() == null) {
                existingClient.setOrganigramme(updatedClientData.getOrganigramme());
            } else {
                // Update existing organigramme fields
                Organigramme existingOrganigramme = existingClient.getOrganigramme();
                Organigramme updatedOrganigramme = updatedClientData.getOrganigramme();

                // Copy all fields from updatedOrganigramme to existingOrganigramme
                // You'll need to implement this based on your Organigramme entity
                BeanUtils.copyProperties(updatedOrganigramme, existingOrganigramme, "id");
            }
        }
    }

    private void updateReferentiel(Client existingClient, Client updatedClientData) {
        if (updatedClientData.getReferentiel() != null) {
            if (existingClient.getReferentiel() == null) {
                existingClient.setReferentiel(updatedClientData.getReferentiel());
            } else {
                Referentiel existingReferentiel = existingClient.getReferentiel();
                Referentiel updatedReferentiel = updatedClientData.getReferentiel();

                // Update segments, sous-segments, technologies
                existingReferentiel.setSegments(updatedReferentiel.getSegments());
                existingReferentiel.setSousSegments(updatedReferentiel.getSousSegments());
                existingReferentiel.setTechnologie(updatedReferentiel.getTechnologie());

                // Handle ProfilReferentiels
                updateProfilReferentiels(existingReferentiel, updatedReferentiel);
            }
        }
    }

    private void updateProfilReferentiels(Referentiel existingReferentiel, Referentiel updatedReferentiel) {
        if (updatedReferentiel.getProfilReferentiels() != null) {
            // Clear existing profil referentiels
            existingReferentiel.getProfilReferentiels().clear();

            // Add updated profil referentiels
            for (ProfilReferentiel updatedProfil : updatedReferentiel.getProfilReferentiels()) {
                ProfilReferentiel newProfil = new ProfilReferentiel();
                newProfil.setProfil(updatedProfil.getProfil());
                newProfil.setNiveau(updatedProfil.getNiveau());
                newProfil.setReferentiel(existingReferentiel);
                existingReferentiel.getProfilReferentiels().add(newProfil);
            }
        }
    }

    private void updateLinkedIn(Client existingClient, Client updatedClientData) {
        if (updatedClientData.getLinkedIn() != null) {
            if (existingClient.getLinkedIn() == null) {
                existingClient.setLinkedIn(updatedClientData.getLinkedIn());
            } else {
                // Update existing LinkedIn fields
                LinkedIn existingLinkedIn = existingClient.getLinkedIn();
                LinkedIn updatedLinkedIn = updatedClientData.getLinkedIn();

                // Copy all fields from updatedLinkedIn to existingLinkedIn
                // You'll need to implement this based on your LinkedIn entity
                BeanUtils.copyProperties(updatedLinkedIn, existingLinkedIn, "id");
            }
        }
    }

    private void updateProspection(Client existingClient, Client updatedClientData) {
        if (updatedClientData.getProspection() != null) {
            Prospection existingProspection = existingClient.getProspection();
            Prospection updatedProspection = updatedClientData.getProspection();

            if (existingProspection == null) {
                existingProspection = new Prospection();
                existingClient.setProspection(existingProspection);
            }

            // Update Prospection fields
            existingProspection.setNbrAppels(updatedProspection.getNbrAppels());
            existingProspection.setNbrMails(updatedProspection.getNbrMails());
            existingProspection.setDateDerniereAction(LocalDateTime.now());

            // Update flags and dates
            if (updatedProspection.isAjoutLinkedIn()) {
                existingProspection.setDateajoutLinkedIn(LocalDateTime.now());
            }
            if (updatedProspection.isLinkedqInAccepte()) {
                existingProspection.setDateAcceptationLinkedIn(LocalDateTime.now());
            }
            if (updatedProspection.isMailLinkedInEnvoye()) {
                existingProspection.setDateEnvoiMailLinkedIn(LocalDateTime.now());
            }
        }
    }

    private void updateSociete(Client existingClient, Client updatedClientData) {
        if (updatedClientData.getSociete() != null && updatedClientData.getSociete().getNom() != null) {
            Optional<Societe> societe = Optional.ofNullable(societeRepository.findByNom(updatedClientData.getSociete().getNom()));
            if (societe.isPresent()) {
                existingClient.setSociete(societe.get());
            } else {
                throw new IllegalArgumentException("Societe with name " + updatedClientData.getSociete().getNom() + " not found");
            }
        }
    }





















    @Override
    public void deleteClient(Integer clientId) {
        Client c = clientRepository.findById(clientId).get();
        c.setSociete(null);
        clientRepository.delete(c);
    }

    @Override
    public Page<Client> getAllClients(int page, int size) {
        Pageable pageable = PageRequest.of(page, size); // Page index starts from 0
        return clientRepository.findAll(pageable);
    }






    // Méthode pour extraire l'ID public à partir de l'URL
    private String extractPublicIdFromUrl(String fileUrl) {
        // Assumes Cloudinary URLs follow a consistent format
        String[] parts = fileUrl.split("/");
        String publicIdWithExtension = parts[parts.length - 1];
        return publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
    }

    @Transactional
    public Besoins updateBesoinAndProfil(Integer clientId, Besoins updatedBesoin) throws Exception {
        // Trouver la société et le besoin à mettre à jour
        Client existingClient = clientRepository.findById(clientId)
                .orElseThrow(() -> new Exception("Société non trouvée avec l'ID : " + clientId));
        existingClient.setDateDerniereMiseAJour(LocalDateTime.now());

        Besoins existingBesoin = existingClient.getBesoins().stream()
                .filter(b -> b.getReference().equals(updatedBesoin.getReference()))
                .findFirst()
                .orElseThrow(() -> new Exception("Besoin non trouvé avec la référence : " + updatedBesoin.getReference()));

        // Supprimer l'ancien PDF et QR code associés
        if (existingBesoin.getQrCodeImage() != null) {
            Media oldMedia = existingBesoin.getQrCodeImage();
            String oldPdfPublicId = extractPublicIdFromUrl(oldMedia.getImagenUrl());
            cloudinary.uploader().destroy(oldPdfPublicId, Map.of());
            mediaRep.delete(oldMedia);
        }

        // Mise à jour des informations de base du besoin
        existingBesoin.setTitre(updatedBesoin.getTitre());
        existingBesoin.setDateDerniereMiseAJour(LocalDateTime.now());
        existingBesoin.setAoSow(updatedBesoin.getAoSow());
        existingBesoin.setEtat(updatedBesoin.getEtat());
        existingBesoin.setPlateforme(updatedBesoin.getPlateforme());
        existingBesoin.setBesoinEnAvanceDePhase(updatedBesoin.isBesoinEnAvanceDePhase());
        existingBesoin.setReccurent(updatedBesoin.isReccurent());
        existingBesoin.setDemarrageASAP(updatedBesoin.isDemarrageASAP());
        existingBesoin.setDateDeDemarrage(updatedBesoin.getDateDeDemarrage());
        existingBesoin.setHabilitable(updatedBesoin.isHabilitable());

        // Récupérer les référentiels existants et mis à jour
        Referentiel updatedReferentiel = updatedBesoin.getReferentiel();
        Referentiel existingReferentiel = existingBesoin.getReferentiel();
        System.err.println(existingReferentiel);

// Vérifier si un référentiel mis à jour est fourni
        if (updatedReferentiel != null) {
            if (existingReferentiel != null) {
                // Mettre à jour les champs simples
                existingReferentiel.setSegments(updatedReferentiel.getSegments());
                existingReferentiel.setSousSegments(updatedReferentiel.getSousSegments());
                existingReferentiel.setTechnologie(updatedReferentiel.getTechnologie());

                // Mettre à jour la liste des ProfilReferentiel
                List<ProfilReferentiel> updatedProfils = updatedReferentiel.getProfilReferentiels();
                List<ProfilReferentiel> existingProfils = existingReferentiel.getProfilReferentiels();

                if (updatedProfils != null) {
                    // Supprimer les profils existants non inclus dans la mise à jour
                    if (existingProfils != null) {
                        existingProfils.removeIf(existing ->
                                updatedProfils.stream().noneMatch(updated -> updated.getProfil().equals(existing.getProfil())));
                    } else {
                        existingProfils = new ArrayList<>();
                    }

                    // Ajouter ou mettre à jour les profils
                    for (ProfilReferentiel updatedProfil : updatedProfils) {
                        ProfilReferentiel existingProfil = existingProfils.stream()
                                .filter(p -> p.getProfil().equals(updatedProfil.getProfil()))
                                .findFirst()
                                .orElse(null);

                        if (existingProfil != null) {
                            // Mettre à jour les champs
                            existingProfil.setNiveau(updatedProfil.getNiveau());
                        } else {
                            // Ajouter un nouveau profil
                            ProfilReferentiel newProfil = ProfilReferentiel.builder()
                                    .profil(updatedProfil.getProfil())
                                    .niveau(updatedProfil.getNiveau())
                                    .referentiel(existingReferentiel)
                                    .build();
                            existingProfils.add(newProfil);
                        }
                    }

                    // Affecter la liste mise à jour au référentiel existant
                    existingReferentiel.setProfilReferentiels(existingProfils);
                }

                // Sauvegarder le référentiel mis à jour
                referentielRepository.save(existingReferentiel);
            } else {
                // Si aucun référentiel n'existe encore, en créer un nouveau
                Referentiel newReferentiel = Referentiel.builder()
                        .segments(updatedReferentiel.getSegments())
                        .sousSegments(updatedReferentiel.getSousSegments())
                        .technologie(updatedReferentiel.getTechnologie())
                        .besoin(existingBesoin) // Lier au besoin existant
                        .build();

                // Ajouter les profils au nouveau référentiel
                List<ProfilReferentiel> newProfilReferentiels = new ArrayList<>();
                if (updatedReferentiel.getProfilReferentiels() != null) {
                    for (ProfilReferentiel updatedProfil : updatedReferentiel.getProfilReferentiels()) {
                        ProfilReferentiel newProfil = ProfilReferentiel.builder()
                                .profil(updatedProfil.getProfil())
                                .niveau(updatedProfil.getNiveau())
                                .referentiel(newReferentiel)
                                .build();
                        newProfilReferentiels.add(newProfil);
                    }
                }

                newReferentiel.setProfilReferentiels(newProfilReferentiels);

                // Lier le nouveau référentiel au besoin existant
                existingBesoin.setReferentiel(newReferentiel);

                // Sauvegarder le nouveau référentiel
                referentielRepository.save(newReferentiel);
            }
        }




// Optionnel : Sauvegarder le besoin existant si nécessaire
        besoinsRepository.save(existingBesoin);


        // Gestion des besoinsTechnologies
        if (updatedBesoin.getBesoinsTechnologies() != null) {
            // Supprimer les anciens besoinsTechnologies
            besoinsTechnologiesReppository.deleteAll(existingBesoin.getBesoinsTechnologies());

            // Ajouter les nouveaux besoinsTechnologies
            for (BesoinsTechnologies newTechnologie : updatedBesoin.getBesoinsTechnologies()) {
                newTechnologie.setBesoin(existingBesoin);
            }
            existingBesoin.setBesoinsTechnologies(updatedBesoin.getBesoinsTechnologies());
        }


        // Mise à jour du ProfilBesoins
        ProfilBesoins updatedProfil = updatedBesoin.getProfilBesoins();
        ProfilBesoins existingProfil = existingBesoin.getProfilBesoins();
        if (existingProfil != null && updatedProfil != null) {
            existingProfil.setDifficultes(updatedProfil.getDifficultes());
            existingProfil.setSeniorite(updatedProfil.getSeniorite());
            existingProfil.setAnneesExperienceTotales(updatedProfil.getAnneesExperienceTotales());
            existingProfil.setTjmMinEstime(updatedProfil.getTjmMinEstime());
            existingProfil.setTjmMaxEstime(updatedProfil.getTjmMaxEstime());
            existingProfil.setTjmMax(updatedProfil.getTjmMax());
            existingProfil.setTjmMin(updatedProfil.getTjmMin());
            existingProfil.setTjmSouhaite(updatedProfil.getTjmSouhaite());
            existingProfil.setAvantages(updatedProfil.getAvantages());
            existingProfil.setCommentaire(updatedProfil.getCommentaire());
        } else if (updatedProfil != null) {
            updatedProfil.setBesoins(existingBesoin);
            existingBesoin.setProfilBesoins(updatedProfil);
        }

        // Générer un nouveau PDF avec les informations mises à jour
        byte[] pdfData;
        try {
            pdfData = besoinsServices.createPDF(existingBesoin);
        } catch (IOException e) {
            e.printStackTrace();
            throw new Exception("Erreur lors de la génération du PDF pour le besoin mis à jour.");
        }
        // Télécharger le nouveau PDF sur Cloudinary
        String pdfUrl = besoinsServices.uploadPDFToCloudinary(pdfData, existingBesoin.getReference());
        // Créer un objet Media pour stocker l'image QR code
        Media qrCodeImage = new Media();
        qrCodeImage.setName("QR Code pour " + existingBesoin.getTitre());
        // Créer un nouveau QR code pour le PDF mis à jour
        byte[] qrCodeImageData = besoinsServices.generateQRCode(pdfUrl);
        String qrCodeUrl;
        try {
            qrCodeUrl = cloudinary.uploader()
                    .upload(qrCodeImageData, Map.of("public_id", UUID.randomUUID().toString()))
                    .get("url")
                    .toString();
            qrCodeImage.setImagenUrl(qrCodeUrl);
            qrCodeImage.setName(existingBesoin.getReference() + ".png");
            existingBesoin.setQrCodeImage(mediaRep.save(qrCodeImage));
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception("Erreur lors de la génération du QR code pour le besoin mis à jour.");
        }
        // Créer une nouvelle entrée Media pour le PDF et le QR code
        mediaRep.save(qrCodeImage);
        existingBesoin.setQrCodeImage(qrCodeImage);

        // Sauvegarder et retourner le besoin mis à jour
        return besoinsRepository.save(existingBesoin);
    }









    @Transactional
    public Besoins createBesoinAndAssignToClient(Besoins besoin, Integer clientId) throws Exception {
        // Génération de la référence pour le besoin
        Client s = clientRepository.findById(clientId).get();
        Societe c = s.getSociete();
        String ref = besoinsServices.generateRef(c.getNom());
        besoin.setReference(ref);
        s.setSecteur(c.getSecteur());
        // Lier le profil besoin au besoin
        ProfilBesoins profilsBesoins = besoin.getProfilBesoins();

        if (profilsBesoins != null) {
            profilsBesoins.setBesoins(besoin); // Associe le besoin à chaque profil besoin

            // Sauvegarde des modifications dans la base de données
            besoinsRepository.save(besoin);
        } else {
            throw new Exception("La liste des profils de besoins ne peut pas être vide");
        }
        // Vérifie si le besoin existe
//        if (besoin != null) {
//            // Création d'un nouveau référentiel
//            Referentiel referentiel = new Referentiel();
//
//            // Vérifie si le besoin possède un référentiel existant
//            Referentiel existingReferentiel = besoin.getReferentiel();
//            if (existingReferentiel != null) {
//                // Copie des segments
//                if (existingReferentiel.getSegments() != null) {
//                    referentiel.setSegments(new ArrayList<>(existingReferentiel.getSegments()));
//                }

        // Copie des sous-segments
//                if (existingReferentiel.getSousSegments() != null) {
//                    referentiel.setSousSegments(new ArrayList<>(existingReferentiel.getSousSegments()));
//                }
//
//                // Copie des technologies
//                if (existingReferentiel.getTechnologie() != null) {
//                    referentiel.setTechnologie(new ArrayList<>(existingReferentiel.getTechnologie()));
//                }
//
//                // Gestion des profils associés au référentiel
//                List<ProfilReferentiel> profilsToAdd = existingReferentiel.getProfilReferentiels();
//                System.err.println("Profils à ajouter : " + profilsToAdd);
//
//                if (profilsToAdd != null && !profilsToAdd.isEmpty()) {
//                    List<ProfilReferentiel> newProfils = new ArrayList<>();
//                    for (ProfilReferentiel profil : profilsToAdd) {
//                        ProfilReferentiel newProfil = ProfilReferentiel.builder()
//                                .profil(profil.getProfil())
//                                .niveau(profil.getNiveau())
//                                .referentiel(referentiel)  // Associe chaque profil au référentiel
//                                .build();
//                        newProfils.add(newProfil);
//                    }
//                    referentiel.setProfilReferentiels(newProfils);  // Ajoute les profils au référentiel
//
//                    // Enregistrement des profils dans la base de données
//                    profilReferentielRepository.saveAll(newProfils);
//                }
//            }
//
//            // Associe le besoin au référentiel
//            referentiel.setBesoin(besoin);
//            besoin.setReferentiel(referentiel);  // Lier mutuellement
//
//            // Sauvegarde du référentiel et cascade pour ses profils
//            referentielRepository.save(referentiel);
//        } else {
//            System.err.println("Erreur : Besoin est null !");
//        }
        // Vérifiez si le besoin possède un référentiel
        if (besoin.getReferentiel() != null && !besoin.getReferentiel().getProfilReferentiels().isEmpty()) {
            Referentiel referentiel = besoin.getReferentiel();  // Récupère le référentiel

            // Associer chaque ProfilReferentiel au besoin
            for (ProfilReferentiel profilReferentiel : referentiel.getProfilReferentiels()) {
                profilReferentiel.setReferentiel(referentiel);  // Associe le profil au référentiel
            }
            referentiel.setBesoin(besoin);

        }

// Sauvegarde du besoin avec son référentiel
        besoinsRepository.save(besoin);
        s.setDateDerniereMiseAJour(LocalDateTime.now());
        // Vérifier si la liste de BesoinsTechnologies n'est pas vide
        if (besoin.getBesoinsTechnologies() != null && !besoin.getBesoinsTechnologies().isEmpty()) {
            // Associer chaque BesoinsTechnologies au Besoin
            for (BesoinsTechnologies besoinsTechnologie : besoin.getBesoinsTechnologies()) {
                besoinsTechnologie.setBesoin(besoin);
            }
        }
//        // Ajout des dates de création et de mise à jour
        besoin.setDateDeCreation(LocalDateTime.now());
        besoin.setDateDerniereMiseAJour(LocalDateTime.now());

        // Recherche de la société existante par ID
        Client existingClient = clientRepository.findById(clientId)
                .orElseThrow(() -> new Exception("Société non trouvée avec l'ID : " + clientId));

        // Associer le besoin à la société trouvée
        besoin.setSociete(existingClient.getSociete());
        besoin.setClient(existingClient);

        // Création d'une chaîne JSON avec toutes les informations du besoin
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        String barcodeText = "";
        try {
            barcodeText = objectMapper.writeValueAsString(besoin);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null; // Gérer l'erreur selon vos besoins
        }

        // Génération du PDF avec les informations du besoin
        byte[] pdfData;
        try {
            pdfData = besoinsServices.createPDF(besoin); // Crée le PDF avec les informations du besoin
        } catch (IOException e) {
            e.printStackTrace();
            return null; // Gérer l'erreur selon vos besoins
        }

        // Téléchargez le PDF sur Cloudinary
        String pdfUrl = besoinsServices.uploadPDFToCloudinary(pdfData, besoin.getReference());

        // Créer un objet Media pour stocker l'image QR code
        Media qrCodeImage = new Media();
        qrCodeImage.setName("QR Code pour " + besoin.getTitre());

        // Créer le QR code avec l'URL du PDF
        byte[] qrCodeImageData = besoinsServices.generateQRCode(pdfUrl);
        try {
            String qrCodeUrl = cloudinary.uploader()
                    .upload(qrCodeImageData,
                            Map.of("public_id", UUID.randomUUID().toString()))
                    .get("url")
                    .toString();
            qrCodeImage.setImagenUrl(qrCodeUrl);
            qrCodeImage.setName(besoin.getReference() + ".png");
            besoin.setQrCodeImage(mediaRep.save(qrCodeImage));
        } catch (Exception e) {
            e.printStackTrace(); // Gérer les exceptions selon vos besoins
        }








        // Sauvegarder le besoin dans la base de données
        besoin = besoinsRepository.save(besoin); // Sauvegarder et mettre à jour l'objet besoin
        return besoin;
    }

}
