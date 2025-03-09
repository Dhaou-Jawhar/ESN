import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { UserService } from "./src/app/demo/service/user.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private authService: UserService) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (request.headers.get("skip")) {
            return next.handle(request);
        }

        // Récupération du token d'accès depuis le localStorage
        const token = localStorage.getItem('auth_token');
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                // Vérifie si l'erreur est liée à l'expiration du token (erreur 401 ou 403)
                if (
                     error.status === 403 ||
                    // error.error ||
                    error.error.message === 'Token expired'
                ) {
                    const refreshToken = localStorage.getItem('refresh_token');

                    // Si le refresh token existe, tenter de rafraîchir le token d'accès
                    if (refreshToken) {
                        return this.authService.refreshToken().pipe(
                            switchMap((response: any) => {
                                const { accessToken, refreshToken, firstName, lastName, usrMail,role, picture_url } = response;
                                // Stocke les nouveaux tokens
                                this.authService.storeTokens(accessToken, refreshToken, firstName, lastName, usrMail,role, picture_url);

                                // Réessaie la requête d'origine avec le nouveau token d'accès
                                request = request.clone({
                                    setHeaders: {
                                        Authorization: `Bearer ${accessToken}`
                                    }
                                });
                                return next.handle(request); // Répéter la requête d'origine
                            }),
                            catchError((refreshError: HttpErrorResponse) => {
                                console.warn(refreshError)

                                // Si l'erreur du refresh token est liée à l'expiration, faire un logout
                                if (refreshError.status === 400 && (refreshError.error === 'Refresh token expiré. Veuillez reconnecter SVP!')||(refreshError.error === 'Refresh token not found')) {
                                    this.authService.logout(); // Déconnexion si le refresh token est expiré
                                   // localStorage.clear();
                                }
                                return throwError(refreshError); // Retourne l'erreur après échec du refresh
                            })
                        );
                    } else {
                        // Si pas de refresh token, faire un logout immédiatement
                        this.authService.logout();
                    }
                }

                return throwError(error); // Ne pas déconnecter pour d'autres types d'erreurs
            })
        );
    }
}
