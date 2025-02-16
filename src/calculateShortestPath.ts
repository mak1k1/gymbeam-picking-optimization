import { Point3D, Position, CalculateShortestPathInput, CalculateShortestPathResponse } from "./types";

const calculate3DEuclideanDistance = (pos1: Point3D, pos2: Point3D): number => {
    return Math.sqrt(
        Math.pow(pos2.x - pos1.x, 2) +
        Math.pow(pos2.y - pos1.y, 2) +
        Math.pow(pos2.z - pos1.z, 2)
    );
};

export const calculateShortestPath = (positions: Position[], input: CalculateShortestPathInput): CalculateShortestPathResponse => {
    if (!input.products?.length || !input.startingPosition) {
        return { distance: 0, pickingOrder: [] };
    }

    if (!positions.length) {
        throw new Error('No positions provided');
    }

    const selectedPositions = input.products.map(productId => {
        const productPositions = positions.filter(p => p.productId === productId && p.quantity > 0);
        if (!productPositions.length) {
            throw new Error(`No positions found with available quantity for product ${productId}`);
        }
        
        return productPositions.reduce((nearest, current) => {
            const nearestDist = calculate3DEuclideanDistance(input.startingPosition, nearest);
            const currentDist = calculate3DEuclideanDistance(input.startingPosition, current);
            return currentDist < nearestDist ? current : nearest;
        });
    });

    const locations = [input.startingPosition, ...selectedPositions];
    const distanceMatrix = locations.map(from =>
        locations.map(to => calculate3DEuclideanDistance(from, to))
    );

    const path = solveTSP(distanceMatrix);
    
    return {
        distance: Math.round(path.totalDistance),
        pickingOrder: path.order.slice(1).map(idx => ({
            productId: selectedPositions[idx - 1].productId,
            positionId: selectedPositions[idx - 1].positionId
        }))
    };
};

const solveTSP = (matrix: number[][]) => {
    const n = matrix.length;
    const visited = new Set<number>();
    let order: number[] = [];
    let totalDistance = 0;
    let current = 0;

    visited.add(current);
    order.push(current);

    while (visited.size < n) {
        let nearest = -1;
        let minDist = Infinity;

        for (let next = 1; next < n; next++) {
            if (!visited.has(next) && matrix[current][next] < minDist) {
                nearest = next;
                minDist = matrix[current][next];
            }
        }

        if (nearest !== -1) {
            visited.add(nearest);
            order.push(nearest);
            totalDistance += minDist;
            current = nearest;
        }
    }

    return optimizeTSP(order, matrix);
};

const optimizeTSP = (order: number[], matrix: number[][]) => {
    let totalDistance = calculateTotalDistance(order, matrix);
    let improved = true;

    while (improved) {
        improved = false;
        for (let i = 1; i < order.length - 1; i++) {
            for (let j = i + 1; j < order.length; j++) {
                const newOrder = [...order];
                [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];

                const newDistance = calculateTotalDistance(newOrder, matrix);
                if (newDistance < totalDistance) {
                    order = newOrder;
                    totalDistance = newDistance;
                    improved = true;
                }
            }
        }
    }

    return { order, totalDistance };
};

const calculateTotalDistance = (order: number[], matrix: number[][]) => {
    let total = 0;
    for (let i = 0; i < order.length - 1; i++) {
        total += matrix[order[i]][order[i + 1]];
    }
    return total;
};
