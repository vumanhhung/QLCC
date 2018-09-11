import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { FileInfo } from '@progress/kendo-angular-upload';

@Injectable()
export class FileUploadEndpoint extends EndpointFactory {
    private readonly _fileuploadUrl = "/api/FileUploads";
    get fileuploadUrl() { return this.configurations.baseUrl + this._fileuploadUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }

    uploadFile<T>(stringRandom?: string, urlServer?: string, file?: FileInfo[]): Observable<T> {
        let endpointUrl = `${this._fileuploadUrl}/UploadFile/${stringRandom}/${urlServer}`;

        let jb = {
            "file": file, "url": "a"
        }

         
        return this.http.post(endpointUrl, jb, this.getRequestHeaders())
            .catch(error => {
            return this.handleError(error, () => this.uploadFile(stringRandom, urlServer, file));
        });
    }
}