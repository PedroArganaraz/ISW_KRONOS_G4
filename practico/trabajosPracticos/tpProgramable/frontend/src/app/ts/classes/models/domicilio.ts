import { staticImplements } from "../../decorators/staticImplements";
import { DomicilioDoc } from "../../interfaces/database-docs/domicilioDoc";
import { DBStorable, DBStorableStatic } from "../../interfaces/dbStorable";

@staticImplements<DBStorableStatic<DomicilioDoc, Domicilio>>()
export class Domicilio implements DBStorable<DomicilioDoc> {
    private _calle: string;
    private _numero: string;
    private _localidad: string;
    private _provincia: string;
    private _referencia: string;

    constructor(
        calle: string,
        numero: string,
        localidad: string,
        provincia: string,
        referencia: string
    ) {
        this._calle = calle;
        this._numero = numero;
        this._localidad = localidad;
        this._provincia = provincia;
        this._referencia = referencia;
    }

    public static fromDoc(doc: DomicilioDoc): Domicilio {
        return new Domicilio(
            doc.calle,
            doc.numero,
            doc.localidad,
            doc.provincia,
            doc.referencia
        );
    }

    toDoc(): DomicilioDoc {
        return {
            id: '',
            calle: this.calle,
            numero: this.numero,
            localidad: this.localidad,
            provincia: this.provincia,
            referencia: this.referencia
        }
    }

    // Getters and Setters
    get calle(): string {
        return this._calle;
    }

    set calle(value: string) {
        this._calle = value;
    }

    get numero(): string {
        return this._numero;
    }

    set numero(value: string) {
        this._numero = value;
    }

    get localidad(): string {
        return this._localidad;
    }

    set localidad(value: string) {
        this._localidad = value;
    }

    get provincia(): string {
        return this._provincia;
    }

    set provincia(value: string) {
        this._provincia = value;
    }

    get referencia(): string {
        return this._referencia;
    }

    set referencia(value: string) {
        this._referencia = value;
    }
}