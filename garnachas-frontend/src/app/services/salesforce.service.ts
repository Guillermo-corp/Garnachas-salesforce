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
 /*  private accessToken = process.env['SALESFORCE_ACCESS_TOKEN'] || ''; 
  private baseUrl = process.env['SALESFORCE_BASE_URL'] || '';  */
  constructor(private http: HttpClient) {}

  // Método para renovar el Access Token usando el Refresh Token
  /* private refreshAccessToken(): Observable<string> {
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
  } */

  // Método para realizar solicitudes a Salesforce
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    });
  }

  // Método para enviar datos de compra a Salesforce
  createPurchaseRecord(): Observable<any> {
    const url = `${this.baseUrl}/services/data/v62.0/sobjects/Purchase__c`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    });
    return this.http.post(url,{ headers }).pipe(
      catchError((error) => {
        console.error('Error al crear el registro en Salesforce:', error);
        return throwError(() => error);
      })
    );
    /* return this.http.post(url, purchaseData, { headers: this.getHeaders() }).pipe(
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
    ); */
  }

  createCliente(clienteData: any): Observable<any> {
    const url = `${this.baseUrl}/services/data/v62.0/sobjects/Cliente__c`;
    const headers = this.getHeaders();
    return this.http.post(url, clienteData, { headers }).pipe(
      catchError((error) => {
        console.error('Error al crear Cliente__c:', error);
        return throwError(() => error);
      })
    );
  }

  createCompra(compraData: any): Observable<any> {
    const url = `${this.baseUrl}/services/data/v62.0/sobjects/Compra__c`;
    const headers = this.getHeaders();
    return this.http.post(url, compraData, { headers }).pipe(
      catchError((error) => {
        console.error('Error al crear Compra__c:', error);
        return throwError(() => error);
      })
    );
  }

  createPlatillo(platilloData: any): Observable<any> {
    const url = `${this.baseUrl}/services/data/v62.0/sobjects/Platillo__c`;
    const headers = this.getHeaders();
    return this.http.post(url, platilloData, { headers }).pipe(
      catchError((error) => {
        console.error('Error al crear Platillo__c:', error);
        return throwError(() => error);
      })
    );
  }

  createDireccion(direccionData: any): Observable<any> {
    const url = `${this.baseUrl}/services/data/v62.0/sobjects/Direccion__c`;
    const headers = this.getHeaders();
    return this.http.post(url, direccionData, { headers }).pipe(
      catchError((error) => {
        console.error('Error al crear Direccion__c:', error);
        return throwError(() => error);
      })
    );
  }

  // Método para crear una sesión de Stripe en Vercel
  /* createCheckoutSession(cartItems: any[]): Observable<any> {
    const url = 'https://garnachas-mx.vercel.app/api/create-checkout-session'; // Cambia a tu dominio en Vercel
    return this.http.post(url, { cartItems, connectedAccountId: 'acct_1RDonfDuneb1ckN1' });
  } */

  // Método para crear una sesión de Stripe en Salesforce
  /* createStripeSession(cartItems: any[]): Observable<any> {
    const url = `${this.baseUrl}/services/apexrest/StripeService`; // URL de tu clase Apex en Salesforce
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`, // Usa el Access Token
      'Content-Type': 'application/json',
    });
  
    return this.http.post(url, { cartItemsJson: JSON.stringify(cartItems) }, { headers }).pipe(
      catchError((error) => {
        console.error('Error al crear la sesión de Stripe en Salesforce:', error);
        return throwError(() => error);
      })
    );
  } */
}