import { RequestHandler, Router } from 'express';
import { getAllProductPositions } from './services/api';
import { calculateShortestPath } from './calculateShortestPath';
import { CalculateShortestPathRequest } from './types';

const router = Router();

const handler: RequestHandler = async (req, res, next) => {
    try {
        const { products, startingPosition } = req.body as CalculateShortestPathRequest;

        if (!Array.isArray(products) || !products.length) {
            res.status(400).json({ error: 'Invalid products parameter' });
            return;
        }

        if (!startingPosition || isNaN(startingPosition.x) || isNaN(startingPosition.y) || isNaN(startingPosition.z)) {
            res.status(400).json({ error: 'Invalid starting position coordinates' });
            return;
        }
        
        const positions = await getAllProductPositions(products);
        const result = calculateShortestPath(positions, { products, startingPosition });
        
        res.json(result);
    } catch (error) {
        res.status(400).json({ 
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
}

router.get('/', handler);

export default router; 