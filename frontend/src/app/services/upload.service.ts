import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<{ url: string }>(
      `${this.apiUrl}/upload`,
      formData
    );
  }
}
