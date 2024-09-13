import express, {Express, Request, Response} from "express";
const app = express();
const port = 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello my lil bro!');
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});