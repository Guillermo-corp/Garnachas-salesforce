/* import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments'; // Importa el archivo de configuración

@Injectable({
  providedIn: 'root',
})
export class SalesforceService {
  private salesforceBaseUrl = environment.salesforce.baseUrl; // Base URL desde environment
  private accessToken = environment.salesforce.accessToken; // Token desde environment

  constructor(private http: HttpClient) {}

  // Método para enviar datos de compra a Salesforce
  createPurchaseRecord(purchaseData: any): Observable<any> {
    const url = `${this.salesforceBaseUrl}`; 
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(url, purchaseData, { headers });
  }
} */

  import { Injectable } from '@angular/core';
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { Observable, throwError } from 'rxjs';
  import { catchError, switchMap } from 'rxjs/operators';
  import { environment } from '../../environments/environments';
  
  @Injectable({
    providedIn: 'root',
  })
  export class SalesforceService {
    private accessToken = environment.salesforce.accessToken; // Access Token inicial
    private baseUrl = environment.salesforce.baseUrl;
  
    constructor(private http: HttpClient) {}
  
    // Método para renovar el Access Token usando el Refresh Token
    private refreshAccessToken(): Observable<string> {
      const body = new URLSearchParams();
      body.set('grant_type', 'refresh_token');
      body.set('refresh_token', environment.salesforce.refreshToken);
      body.set('client_id', environment.salesforce.clientId);
      body.set('client_secret', environment.salesforce.clientSecret);
  
      return this.http.post<any>(environment.salesforce.tokenUrl, body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }).pipe(
        switchMap((response) => {
          if (response.access_token) {
            this.accessToken = response.access_token; // Actualiza el Access Token
            return new Observable<string>((observer) => {
              observer.next(this.accessToken);
              observer.complete();
            });
          } else {
            return throwError(() => new Error('No se pudo renovar el Access Token.'));
          }
        }),
        catchError((error) => {
          console.error('Error al renovar el Access Token:', error);
          return throwError(() => error);
        })
      );
    }
  
    // Método para realizar solicitudes a Salesforce
    private getHeaders(): HttpHeaders {
      return new HttpHeaders({
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      });
    }
  
    // Método para enviar datos de compra a Salesforce
    createPurchaseRecord(purchaseData: any): Observable<any> {
      const url = `${this.baseUrl}/services/data/v62.0/sobjects/Purchase__c`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      });
      return this.http.post(url, purchaseData, { headers }).pipe(
        catchError((error) => {
          console.error('Error al crear el registro en Salesforce:', error);
          return throwError(() => error);
        })
      );

      return this.http.post(url, purchaseData, { headers: this.getHeaders() }).pipe(
        catchError((error) => {
          if (error.status === 401) {
            // Si el token expira, intenta renovarlo
            console.warn('El Access Token ha expirado. Intentando renovarlo...');
            return this.refreshAccessToken().pipe(
              switchMap((newAccessToken) => {
                const newHeaders = new HttpHeaders({
                  Authorization: `Bearer ${newAccessToken}`,
                  'Content-Type': 'application/json',
                });
                return this.http.post(url, purchaseData, { headers: newHeaders });
              })
            );
          }
          return throwError(() => error);
        })
      );
    }
  }