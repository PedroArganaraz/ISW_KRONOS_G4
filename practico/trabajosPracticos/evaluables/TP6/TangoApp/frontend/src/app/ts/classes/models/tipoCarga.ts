import { staticImplements } from "../../decorators/staticImplements";
import { ELoadType } from "../../enums/load-type";
import { TipoCargaDoc } from "../../interfaces/database-docs/tipoCargaDoc";
import { DBStorable, DBStorableStatic } from "../../interfaces/dbStorable";

@staticImplements<DBStorableStatic<TipoCargaDoc, TipoCarga>>()
export class TipoCarga implements DBStorable<TipoCargaDoc> {
    private _tipo: ELoadType;

    constructor(tipo: ELoadType) {
        this._tipo = tipo;
    }

    static fromDoc(doc: TipoCargaDoc): TipoCarga {
        return new TipoCarga(ELoadType[doc.descripcion as keyof typeof ELoadType]);
    }

    toDoc(): TipoCargaDoc {
        return {
            id: '',
            descripcion: this._tipo
        }
    }

    // Getter and Setter
    get tipo(): ELoadType {
        return this._tipo;
    }

    set tipo(value: ELoadType) {
        this._tipo = value;
    }
}