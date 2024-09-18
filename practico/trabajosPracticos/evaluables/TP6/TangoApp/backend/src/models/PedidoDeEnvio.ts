import { Domicilio } from "./Domicilio";
import { TipoDeCarga } from "./TipoDeCarga";

export class PedidoDeEnvio {
    constructor(
      public fechaRetiro: string,
      public fechaEntrega: string,
      public imagenes: string[],
      public observaciones: string,
      public domicilioEntrega: Domicilio,
      public domicilioRetiro: Domicilio,
      public tipoDeCarga: TipoDeCarga
    ) {}
  
    static fromData(data: any): PedidoDeEnvio {
      return new PedidoDeEnvio(
        data.fechaRetiro,
        data.fechaEntrega,
        data.imagenes,
        data.observaciones,
        Domicilio.fromData(data.domicilioEntrega),
        Domicilio.fromData(data.domicilioRetiro),
        TipoDeCarga.fromData(data.tipoDeCarga)
      );
    }
}