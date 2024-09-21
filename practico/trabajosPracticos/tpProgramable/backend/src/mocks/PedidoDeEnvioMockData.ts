import { PedidoDeEnvio } from "../models/PedidoDeEnvio";

const pedidosDeEnvioMockData: PedidoDeEnvio[] = [];

export function addPedidoDeEnvio(pedidoDeEnvio: PedidoDeEnvio) {
  pedidosDeEnvioMockData.push(pedidoDeEnvio);
}

export function getAllPedidosDeEnvio() {
  return pedidosDeEnvioMockData;
}
