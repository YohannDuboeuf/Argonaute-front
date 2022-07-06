import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Argonaut } from 'src/models/argonaut.model';

@Injectable({
  providedIn: 'root',
})
export class ArgonautService {

  constructor(private http: HttpClient) {}
  getAll(): Observable<Argonaut[]> {
    return this.http
      .get< Argonaut[] >(environment.API_URL)
      .pipe(map((argonauts) => argonauts || []));
  }
  create(argonaut: Argonaut): Observable<any> {
    return this.http.post<Argonaut>(
      environment.API_URL,
      argonaut
    );
  }
}
