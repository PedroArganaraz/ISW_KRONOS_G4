export class Domicilio{
    constructor(
        public calle: string,
        public numero: number,
        public localidad: string,
        public provincia: string,
        public referencia?: string
    ){}

    static fromData(data: any): Domicilio {
        return new Domicilio(
          data.calle,
          data.numero,
          data.localidad,
          data.provincia,
          data.referencia          
        );
      }
  }
