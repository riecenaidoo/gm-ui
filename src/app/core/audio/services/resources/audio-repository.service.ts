import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Server} from "../../models/server";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AudioRepositoryService {

  public constructor(private http: HttpClient) {
  }

  // ------ API ------

  public findServers(): Observable<Server[]> {
    return this.http.get<Server[]>("http://localhost:5050/servers");
  }

}
