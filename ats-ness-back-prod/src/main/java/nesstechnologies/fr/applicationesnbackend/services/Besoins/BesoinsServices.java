package nesstechnologies.fr.applicationesnbackend.services.Besoins;

import nesstechnologies.fr.applicationesnbackend.entities.Besoins;
import nesstechnologies.fr.applicationesnbackend.entities.Client;
import nesstechnologies.fr.applicationesnbackend.entities.Rating;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface BesoinsServices {
    public Besoins createBesoin(Besoins besoin) throws Exception;
    public List<Besoins> getAllBesoins();
    public Optional<Besoins> getBesoinById(int id);
    public String generateRef(String str);
    public byte[] createPDF(Besoins besoin) throws IOException;
    public String uploadPDFToCloudinary(byte[] pdfData, String reference);
    public byte[] generateQRCode(String barcodeText) throws Exception;
    public Rating addRatingToBesoin(float ratingValue, int id);
    public float getRatingByBesooin(int idBesoin);
    public Besoins createBesoinToClient(Besoins besoin, Client client)throws Exception;
    public Besoins updateBesoin(Integer besoinId, Besoins updatedBesoin) throws Exception;
}
