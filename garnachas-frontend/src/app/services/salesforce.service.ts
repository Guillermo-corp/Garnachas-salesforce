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
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class SalesforceService {
  private salesforceBaseUrl = environment.salesforce.baseUrl;
  private accessToken = environment.salesforce.accessToken;

  constructor(private http: HttpClient) {}

  // Método para enviar datos de compra a Salesforce
  /* createPurchaseRecord(purchaseData: any): Observable<any> {
    const url = `${this.salesforceBaseUrl}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(url, purchaseData, { headers }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          // Si el token expira, intenta renovarlo
          return this.refreshAccessToken().pipe(
            switchMap((newAccessToken) => {
              // Reintenta la solicitud con el nuevo token
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
  } */
 createPurchaseRecord(purchaseData: any): Observable<any> {
  const url = `${this.salesforceBaseUrl}`;
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.accessToken}`,
    'Content-Type': 'application/json',
  });

  return this.http.post(url, purchaseData, { headers }).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Si el token expira, intenta renovarlo
        console.warn('El Access Token ha expirado. Intentando renovarlo...');
        return this.refreshAccessToken().pipe(
          switchMap((newAccessToken) => {
            // Reintenta la solicitud con el nuevo token
            const newHeaders = new HttpHeaders({
              Authorization: `Bearer ${newAccessToken}`,
              'Content-Type': 'application/json',
            });
            return this.http.post(url, purchaseData, { headers: newHeaders });
          })
        );
      }
      console.error('Error al realizar la solicitud:', error);
      return throwError(() => error);
    })
  );
}

  // Método para renovar el Access Token
  private refreshAccessToken(): Observable<string> {
    const url = environment.salesforce.tokenUrl;
    const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', environment.salesforce.refreshToken)
      .set('client_id', environment.salesforce.clientId)
      .set('client_secret', environment.salesforce.clientSecret);
  
    return this.http.post<any>(url, body.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    }).pipe(
      switchMap((response) => {
        if (response.access_token) {
          this.accessToken = response.access_token; // Actualiza el token en memoria
          console.log('Access Token renovado exitosamente.');
          return new Observable<string>((observer) => {
            observer.next(this.accessToken);
            observer.complete();
          });
        } else {
          console.error('No se recibió un nuevo Access Token en la respuesta.');
          return throwError(() => new Error('No se pudo renovar el Access Token.'));
        }
      }),
      catchError((error) => {
        console.error('Error al renovar el Access Token:', error);
        return throwError(() => error);
      })
    );
  }
}