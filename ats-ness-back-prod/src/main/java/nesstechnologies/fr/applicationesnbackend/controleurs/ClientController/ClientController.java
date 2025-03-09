package nesstechnologies.fr.applicationesnbackend.controleurs.ClientController;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import nesstechnologies.fr.applicationesnbackend.dto.ClientDTO;
import nesstechnologies.fr.applicationesnbackend.entities.Besoins;
import nesstechnologies.fr.applicationesnbackend.entities.Client;
import nesstechnologies.fr.applicationesnbackend.services.Client.ClientServices;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
@Tag(name = "✅ Gestion de clients ✅", description = "APIs de gestion de clients")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ClientController {
    private final ClientServices clientServices;

    @PostMapping("/createClient")
    public ResponseEntity<?> createClient(@RequestBody Client client) {
        try {
            Client createdClient = clientServices.createClient(client);
            return ResponseEntity.ok(createdClient);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getClient/{id}")
    public ResponseEntity<ClientDTO> getClientById(@PathVariable Integer id) {
        ClientDTO clientDTO = clientServices.getClientById(id);
        return ResponseEntity.ok(clientDTO);
    }



    @PutMapping("/updateClient/{clientId}")
    public ResponseEntity<?> updateClient(
            @PathVariable Integer clientId,
            @RequestBody Client updatedClient,
            HttpServletRequest request
    ) {
        try {
            System.err.println( clientId);
            Client client = clientServices.updateClient(clientId, updatedClient);
            return ResponseEntity.ok(client);

        } catch (Exception e) {
            System.err.println( e.getMessage());
            return ResponseEntity.badRequest().body("Failed to update client: " + e.getMessage());
        }
    }



    @DeleteMapping("/removeClient/{id}")
    public void deleteCandidat(@PathVariable int id) {
        clientServices.deleteClient(id);
    }


    @GetMapping("/getAllClients")
    public Page<Client> getClients(@RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "50") int size) {
        return clientServices.getAllClients(page, size);
    }



    @PutMapping("/updateClientBesoin/{clientId}")
    public Besoins updateBesoin(
            @PathVariable Integer clientId,
            @RequestBody Besoins updatedBesoin) throws Exception {

        // Appeler le service pour mettre à jour le besoin et son profil
        return clientServices.updateBesoinAndProfil(clientId, updatedBesoin);
    }



    // Endpoint pour créer un besoin en associant une société par ID
    @PostMapping("/createBesoinAndAdsignToClient/{clientId}")
    public Besoins createBesoin(
            @RequestBody Besoins besoin,  // Le besoin passé dans le corps de la requête
            @PathVariable Integer clientId) throws Exception {  // L'ID de la société
        // Appeler le service pour créer le besoin et l'associer à la société
        return clientServices.createBesoinAndAssignToClient(besoin, clientId);
    }
}
