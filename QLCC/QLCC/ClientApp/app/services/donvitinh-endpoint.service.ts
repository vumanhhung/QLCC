import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class DonViTinhEndpoint extends EndpointFactory {
    private readonly _donvitinhUrl = "/api/DonViTinhs";
    get donvitinhUrl() { return this.configurations.baseUrl + this._donvitinhUrl; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getItems<T>(start: number, count: number, whereClause: string, orderBy: string): Observable<T> {
        let url = `${this.donvitinhUrl}/getItems/${start}/${count}/${orderBy}`;
        let body = JSON.stringify(whereClause);
        return this.http.put(url, body, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItems(start, count, whereClause, orderBy));
            });
    }
    
    getAllDonViTinh<T>(): Observable<T> {
        return this.http.get(this.donvitinhUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllDonViTinh());
            });
    }
    
    getDonViTinhByID<T>(Id?: number): Observable<T> {
        let endpointUrl = Id ? `${this.donvitinhUrl}/${Id}` : this.donvitinhUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDonViTinhByID(Id));
            });
    }
    
    addnewDonViTinh<T>(donvitinhObject?: any): Observable<T> {
        let body = JSON.stringify(donvitinhObject);
        return this.http.post(this.donvitinhUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.addnewDonViTinh(donvitinhObject));
        });
    }
    
    updateDonViTinh<T>(id?: number, donvitinhObject?: any): Observable<T> {
        let endpointUrl = `${this.donvitinhUrl}/${id}`;
        let body = JSON.stringify(donvitinhObject);
        return this.http.put(endpointUrl, body, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.updateDonViTinh(id, donvitinhObject));
        });
    }
    
    deleteDonViTinh<T>(id: number): Observable<T> {
        let endpointUrl = `${this.donvitinhUrl}/${id}`;
        return this.http.delete(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteDonViTinh(id));
            });
    }
}