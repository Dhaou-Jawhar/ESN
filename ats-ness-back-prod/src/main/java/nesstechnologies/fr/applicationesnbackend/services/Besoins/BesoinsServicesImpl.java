package nesstechnologies.fr.applicationesnbackend.services.Besoins;

import com.cloudinary.Cloudinary;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.events.Event;
import com.itextpdf.kernel.events.IEventHandler;
import com.itextpdf.kernel.events.PdfDocumentEvent;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.layout.Canvas;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.kernel.geom.PageSize;

import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.*;
import jakarta.transaction.Transactional;
import nesstechnologies.fr.applicationesnbackend.entities.*;
import nesstechnologies.fr.applicationesnbackend.repositories.*;
import nesstechnologies.fr.applicationesnbackend.services.Societe.SocieteServices;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.function.Consumer;
import java.util.stream.Collectors;

@Service
public class BesoinsServicesImpl implements BesoinsServices {
    private final Cloudinary cloudinary;
    private final mediaRepo mediaRep;
    private final BesoinsRepository besoinRepository;
    private final SocieteRepository societeRepository;
    private final ClientRepository clientRepository;
    private SocieteServices societeServices;
    private final ProfilRepository profilBesoinsRepository;
    private final RateRepository rateRepository;
    private final ReferentielRepository referentielRepository;
    private final BesoinsTechnologiesReppository besoinsTechnologiesReppository;
    public BesoinsServicesImpl(Cloudinary cloudinary, mediaRepo mediaRep, BesoinsRepository besoinRepository, SocieteRepository societeRepository, @Lazy SocieteServices societeServices, ProfilRepository profilBesoinsRepository, RateRepository rateRepository, ClientRepository clientRepository, ReferentielRepository referentielRepository, BesoinsTechnologiesReppository besoinsTechnologiesReppository) {
        this.cloudinary = cloudinary;
        this.mediaRep = mediaRep;
        this.besoinRepository = besoinRepository;
        this.societeRepository = societeRepository;
        this.societeServices = societeServices;
        this.profilBesoinsRepository = profilBesoinsRepository;
        this.rateRepository = rateRepository;
        this.clientRepository = clientRepository;
        this.referentielRepository = referentielRepository;
        this.besoinsTechnologiesReppository = besoinsTechnologiesReppository;
    }

    @Override
    @Transactional
    public Besoins createBesoin(Besoins besoin) throws Exception {


        // Ajout des dates de création et de mise à jour
        besoin.setDateDeCreation(LocalDateTime.now());
        besoin.setDateDerniereMiseAJour(LocalDateTime.now());
        String nomComplet = besoin.getClient().getNom() + " " + besoin.getClient().getPrenom();

        Client existingClient = clientRepository.findByNomComplet(nomComplet);
        System.err.println(existingClient);
        if (existingClient != null) {
            besoin.setClient(existingClient);
            if(existingClient.getSociete()!=null){
                besoin.setSociete(existingClient.getSociete());
            }
        }

        String ref = generateRef(besoin.getClient().getSociete().getNom());
        besoin.setReference(ref);
//       // Création d'une chaîne JSON avec toutes les informations du besoin
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
            pdfData = createPDF(besoin); // Crée le PDF avec les informations du besoin
        } catch (IOException e) {
            e.printStackTrace();
            return null; // Gérer l'erreur selon vos besoins
        }

        // Téléchargez le PDF sur Cloudinary
        String pdfUrl = uploadPDFToCloudinary(pdfData, besoin.getReference());

        // Créer un objet Media pour stocker l'image QR code
        Media qrCodeImage = new Media();
        qrCodeImage.setName("QR Code pour " + besoin.getTitre());

        // Créer le QR code avec l'URL du PDF
        byte[] qrCodeImageData = generateQRCode(pdfUrl);
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
        // Lier le profil besoin au besoin
// Récupération de la liste des profils besoins associée au besoin
        ProfilBesoins profilsBesoins = besoin.getProfilBesoins();

        if (profilsBesoins != null ) {
                profilsBesoins.setBesoins(besoin); // Associe le besoin à chaque profil besoin

            // Sauvegarde des modifications dans la base de données
            besoinRepository.save(besoin);
        } else {
            throw new Exception("La liste des profils de besoins ne peut pas être vide");
        }

        // Sauvegarder le besoin dans la base de données
        besoin = besoinRepository.save(besoin); // Sauvegarder et mettre à jour l'objet besoin
        return besoin;
    }









    @Transactional
    public Besoins createBesoinToClient(Besoins besoin,Client client) throws Exception {
        String ref = generateRef(client.getSociete().getNom());
        besoin.setReference(ref);

        // Ajout des dates de création et de mise à jour
        besoin.setDateDeCreation(LocalDateTime.now());
        besoin.setDateDerniereMiseAJour(LocalDateTime.now());

        if (client.getSociete() != null) {
            besoin.setSociete(client.getSociete());}

//       // Création d'une chaîne JSON avec toutes les informations du besoin
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
            pdfData = createPDF(besoin); // Crée le PDF avec les informations du besoin
        } catch (IOException e) {
            e.printStackTrace();
            return null; // Gérer l'erreur selon vos besoins
        }

        // Téléchargez le PDF sur Cloudinary
        String pdfUrl = uploadPDFToCloudinary(pdfData, besoin.getReference());

        // Créer un objet Media pour stocker l'image QR code
        Media qrCodeImage = new Media();
        qrCodeImage.setName("QR Code pour " + besoin.getTitre());

        // Créer le QR code avec l'URL du PDF
        byte[] qrCodeImageData = generateQRCode(pdfUrl);
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
        // Lier le profil besoin au besoin
// Récupération de la liste des profils besoins associée au besoin
        ProfilBesoins profilsBesoins = besoin.getProfilBesoins();

        if (profilsBesoins != null ) {
            profilsBesoins.setBesoins(besoin); // Associe le besoin à chaque profil besoin

            // Sauvegarde des modifications dans la base de données
            besoinRepository.save(besoin);
        } else {
            throw new Exception("La liste des profils de besoins ne peut pas être vide");
        }

        // Sauvegarder le besoin dans la base de données
        besoin = besoinRepository.save(besoin); // Sauvegarder et mettre à jour l'objet besoin
        return besoin;
    }






    @Override
    public List<Besoins> getAllBesoins() {
        return besoinRepository.findAll();
    }

    @Override
    public Optional<Besoins> getBesoinById(int id) {
        return besoinRepository.findById(id);
    }

    public byte[] createPDF(Besoins besoin) throws IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(byteArrayOutputStream);
        PdfDocument pdf = new PdfDocument(writer);

        // Utilisation de la taille de page A4
        pdf.setDefaultPageSize(PageSize.A4);
        Document document = new Document(pdf, PageSize.A4);

        // Chargement de la police par défaut
        PdfFont font = PdfFontFactory.createFont();

        // Couleurs personnalisées
        Color lightPurpleTitle = new DeviceRgb(180, 102, 255);
        Color transparentGrayBackground = new DeviceRgb(247, 247, 247);;
        Color transparentGrayBackground1 = new DeviceRgb(240, 240, 240);
        Color transparentGrayBorder = new DeviceRgb(128, 128, 128);

        // Ajouter un logo d'arrière-plan sur chaque page
        String logoUrl = "https://i.ibb.co/hFkpDMD/nesstechnologies-logo.jpg";
        ImageData imageData = ImageDataFactory.create(logoUrl);
        Image logo = new Image(imageData)
                .setWidth(PageSize.A4.getWidth() - 50)
                .setOpacity(0.1f)
                .setFixedPosition(25, 25);

        pdf.addEventHandler(PdfDocumentEvent.END_PAGE, new IEventHandler() {
            @Override
            public void handleEvent(Event event) {
                PdfDocumentEvent docEvent = (PdfDocumentEvent) event;
                PdfCanvas canvas = new PdfCanvas(docEvent.getPage());
                new Canvas(canvas, pdf.getDefaultPageSize())
                        .add(logo)
                        .close();
            }
        });

        // Titre principal
        document.add(new Paragraph(besoin.getTitre())
                .setFont(font)
                .setFontSize(20)
                .setBold()
                .setFontColor(lightPurpleTitle)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20));

        // Fonction utilitaire pour ajouter des sections stylées avec des cadres
        Consumer<String> addSectionTitle = (title) -> {
            Table sectionTitleTable = new Table(1);
            sectionTitleTable.setWidth(UnitValue.createPercentValue(100))
                    .setMarginTop(10)
                    .setMarginBottom(10)
                    .setBackgroundColor(transparentGrayBackground1)
                    .setBorder(new SolidBorder(transparentGrayBorder, 1));

            Cell titleCell = new Cell()
                    .add(new Paragraph(title)
                            .setFont(font)
                            .setFontSize(14)
                            .setBold()
                            .setTextAlignment(TextAlignment.CENTER)
                            .setFontColor(lightPurpleTitle))
                    .setPadding(10)
                    .setBorder(Border.NO_BORDER);

            sectionTitleTable.addCell(titleCell);
            document.add(sectionTitleTable);
        };

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm:ss", Locale.ENGLISH);


        // Ajouter les sections et les données associées
        addSectionTitle.accept("INFORMATIONS GÉNÉRALES");
        addKeyValueWithBorder(document, "Société", besoin.getSociete().getNom(), font, transparentGrayBackground, transparentGrayBorder);
        addKeyValueWithBorder(document, "Référence", besoin.getReference(), font, transparentGrayBackground, transparentGrayBorder);
        addKeyValueWithBorder(document, "État", besoin.getEtat(), font, transparentGrayBackground, transparentGrayBorder);
        addKeyValueWithBorder(document, "Créé le",
                formatDate(besoin.getDateDeCreation(), dateFormatter),
                font, transparentGrayBackground, transparentGrayBorder);
        addKeyValueWithBorder(document, "Dernière mise à jour",
                formatDate(besoin.getDateDerniereMiseAJour(), dateFormatter),
                font, transparentGrayBackground, transparentGrayBorder);
        addKeyValueWithBorder(document, "AoSow", besoin.getAoSow(), font, transparentGrayBackground, transparentGrayBorder);
        addKeyValueWithBorder(document, "Descriptif Url", besoin.getDescriptifUrl(), font, transparentGrayBackground, transparentGrayBorder);
        addKeyValueWithBorder(document, "Besoin en avance de phase", besoin.isBesoinEnAvanceDePhase() ? "Oui" : "Non", font, transparentGrayBackground, transparentGrayBorder);
        addKeyValueWithBorder(document, "Habilitable", besoin.isHabilitable() ? "Oui" : "Non", font, transparentGrayBackground, transparentGrayBorder);
        addKeyValueWithBorder(document, "Démarrage ASAP", besoin.isDemarrageASAP() ? "Oui" : "Non", font, transparentGrayBackground, transparentGrayBorder);
        addKeyValueWithBorder(document, "Date de démarrage",
                besoin.getDateDeDemarrage() != null ? formatDate(besoin.getDateDeDemarrage(), dateFormatter) : "Non défini",
                font, transparentGrayBackground, transparentGrayBorder);        addKeyValueWithBorder(document, "Besoin en avance de phase", besoin.isBesoinEnAvanceDePhase() ? "Oui" : "Non", font, transparentGrayBackground, transparentGrayBorder);
        addKeyValueWithBorder(document, "Récurrent", besoin.isReccurent() ? "Oui" : "Non", font, transparentGrayBackground, transparentGrayBorder);
        addKeyValueWithBorder(document, "Plateforme", besoin.getPlateforme() != null ? besoin.getPlateforme() : "Non défini", font, transparentGrayBackground, transparentGrayBorder);

        addSectionTitle.accept("RÉFÉRENTIEL");

        Referentiel referentiel = besoin.getReferentiel();
        if (referentiel != null) {
            // Ajouter les segments avec traduction
            String segments = referentiel.getSegments() != null && !referentiel.getSegments().isEmpty()
                    ? referentiel.getSegments().stream()
                    .map(segment -> segmentsMap.getOrDefault(segment, segment))
                    .collect(Collectors.joining(", "))
                    : "Non défini";
            addKeyValueWithBorder(document, "Segments", segments, font, transparentGrayBackground, transparentGrayBorder);

            // Ajouter les sous-segments avec traduction
            String sousSegments = referentiel.getSousSegments() != null && !referentiel.getSousSegments().isEmpty()
                    ? referentiel.getSousSegments().stream()
                    .map(sousSegment -> sousSegmentsMap.getOrDefault(sousSegment, sousSegment))
                    .collect(Collectors.joining(", "))
                    : "Non défini";
            addKeyValueWithBorder(document, "Sous-segments", sousSegments, font, transparentGrayBackground, transparentGrayBorder);

            // Ajouter les technologies (inchangé)
            String technologies = referentiel.getTechnologie() != null && !referentiel.getTechnologie().isEmpty()
                    ? String.join(", ", referentiel.getTechnologie())
                    : "Non défini";
            addKeyValueWithBorder(document, "Technologies", technologies, font, transparentGrayBackground, transparentGrayBorder);

            // Ajouter les profils référentiels avec numérotation
            List<ProfilReferentiel> profilReferentiels = referentiel.getProfilReferentiels();
            if (profilReferentiels != null && !profilReferentiels.isEmpty()) {
                int counter = 1;
                for (ProfilReferentiel profilRef : profilReferentiels) {
                    String profil = profilRef.getProfil() != null ? profilRef.getProfil() : "Non défini";
                    String niveau = profilRef.getNiveau() != null ? profilRef.getNiveau() : "Non défini";
                    addKeyValueWithBorder(
                            document,
                            "Profil Référentiel " + counter,
                            "Profil: " + profil + ", Niveau: " + niveau,
                            font,
                            transparentGrayBackground,
                            transparentGrayBorder
                    );
                    counter++;
                }
            } else {
                addKeyValueWithBorder(document, "Profil Référentiel", "Non défini", font, transparentGrayBackground, transparentGrayBorder);
            }
        }




        addSectionTitle.accept("PROFIL RECHERCHÉ");
        ProfilBesoins profil = besoin.getProfilBesoins();
        if (profil != null) {
            addKeyValueWithBorder(document, "Difficultés", profil.getDifficultes(), font, transparentGrayBackground, transparentGrayBorder);
            addKeyValueWithBorder(document, "Seniorité", profil.getSeniorite().name(), font, transparentGrayBackground, transparentGrayBorder);
            addKeyValueWithBorder(document, "Années d'expérience", String.valueOf(profil.getAnneesExperienceTotales()), font, transparentGrayBackground, transparentGrayBorder);
            addKeyValueWithBorder(document, "TJM Min Estimé", String.valueOf(profil.getTjmMinEstime()), font, transparentGrayBackground, transparentGrayBorder);
            addKeyValueWithBorder(document, "TJM Max Estimé", String.valueOf(profil.getTjmMaxEstime()), font, transparentGrayBackground, transparentGrayBorder);
            addKeyValueWithBorder(document, "TJM Min", String.valueOf(profil.getTjmMin()), font, transparentGrayBackground, transparentGrayBorder);
            addKeyValueWithBorder(document, "TJM Max", String.valueOf(profil.getTjmMax()), font, transparentGrayBackground, transparentGrayBorder);
            addKeyValueWithBorder(document, "TJM Souhaité", String.valueOf(profil.getTjmSouhaite()), font, transparentGrayBackground, transparentGrayBorder);
            addKeyValueWithBorder(document, "Avantages", profil.getAvantages() != null ? profil.getAvantages() : "Non défini", font, transparentGrayBackground, transparentGrayBorder);
            addKeyValueWithBorder(document, "Commentaire", profil.getCommentaire() != null ? profil.getCommentaire() : "Non défini", font, transparentGrayBackground, transparentGrayBorder);
        }

        //        document.add(new Paragraph("RÉFÉRENTIEL")
//                .setFont(font).setFontSize(16).setBold().setTextAlignment(TextAlignment.CENTER));
//
//        Referentiel referentiel = besoin.getReferentiel();
//        if (referentiel != null) {
//            addKeyValue(document, "Segments", referentiel.getSegments() != null ? referentiel.getSegments() : "Non défini");
//            addKeyValue(document, "Sous-segments", referentiel.getSousSegments() != null ? referentiel.getSousSegments() : "Non défini");
//            addKeyValue(document, "Profil", referentiel.getProfil() != null ? referentiel.getProfil() : "Non défini");
//            addKeyValue(document, "Technologies", referentiel.getTechnologies() != null ? referentiel.getTechnologies() : "Non défini");
//        }
        addSectionTitle.accept("BESOINS TECHNOLOGIES");
        if (!besoin.getBesoinsTechnologies().isEmpty()) {
            int counter = 1; // Initialise un compteur
            for (BesoinsTechnologies technologie : besoin.getBesoinsTechnologies()) {
                // Titre dynamique pour chaque technologie (ex: Technologie1, Technologie2...)
                String title = "Technologie" +" "+ counter;

                // Détails de la technologie formatés
                String details = String.format("Technologie: %s,Années d'expérience: %d, Niveau: %s, Importance: %s",
                        technologie.getTechnologie(),
                        technologie.getAnneesExperience(),
                        technologie.getNiveau(),
                        technologie.getImportance());

                // Ajout de la technologie au document avec le titre dynamique
                addKeyValueWithBorder(document, title, details, font, transparentGrayBackground, transparentGrayBorder);

                counter++; // Incrémente le compteur
            }
        }


        // Fermer le document
        document.close();
        return byteArrayOutputStream.toByteArray();
    }







    // Fonction utilitaire pour ajouter des champs avec des bordures et fond transparent
    private void addKeyValueWithBorder(Document document, String key, String value, PdfFont font, Color backgroundColor, Color borderColor) {
        Table table = new Table(UnitValue.createPercentArray(new float[]{1, 2})); // Deux colonnes: clé (30%), valeur (70%)
        table.setWidth(UnitValue.createPercentValue(100)) // Largeur pleine page
                .setMarginBottom(10)
                .setBackgroundColor(backgroundColor)
                .setBorder(new SolidBorder(borderColor, 1));

        // Cellule pour la clé
        table.addCell(new Cell().add(new Paragraph(key)
                        .setFont(font)
                        .setFontSize(10)
                        .setBold())
                .setBorder(Border.NO_BORDER)
                .setPadding(5));

        // Cellule pour la valeur
        table.addCell(new Cell().add(new Paragraph(value != null ? value : "Non défini")
                        .setFont(font)
                        .setFontSize(10))
                .setBorder(Border.NO_BORDER)
                .setPadding(5));

        document.add(table);
    }

    private String formatDate(LocalDateTime date, DateTimeFormatter dateFormatter) {
        return date.format(dateFormatter);
    }

    public String uploadPDFToCloudinary(byte[] pdfData, String reference) {
        try {
            // Télécharger le PDF sur Cloudinary
            String url = cloudinary.uploader().upload(pdfData,
                    Map.of("public_id", reference, "resource_type", "auto")).get("url").toString();
            return url; // Retourner l'URL du PDF
        } catch (Exception e) {
            e.printStackTrace();
            return null; // Gérer les erreurs selon vos besoins
        }
    }

    public String generateRef(String str) {
        String ref = "";

        // Extraire les trois premières lettres du titre et les convertir en majuscules
        if (str != null && str.length() >= 3) {
            ref += str.substring(0, 3).toUpperCase(); // Ajoute les 3 premières lettres en majuscules
        } else if (str != null) {
            ref += str.toUpperCase(); // Si le titre a moins de 3 caractères, ajoute tout en majuscules
        }

        // Générer une partie aléatoire avec des chiffres
        Random random = new Random();
        for (int i = 0; i < 30; i++) {
            ref += random.nextInt(10); // Génère un chiffre entre 0 et 9
        }

        return ref;
    }

    public byte[] generateQRCode(String barcodeText) throws Exception {
        int width = 500; // largeur du QR code
        int height = 500; // hauteur du QR code
        QRCodeWriter qrCodeWriter = new QRCodeWriter();

        // Créer le QR code
        BitMatrix bitMatrix = qrCodeWriter.encode(barcodeText, BarcodeFormat.QR_CODE, width, height);
        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();

        // Écrire le QR code dans le flux de sortie
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        return pngOutputStream.toByteArray(); // Retourner les données de l'image QR code en tableau d'octets
    }


    @Override
    public Rating addRatingToBesoin(float ratingValue, int id) {

        Besoins besoin = besoinRepository.findById(id).get();
        Rating existingRating = rateRepository.findByBesoin(id);
        if (existingRating != null) {
            // Update the existing rating with the new values
            existingRating.setValue(ratingValue);
            existingRating.setRatedAt(LocalDateTime.now());
            return rateRepository.save(existingRating);
        }
        // Create a new rating or update an existing one
        Rating rating = new Rating();
        rating.setValue(ratingValue);
        rating.setRatedAt(LocalDateTime.now());
        rating.setBesoins(besoin);
        rateRepository.save(rating);
        return rating;
    }

    @Override
    public float getRatingByBesooin(int idBesoin) {
        Rating rating = rateRepository.findByBesoin(idBesoin);

        if (rating == null){
            return 0;
        }
        return rateRepository.findByBesoin(idBesoin).getValue();
    }






















    // Méthode pour extraire l'ID public à partir de l'URL
    private String extractPublicIdFromUrl(String fileUrl) {
        // Assumes Cloudinary URLs follow a consistent format
        String[] parts = fileUrl.split("/");
        String publicIdWithExtension = parts[parts.length - 1];
        return publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
    }

    @Transactional
    public Besoins updateBesoin(Integer besoinId, Besoins updatedBesoin) throws Exception {
        // Trouver la société et le besoin à mettre à jour
        Besoins existingBesoin = besoinRepository.findById(besoinId)
                .orElseThrow(() -> new Exception("Société non trouvée avec l'ID : " + besoinId));
        String nomComplet = updatedBesoin.getClient().getNom() + " " + updatedBesoin.getClient().getPrenom();

        Client existingClient = clientRepository.findByNomComplet(nomComplet);
        if(existingClient != null){
            existingBesoin.setClient(existingClient);
            if(existingClient.getSociete()!=null){
                existingBesoin.setSociete(existingClient.getSociete());
            }
        }

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
        besoinRepository.save(existingBesoin);


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
            pdfData = createPDF(existingBesoin);
        } catch (IOException e) {
            e.printStackTrace();
            throw new Exception("Erreur lors de la génération du PDF pour le besoin mis à jour.");
        }
        // Télécharger le nouveau PDF sur Cloudinary
        String pdfUrl = uploadPDFToCloudinary(pdfData, existingBesoin.getReference());
        // Créer un objet Media pour stocker l'image QR code
        Media qrCodeImage = new Media();
        qrCodeImage.setName("QR Code pour " + existingBesoin.getTitre());
        // Créer un nouveau QR code pour le PDF mis à jour
        byte[] qrCodeImageData = generateQRCode(pdfUrl);
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
        return besoinRepository.save(existingBesoin);
    }


























    private static final Map<String, String> segmentsMap = Map.of(
            "dev_app", "Développement Applicatif et Intégration de progiciel",
            "agile_devops", "Agile / Devops",
            "automation_ia", "Automation & IA",
            "cloud", "Cloud",
            "other_specialties", "Autres Spécialités",
            "data", "Data",
            "security_expertise", "Expertise Sécurité",
            "project_management", "Gestion de Projet et Organisation",
            "infrastructure", "Infrastructure"
    );




    private static final Map<String, String> sousSegmentsMap = Map.ofEntries(
            Map.entry("front", "Web (front)"),
            Map.entry("back", "Web (back)"),
            Map.entry("fullstack", "Web (fullstack)"),
            Map.entry("software", "Logiciel"),
            Map.entry("mobile", "Mobile"),
            Map.entry("ia", "IA"),
            Map.entry("automation_test", "Automatisation Test"),
            Map.entry("blockchain", "Blockchain"),
            Map.entry("embarque", "Systèmes embarqués"),
            Map.entry("api", "API"),
            Map.entry("devops", "Devops"),
            Map.entry("iot", "IoT"),
            Map.entry("PrCrEr", "PROGICIELS/CRM/ERP"),
            Map.entry("cms", "CMS"),
            Map.entry("LowNoCode", "Low-Code/ No-Code"),
            Map.entry("databases", "Base de données"),
            Map.entry("networks", "Réseaux (constructeurs, protocoles…)"),
            Map.entry("security", "Sécurité"),
            Map.entry("systemes", "Système"),
            Map.entry("middleware", "Middleware"),
            Map.entry("AppServer", "Serveur d'application"),
            Map.entry("scripting", "Scripting"),
            Map.entry("ordonanceur", "Ordonnanceur"),
            Map.entry("PosteTravail", "Poste de travail"),
            Map.entry("TelecVoixDonnees", "Télécom (voix, données…)"),
            Map.entry("sauvegarde", "Sauvegarde"),
            Map.entry("stockage", "Stockage"),
            Map.entry("PcaPra", "PCA / PRA"),
            Map.entry("virtualization", "Virtualisation"),
            Map.entry("cloudd", "Cloud"),
            Map.entry("radio", "Radio"),
            Map.entry("IOT", "IoT"),
            Map.entry("mainframe", "Mainframe"),
            Map.entry("cloud", "Cloud"),
            Map.entry("cybersecurity", "Cybersécurité"),
            Map.entry("cryptography", "Cryptographie"),
            Map.entry("vulnerabilites", "Vulnérabilités"),
            Map.entry("risc", "Risque"),
            Map.entry("infra", "Infrastructure"),
            Map.entry("conformity", "Conformité"),
            Map.entry("complicance", "Complliance"),
            Map.entry("governance", "Gouvernance"),

            // Data-related entries
            Map.entry("big_data", "BI/Big Data"),
            Map.entry("IA", "IA"),
            Map.entry("machine_learning", "Machine Learning"),
            Map.entry("bot", "Bot"),
            Map.entry("mining", "Mining"),
            // Other specialties
            Map.entry("ux_ui_designer", "UI/UX Designer"),
            Map.entry("web_integration", "Intégration Web"),
            Map.entry("seo", "SEO"),



            // Automation & AI
            Map.entry("Ia", "IA"),
            Map.entry("Bot", "Bot"),
            Map.entry("automation", "Automatisation"),

            // Agile / Devops
            Map.entry("ux_ui", "UI/UX"),
            Map.entry("coach_agile_devops", "Coach Agile / Devops"),
            Map.entry("scrum_master", "Scrum Master"),
            Map.entry("product_owner", "Product Owner"),
            Map.entry("lead", "Lead"),
            Map.entry("director", "Directeur de projets"),
            Map.entry("project_manager", "Chef de projets"),
            Map.entry("coordinateur", "Coordinateur"),
            Map.entry("master", "Scrum Master"),
            Map.entry("prodOwner", "Product Owner"),
            Map.entry("ItMang", "IT Manager/Directeur/Responsable de Domaine"),
            Map.entry("auditor", "Auditeur"),
            Map.entry("trainer", "Formateur"),
            Map.entry("methAg", "Méthodologie Agile"),
            Map.entry("gouvernance", "Gouvernance"),
            Map.entry("process_improvement", "Amélioration Process IT"),
            Map.entry("amelTransformation", "Transition / Transformation"),
            Map.entry("orgEntreprise", "Organisationel / entreprise"),
            Map.entry("MOA_MOE", "Chef de projets MOA/MOE"),
            Map.entry("pmo", "PMO"),
            Map.entry("Lead", "Lead"),
            Map.entry("coach", "Coach")

    );
}
