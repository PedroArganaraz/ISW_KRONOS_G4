export class TipoDeCarga {
    constructor(
        public descripcion: string
    ) { }

    static fromData(data: any): TipoDeCarga {
        return new TipoDeCarga(
            data.descripcion
        );
    }
}