import { Doc } from "./doc";

export interface DomicilioDoc extends Doc {
    calle: string;
    numero: string;
    localidad: string;
    provincia: string;
    referencia: string;
}
