// htmlMock.ts
import { PedidoDeEnvio } from "../models/PedidoDeEnvio";

export function createHTMLforMail(pedido: PedidoDeEnvio) {

    let imgTags = pedido.imagenes.map((imgPath, index) => 
        `<img src="cid:imagen${index}@cid" alt="Imagen de pedido" />`
    ).join('<br>');
    

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES'); // Formato dd/mm/aaaa
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nuevo Pedido de Envío</title>
          <style>
              body {
                  font-family: Times New Roman, serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #f4f4f4;
              }
              .container {
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 5px;
                  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
              }
              h1 {
                  color: #0056b3;
                  text-align: center;
                  margin-bottom: 20px;
              }
              h2 {
                  color: #007bff;
                  border-bottom: 2px solid #007bff;
                  padding-bottom: 5px;
              }
              .info-section {
                  margin-bottom: 20px;
              }
              .info-item {
                  margin-bottom: 10px;
              }
              .imagen-container {
                  margin-bottom: 15px;
              }
                            .imagenes-container {
                  display: flex;
                  flex-wrap: nowrap;
                  overflow-x: auto;
              }
              .imagen {
                  max-width: auto;
                  height: auto;
                  margin-right: 10px;
                  border-radius: 5px;
                  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
              }
              .highlight {
                  background-color: #e6f3ff;
                  padding: 10px;
                  border-radius: 5px;
                  text-align: center;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>NUEVO PEDIDO DE ENVÍO</h1>
              <p class="highlight">Se ha registrado un nuevo pedido de envío que podría interesarle.</p>
  
              <div class="info-section">
                  <h2>Información de Retiro</h2>
                  <div class="info-item">
                      <strong>Fecha de retiro:</strong> ${formatDate(pedido.fechaRetiro)}
                  </div>
                  <div class="info-item">
                      <strong>Domicilio de retiro:</strong> ${pedido.domicilioRetiro.calle} ${pedido.domicilioRetiro.numero}, ${pedido.domicilioRetiro.localidad}, ${pedido.domicilioRetiro.provincia}
                  </div>
              </div>
  
              <div class="info-section">
                  <h2>Información de Entrega</h2>
                  <div class="info-item">
                      <strong>Fecha de entrega:</strong> ${formatDate(pedido.fechaEntrega)}
                  </div>
                  <div class="info-item">
                      <strong>Domicilio de entrega:</strong> ${pedido.domicilioEntrega.calle} ${pedido.domicilioEntrega.numero}, ${pedido.domicilioEntrega.localidad}, ${pedido.domicilioEntrega.provincia}
                  </div>
              </div>
  
              <div class="info-section">
                  <h2>Información adicional</h2>
                  <div class="info-item">
                      <strong>Tipo de carga:</strong> ${pedido.tipoDeCarga.descripcion}
                  </div>
                  <div class="info-item">
                      <strong>Observaciones:</strong> ${pedido.observaciones}
                  </div>
              </div>
  
              <div class="info-section">
                  <h2>Imágenes del pedido</h2>
                  <div class="imagenes-container">
                      ${imgTags}
                  </div>
              </div>
          </div>
      </body>
      </html>
    `;

    return htmlContent;
}
