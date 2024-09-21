import { staticImplements } from "../../decorators/staticImplements";
import { ELoadType } from "../../enums/load-type";
import { TipoCargaDoc } from "../../interfaces/database-docs/tipoCargaDoc";
import { DBStorable, DBStorableStatic } from "../../interfaces/dbStorable";

@staticImplements<DBStorableStatic<TipoCargaDoc, TipoCarga>>()
export class TipoCarga implements DBStorable<TipoCargaDoc> {
    private _tipo: string;
    private _id: string;

    constructor(tipo: string) {
        this._tipo = tipo;
        this._id = tipo;
    }

    static fromDoc(doc: TipoCargaDoc): TipoCarga {
        // return new TipoCarga(ELoadType[doc.descripcion as keyof typeof ELoadType]);
        return new TipoCarga(doc.descripcion);

    }

    toDoc(): TipoCargaDoc {
        return {
            id: '',
            descripcion: this._tipo
        }
    }

    // Getter and Setter
    get tipo(): string {
        return this._tipo;
    }

    set tipo(value: string) {
        this._tipo = value;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get nombre() {
        return this._tipo;
    }
}