import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces para tipar las respuestas
export interface Provincia {
    id: string;
    nombre: string;
}

export interface Localidad {
    id: string;
    nombre: string;
}

@Injectable({
    providedIn: 'root'
})
export class GeorefService {
    private readonly baseUrl = 'https://apis.datos.gob.ar/georef/api';

    constructor(private http: HttpClient) { }

    // Obtener todas las provincias
    getProvincias(): Observable<any> {
        const url = `${this.baseUrl}/provincias`;
        return this.http.get(url, {
            params: new HttpParams().set('campos', 'id,nombre') // Solo obtenemos id y nombre
        });
    }

    // Obtener todas las localidades de una provincia por su ID
    getLocalidadesPorProvincia(provinciaId: string): Observable<any> {
        const url = `${this.baseUrl}/localidades`;
        return this.http.get(url, {
            params: new HttpParams()
                .set('provincia', provinciaId) // Parámetro provincia
                .set('campos', 'id,nombre')    // Solo obtenemos id y nombre
                .set('max', '1000')            // Ajustar el número máximo de resultados
        });
    }
}