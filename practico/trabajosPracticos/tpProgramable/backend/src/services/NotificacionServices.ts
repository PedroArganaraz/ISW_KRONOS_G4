import WebSocket from 'ws';
import { PedidoDeEnvio } from '../models/PedidoDeEnvio';
import { transportistasMockData } from '../mocks/TrasnportistaMockData'
import nodemailer from 'nodemailer';
import { createHTMLforMail } from '../mocks/htmlMock';
import fs from 'fs';
import path from 'path';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com ',
  port: 465,
  secure: true,
  auth: {
    user: 'testaccnoreply59@gmail.com',
    pass: 'ekcr jocw qzbf clru'
  }
});

export function enviarNotisPushATransportistas(title: string, message: string, wss: WebSocket.Server): void {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'notification', title, message }));
    }
  });
}

export async function enviarMailATransportistas(pedido: PedidoDeEnvio) {
  try {
    const transpostistasMails = transportistasMockData.map(transp => transp.email)
    const htmlContent = createHTMLforMail(pedido);

    const attachments = pedido.imagenes.map((imgPath, index) => ({
      filename: path.basename(imgPath),
      path: imgPath,
      cid: `imagen${index}@cid` // CID debe ser único
    }));


    const info = await transporter.sendMail({
      from: 'testaccnoreply59@gmail.com',
      to: transpostistasMails,
      subject: 'Nuevo pedido de envío disponible',
      html: htmlContent,
      attachments: attachments
    });

    pedido.imagenes.forEach(imgPath => {
      fs.unlink(imgPath, (err) => {});
    });

    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
