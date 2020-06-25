import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RecordsService {

	httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'none'
        })
    };

  public apiUrlHead: string = environment.api; // API host
  public apiUrlTail: string = '/api/v1'; // API version
  
  public previewSite: string = environment.preview;
  public user: any;
  public apiUser: any;
  public title: string = 'MultiSite Administrator Lite';
  public messages = [];
  public messagesMore = [];
  urlDocument: string = `${this.apiUrlHead}/document${this.apiUrlTail}`;
  urlOptions: string = `${this.apiUrlHead}/options${this.apiUrlTail}`;
  header: any = { headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })};
	constructor(private http: HttpClient, private _router: Router){}

  public logout() {
    localStorage.removeItem("user-token");
    this._router.navigate(['login']);
  }

	public postOptions(document : any, type: string): Observable<any> {
    return this.http.post(this.urlOptions + '?type=' + type, JSON.stringify(document), this.header).pipe(catchError(this.handleError))
	}

	public postDocument(document : any, type: string): Observable<any> {
    return this.http.post(this.urlDocument + '?type=' + type, JSON.stringify(document), this.header).pipe(catchError(this.handleError))
	}

	public putDocument(document : any): Observable<any> {
		return this.http.put(this.urlDocument, JSON.stringify(document), this.header).pipe(catchError(this.handleError))
	}

	public deleteDocument(document : any): Observable<any> {
		return this.http.delete(this.urlDocument + '/' + document.id, this.header).pipe(catchError(this.handleError))
	}

  public getDocuments(type: string): Observable<any> {
		return this.http.get(this.urlDocument + '?type=' + type, this.header).pipe(catchError(this.handleError))
	}

  public getOptions(type: string): Observable<any> {
		return this.http.get(this.urlOptions + '?type=' + type, this.header).pipe(catchError(this.handleError))
	}

  public getUrl(url: string, header: string): Observable<any> {
    return header ? this.http.get(url, { headers: new HttpHeaders(JSON.parse(header))}).pipe(catchError(this.handleError)) :
    this.http.get(url).pipe(catchError(this.handleError))
	}

  private handleError(error: HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        console.log('An error occurred:', error.error.message);
      } else {
        console.log(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
      }
      return throwError(
        'Something bad happened; please try again later.');
  }
}
