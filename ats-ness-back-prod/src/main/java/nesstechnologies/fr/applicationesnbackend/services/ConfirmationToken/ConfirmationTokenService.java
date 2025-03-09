package nesstechnologies.fr.applicationesnbackend.services.ConfirmationToken;


import nesstechnologies.fr.applicationesnbackend.entities.ConfirmationToken;

import java.util.Optional;

public interface ConfirmationTokenService {
    public void saveConfirmationToken(ConfirmationToken token);

    public Optional<ConfirmationToken> getToken(String token);

    public int setConfirmedAt(String token);
}
