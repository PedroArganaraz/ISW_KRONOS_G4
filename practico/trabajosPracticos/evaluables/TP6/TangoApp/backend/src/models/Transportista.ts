export class Transportista {
    constructor(
        public email: string
    ) { }

    static fromData(data: any): Transportista {
        return new Transportista(
            data.email
        );
    }
}
