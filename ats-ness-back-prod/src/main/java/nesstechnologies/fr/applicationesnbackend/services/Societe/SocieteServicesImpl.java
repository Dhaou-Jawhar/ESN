package nesstechnologies.fr.applicationesnbackend.services.Societe;

import com.cloudinary.Cloudinary;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.transaction.Transactional;
import nesstechnologies.fr.applicationesnbackend.dto.*;
import nesstechnologies.fr.applicationesnbackend.entities.*;
import nesstechnologies.fr.applicationesnbackend.exceptions.CustomException;
import nesstechnologies.fr.applicationesnbackend.mapper.EntitiesMapper;
import nesstechnologies.fr.applicationesnbackend.repositories.*;
import nesstechnologies.fr.applicationesnbackend.services.Besoins.BesoinsServices;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SocieteServicesImpl implements SocieteServices {
    private final Cloudinary cloudinary;
    private final BesoinsServices besoinsServices;
    private final SocieteRepository societeRepository;
    private final mediaRepo mediaRep;
    private final BesoinsRepository besoinsRepository;
    private final ProfilBesoinsRepository profilBesoinsRepository;
    private final ReferentielRepository referentielRepository;
    private final BesoinsTechnologiesReppository besoinsTechnologiesReppository;
    private final ProfilBesoinsRepository profilReferentielRepository;
    private final EntitiesMapper entitiesMapper;

    public SocieteServicesImpl(Cloudinary cloudinary, BesoinsServices besoinsServices, SocieteRepository societeRepository, mediaRepo mediaRep, BesoinsRepository besoinsRepository, ProfilBesoinsRepository profilBesoinsRepository, ReferentielRepository referentielRepository, BesoinsTechnologiesReppository besoinsTechnologiesReppository, ProfilBesoinsRepository profilReferentielRepository, EntitiesMapper entitiesMapper) {
        this.cloudinary = cloudinary;
        this.besoinsServices = besoinsServices;
        this.societeRepository = societeRepository;
        this.mediaRep = mediaRep;
        this.besoinsRepository = besoinsRepository;
        this.profilBesoinsRepository = profilBesoinsRepository;
        this.referentielRepository = referentielRepository;
        this.besoinsTechnologiesReppository = besoinsTechnologiesReppository;
        this.profilReferentielRepository = profilReferentielRepository;
        this.entitiesMapper = entitiesMapper;
    }

    @Override
    @Transactional
    public Societe createSociete(Societe s, List<MultipartFile> organigrammes,MultipartFile logo) throws Exception {
        if (societeRepository.findByNom(s.getNom()) != null) {
            throw new CustomException("Cette société existe déjà !");
        }

        if (logo != null && !logo.isEmpty()) {
            String logoUrl = uploadFileToCloudinary(logo);
            s.setLogo(logoUrl);
        }
        // Liste pour stocker les URLs des organigrammes uploadés
        List<String> organigrammesUrls = new ArrayList<>();
        // Ajout des organigrammes
        if (organigrammes != null && !organigrammes.isEmpty()) {
            for (MultipartFile organigramme : organigrammes) {
                if (organigramme != null && !organigramme.isEmpty()) {
                    String organigrammeUrl = uploadFileToCloudinary(organigramme);
                    organigrammesUrls.add(organigrammeUrl);
                }
            }
            s.setOrganigramme(organigrammesUrls);
            s.setDateDeCreation(LocalDateTime.now());
            s.setDateDeDerniereMiseAJour(LocalDateTime.now());
        }

        societeRepository.save(s);
        return s;
    }

    // Méthode pour uploader les fichiers sur Cloudinary
    private String uploadFileToCloudinary(MultipartFile file) throws IOException {
        return cloudinary.uploader()
                .upload(file.getBytes(), Map.of("public_id", UUID.randomUUID().toString()))
                .get("url").toString();
    }
    @Override
    public SocieteDTO getSocieteById(int id) {
        // Récupérer la société ou lever une exception si elle n'existe pas
        Societe societe = societeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Societe not found"));

        // Mapper la société en SocieteDTO
        SocieteDTO societeDTO = entitiesMapper.toSocieteDTO(societe);

        // Obtenir les clients de la société
        List<Client> clients = societe.getClients();

        // Créer une liste pour stocker les ClientSimpleDTO avec leurs besoins
        List<ClientSimpleDTO> clientSimpleDTOs = new ArrayList<>();

        // Parcourir chaque client pour mapper ses besoins
        for (Client client : clients) {
            // Mapper le client en ClientSimpleDTO
            ClientSimpleDTO clientSimpleDTO = entitiesMapper.toClientSimpleDTO(client);

            // Mapper les besoins du client en BesoinsDTO
            List<BesoinsDTO> besoinsDTOs = entitiesMapper.toBesoinsDTOList(client.getBesoins());

            // Associer les besoins au client DTO
            clientSimpleDTO.setBesoins(besoinsDTOs);

            // Ajouter le client DTO à la liste
            clientSimpleDTOs.add(clientSimpleDTO);
        }

        // Ajouter la liste des clients simplifiés au SocieteDTO
        societeDTO.setClients(clientSimpleDTOs);

        return societeDTO;
    }






    @Transactional
    public Societe updateSociete(Integer id, Societe updatedSociete, List<MultipartFile> newOrganigrammes, MultipartFile newLogo) throws Exception {
        Societe existingSociete = societeRepository.findById(id)
                .orElseThrow(() -> new Exception("Société non trouvée avec l'ID : " + id));

        // Mise à jour des informations de base
        existingSociete.setNom(updatedSociete.getNom());
        existingSociete.setSocieteMere(updatedSociete.getSocieteMere());
        existingSociete.setAdresse(updatedSociete.getAdresse());
        existingSociete.setCapitalSocial(updatedSociete.getCapitalSocial());
        existingSociete.setRcs(updatedSociete.getRcs());
        existingSociete.setVilleRcs(updatedSociete.getVilleRcs());
        existingSociete.setSiret(updatedSociete.getSiret());
        existingSociete.setDateDeDerniereMiseAJour(LocalDateTime.now());

        // Mise à jour du logo
        if (newLogo != null && !newLogo.isEmpty()) {
            String existingLogoUrl = existingSociete.getLogo();
            if (existingLogoUrl != null && !existingLogoUrl.isEmpty()) {
                deleteFileFromCloudinary(existingLogoUrl);
            }
            String newLogoUrl = uploadFileToCloudinary(newLogo);
            existingSociete.setLogo(newLogoUrl);
        }

        // Mise à jour des organigrammes
        updateOrganigram(existingSociete, newOrganigrammes);

        // Mise à jour des clients et besoins si nécessaire
        if (updatedSociete.getClients() != null && !updatedSociete.getClients().isEmpty()) {
            for (Client client : updatedSociete.getClients()) {
                client.setSociete(existingSociete); // Référence inverse manuelle
            }
            existingSociete.setClients(updatedSociete.getClients());
        }


        if (updatedSociete.getBesoins() != null && !updatedSociete.getBesoins().isEmpty()) {
            existingSociete.setBesoins(updatedSociete.getBesoins());
        }

        return societeRepository.save(existingSociete);
    }





    private void updateOrganigram(Societe existingSociete, List<MultipartFile> newOrganigrammes) throws IOException {
        // Retain existing organigrammes
        List<String> existingOrganigrammes = existingSociete.getOrganigramme() != null
                ? new ArrayList<>(existingSociete.getOrganigramme())
                : new ArrayList<>();

        // Upload new organigrammes and add their URLs
        if (newOrganigrammes != null && !newOrganigrammes.isEmpty()) {
            List<String> newOrganigrammesUrls = newOrganigrammes.stream()
                    .map(file -> {
                        try {
                            return uploadFileToCloudinary(file); // Upload and get URL
                        } catch (IOException e) {
                            throw new RuntimeException("Failed to upload file", e);
                        }
                    })
                    .collect(Collectors.toList());
            existingOrganigrammes.addAll(newOrganigrammesUrls); // Append new organigrammes
        }
        existingSociete.setDateDeDerniereMiseAJour(LocalDateTime.now());
        // Update the entity with the updated list of organigrammes
        existingSociete.setOrganigramme(existingOrganigrammes);

        // Save updated Societe entity
        societeRepository.save(existingSociete);
    }


    // Méthode pour supprimer les fichiers sur Cloudinary
    private void deleteFileFromCloudinary(String fileUrl) {
        try {
            // Extract public ID from the file URL
            String publicId = extractPublicIdFromUrl(fileUrl);
            cloudinary.uploader().destroy(publicId, Map.of());
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file from Cloudinary", e);
        }
    }

    // Méthode pour extraire l'ID public à partir de l'URL
    private String extractPublicIdFromUrl(String fileUrl) {
        // Assumes Cloudinary URLs follow a consistent format
        String[] parts = fileUrl.split("/");
        String publicIdWithExtension = parts[parts.length - 1];
        return publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
    }

    public List<Societe> getAll(){
        return societeRepository.findAll();
    }

    @Transactional
    public void deleteOrganigramFromSociete(Integer societeId, String organigrammeUrl) throws Exception {
        // Rechercher la société existante
        Societe existingSociete = societeRepository.findById(societeId)
                .orElseThrow(() -> new Exception("Société non trouvée avec l'ID : " + societeId));

        // Vérifier si l'organigramme existe dans la liste
        List<String> organigrammes = existingSociete.getOrganigramme();
        if (organigrammes != null && organigrammes.contains(organigrammeUrl)) {
            // Supprimer l'organigramme de Cloudinary
            deleteFileFromCloudinary(organigrammeUrl);

            // Supprimer l'URL de l'organigramme de la liste
            organigrammes.remove(organigrammeUrl);

            // Mettre à jour la liste dans l'entité
            existingSociete.setOrganigramme(organigrammes);
            existingSociete.setDateDeDerniereMiseAJour(LocalDateTime.now());


            // Sauvegarder les modifications
            societeRepository.save(existingSociete);
        } else {
            throw new Exception("Organigramme non trouvé dans la société.");
        }
    }

    @Transactional
    public Besoins createBesoinAndAssignToSociete(Besoins besoin, Integer societeId) throws Exception {
        // Génération de la référence pour le besoin
        Societe s = societeRepository.findById(societeId).get();
        String ref = besoinsServices.generateRef(s.getNom());
        besoin.setReference(ref);
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
        s.setDateDeDerniereMiseAJour(LocalDateTime.now());
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
        Societe existingSociete = societeRepository.findById(societeId)
                .orElseThrow(() -> new Exception("Société non trouvée avec l'ID : " + societeId));

        // Associer le besoin à la société trouvée
        besoin.setSociete(existingSociete);

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


    @Transactional
    public void deleteBesoinFromSociete(Integer besoinId) throws Exception {
        try {
            // 1. Récupérer le besoin à supprimer
            Besoins besoin = besoinsRepository.findById(besoinId)
                    .orElseThrow(() -> new Exception("Besoin non trouvé avec l'ID : " + besoinId));

            // 2. Dissocier le besoin de la société
            Societe societe = besoin.getSociete();
            if (societe != null) {
                societe.getBesoins().remove(besoin);  // Retirer le besoin de la société
                societe.setDateDeDerniereMiseAJour(LocalDateTime.now());
                societeRepository.save(societe);  // Sauvegarder la société après dissociation
            }

            // 3. Supprimer les profils associés dans profil_besoins
            if(besoin.getProfilBesoins() != null) {
                ProfilBesoins profilBesoins = besoin.getProfilBesoins();
                profilBesoins.setBesoins(null);  // Dissocier le profil du besoin
                profilBesoinsRepository.delete(profilBesoins);  // Supprimer le profil
            }

            if(besoin.getClient() != null){
                Client client = besoin.getClient();
                client.setBesoins(null);
            }

            // 4. Supprimer le fichier PDF et le QR Code sur Cloudinary
            if (besoin.getQrCodeImage() != null && besoin.getQrCodeImage().getImagenUrl() != null) {
                Media qrCodeImage = besoin.getQrCodeImage();
                String qrCodeImageUrl = qrCodeImage.getImagenUrl();
                besoin.setQrCodeImage(null);
                mediaRep.delete(qrCodeImage);
                deleteFileFromCloudinary(qrCodeImageUrl);  // Supprimer le QR code de Cloudinary
                System.err.println(qrCodeImage.getImagenUrl());
            }

            // 5. Supprimer le besoin
            besoinsRepository.delete(besoin);

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la suppression du besoin de la société", e);
        }
    }


    @Transactional
    public Besoins updateBesoinAndProfil(Integer societeId, Besoins updatedBesoin) throws Exception {
        // Trouver la société et le besoin à mettre à jour
        Societe existingSociete = societeRepository.findById(societeId)
                .orElseThrow(() -> new Exception("Société non trouvée avec l'ID : " + societeId));
        existingSociete.setDateDeDerniereMiseAJour(LocalDateTime.now());

        Besoins existingBesoin = existingSociete.getBesoins().stream()
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

}
