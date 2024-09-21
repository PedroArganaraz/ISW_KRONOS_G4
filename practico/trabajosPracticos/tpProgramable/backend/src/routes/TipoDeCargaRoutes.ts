import { Router, Request, Response } from 'express';
import { tipoDeCargaMockData } from '../mocks/TipoDeCargaMockData';

const router = Router();

router.get('/tipos-de-carga', (req: Request, res: Response) => {
  res.json(tipoDeCargaMockData);
});

export default router;
