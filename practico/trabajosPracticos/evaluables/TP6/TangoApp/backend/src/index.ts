import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import pedidosDeEnvioRoutes from './routes/PedidoDeEnvioRoutes'
import tiposDeCargaRoutes from './routes/TipoDeCargaRoutes'
import { enviarMailATransportistas } from './services/NotificacionServices';

const PORT = 8080;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(express.json());

wss.on('connection', (ws) => {
  console.log('A client has connected via WebSocket');
  
  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
  });
  
  ws.on('close', () => {
    console.log('A client has disconnected');
  });
});


// Registro de rutas
app.use(pedidosDeEnvioRoutes);
app.use(tiposDeCargaRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export { wss };