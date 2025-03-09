package nesstechnologies.fr.applicationesnbackend.services.Client;

import nesstechnologies.fr.applicationesnbackend.dto.ClientDTO;
import nesstechnologies.fr.applicationesnbackend.entities.Besoins;
import nesstechnologies.fr.applicationesnbackend.entities.Client;
import org.springframework.data.domain.Page;

public interface ClientServices {
    public Client createClient(Client c) throws Exception;
    public ClientDTO getClientById(Integer id);
    public Client updateClient(Integer clientId, Client updatedClientData);
    public void deleteClient(Integer clientId);
    public Page<Client> getAllClients(int page, int size);
    public Besoins updateBesoinAndProfil(Integer clientId, Besoins updatedBesoin) throws Exception;
    public Besoins createBesoinAndAssignToClient(Besoins besoin, Integer clientId) throws Exception ;



}
