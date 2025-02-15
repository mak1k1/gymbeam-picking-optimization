export type Point3D = {
    x: number;
    y: number;
    z: number;
};

export type Position = Point3D & {
    positionId: string;
    productId: string;
    quantity: number;
};

export type CalculateShortestPathInput = {
    products: string[];
    startingPosition: Point3D;
};

export type PickingStep = {
    productId: string;
    positionId: string;
};

export type CalculateShortestPathResponse = {
    distance: number;
    pickingOrder: PickingStep[];
};

export type CalculateShortestPathRequest = {
    products: string[];
    startingPosition: Point3D;
};