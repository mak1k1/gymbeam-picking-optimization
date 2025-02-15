# GymBeam Picking Optimization

A Node.js service that calculates optimal picking routes for warehouse products using 3D coordinates and TSP optimization.

## Prerequisites

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```bash
GYMBEAM_API_URL=<your-api-url>
GYMBEAM_API_KEY=<your-api-key>
```

## Usage

### Development
Run the service in development mode with hot-reload:
```bash
npm run dev
```

### Production
Build and start the service:
```bash
npm run build
npm start
```

## API Endpoints

### Calculate Shortest Path
`GET /`

Request body:
```json
{
  "products": ["product-id-1", "product-id-2"],
  "startingPosition": {
    "x": 0,
    "y": 0,
    "z": 0
  }
}
```

Response:
```json
{
  "distance": 100,
  "pickingOrder": [
    {
      "productId": "product-id-1",
      "positionId": "position-1"
    }
  ]
}
```

