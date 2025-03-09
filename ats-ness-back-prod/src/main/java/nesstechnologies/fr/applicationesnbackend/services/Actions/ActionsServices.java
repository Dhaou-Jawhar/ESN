package nesstechnologies.fr.applicationesnbackend.services.Actions;

import nesstechnologies.fr.applicationesnbackend.dto.ActionsSimpleDTO;
import nesstechnologies.fr.applicationesnbackend.dto.BesoinsDTO;
import nesstechnologies.fr.applicationesnbackend.dto.CandidatForActionsDTO;
import nesstechnologies.fr.applicationesnbackend.entities.Actions;
import org.springframework.data.domain.Page;

public interface ActionsServices {
    public Actions AddActionAndAssignToClient(int id,Actions action);
    public Page<ActionsSimpleDTO> getAllActions(int page, int size);
    public Page<CandidatForActionsDTO> getAllCandidatsActions(int page, int size);
    public Page<BesoinsDTO> getAllBesoinsActions(int page, int size);
    public ActionsSimpleDTO AddActionAndAssignToCandidat(int id, Actions action);
    Actions getActionById(int id);
    public Actions updateAction(int id, Actions action);
    void deleteAction(int id);


}
