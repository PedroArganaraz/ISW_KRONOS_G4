import { staticImplements } from "../../decorators/staticImplements";
import { PedidoEnvioDoc } from "../../interfaces/database-docs/pedidoEnvioDoc";
import { DBStorable, DBStorableStatic } from "../../interfaces/dbStorable";
import { Domicilio } from "./domicilio";
import { TipoCarga } from "./tipoCarga";

@staticImplements<DBStorableStatic<PedidoEnvioDoc, PedidoEnvio>>()
export class PedidoEnvio implements DBStorable<PedidoEnvioDoc> {
    private _fechaRetiro: Date;
    private _fechaEntrega: Date;
    private _imagenes: Array<string>;
    private _observaciones: string;
    private _domicilioEntrega: Domicilio;
    private _domicilioRetiro: Domicilio;
    private _tipoCarga: TipoCarga;

    constructor(
        fechaRetiro: Date,
        fechaEntrega: Date,
        imagenes: Array<string>,
        observaciones: string,
        domicilioEntrega: Domicilio,
        domicilioRetiro: Domicilio,
        tipoDeCarga: TipoCarga
    ) {
        this._fechaRetiro = fechaRetiro;
        this._fechaEntrega = fechaEntrega;
        this._imagenes = imagenes;
        this._observaciones = observaciones;
        this._domicilioEntrega = domicilioEntrega;
        this._domicilioRetiro = domicilioRetiro;
        this._tipoCarga = tipoDeCarga;
    }

    toDoc(): PedidoEnvioDoc {
        return {
            id: '',
            fechaRetiro: this._fechaRetiro.toISOString(),
            fechaEntrega: this._fechaEntrega.toISOString(),
            imagenes: this._imagenes,
            observaciones: this._observaciones,
            domicilioEntrega: this._domicilioEntrega.toDoc(), // Assuming Domicilio implements toDoc
            domicilioRetiro: this._domicilioRetiro.toDoc(),   // Assuming Domicilio implements toDoc
            tipoDeCarga: this._tipoCarga.toDoc()                // Assuming TipoCarga implements toDoc
        };
    }

    public static fromDoc(doc: PedidoEnvioDoc): PedidoEnvio {
        return new PedidoEnvio(
            new Date(doc.fechaRetiro),
            new Date(doc.fechaEntrega),
            doc.imagenes,
            doc.observaciones,
            Domicilio.fromDoc(doc.domicilioEntrega),  // Assuming Domicilio also implements DBStorable
            Domicilio.fromDoc(doc.domicilioRetiro),   // Assuming Domicilio also implements DBStorable
            TipoCarga.fromDoc(doc.tipoDeCarga)          // Assuming TipoCarga also implements DBStorable
        );
    }

    // Getters and Setters
    get fechaRetiro(): Date {
        return this._fechaRetiro;
    }

    set fechaRetiro(value: Date) {
        this._fechaRetiro = value;
    }

    get fechaEntrega(): Date {
        return this._fechaEntrega;
    }

    set fechaEntrega(value: Date) {
        this._fechaEntrega = value;
    }

    get imagenes(): Array<string> {
        return this._imagenes;
    }

    set imagenes(value: Array<string>) {
        this._imagenes = value;
    }

    get observaciones(): string {
        return this._observaciones;
    }

    set observaciones(value: string) {
        this._observaciones = value;
    }

    get domicilioEntrega(): Domicilio {
        return this._domicilioEntrega;
    }

    set domicilioEntrega(value: Domicilio) {
        this._domicilioEntrega = value;
    }

    get domicilioRetiro(): Domicilio {
        return this._domicilioRetiro;
    }

    set domicilioRetiro(value: Domicilio) {
        this._domicilioRetiro = value;
    }

    get tipoCarga(): TipoCarga {
        return this._tipoCarga;
    }

    set tipoCarga(value: TipoCarga) {
        this._tipoCarga = value;
    }
}