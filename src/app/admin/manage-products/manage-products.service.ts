import { Injectable, Injector } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class ManageProductsService extends ApiService {
  constructor(injector: Injector) {
    super(injector);
  }

  uploadProductsCSV(file: File): Observable<unknown> {
    if (!this.endpointEnabled('import')) {
      console.warn(
        'Endpoint "import" is disabled. To enable change your environment.ts config'
      );
      return EMPTY;
    }

    return this.getPreSignedUrl(file.name).pipe(
      switchMap((url) =>
        this.http.put(url, file, {
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'text/csv',
          },
        })
      )
    );
  }

  private getAuthToken(): string | null {
    const token = localStorage.getItem('authorization_token');

    if (!token) {
      localStorage.setItem('authorization_token', 'Basic ' + btoa('SiarheiDrozd:TEST_PASSWORD'))
    }

    return token;
  }
  private getPreSignedUrl(fileName: string): Observable<string> {
    const url = this.getUrl('import', 'import');
    const authorization = this.getAuthToken();
    const options = {
      params: {
        name: fileName,
      },
      headers: {}
    }

    if (authorization) {
      options.headers = {
        authorization
      }
    }

    return this.http.get<string>(url, options);
  }
}
