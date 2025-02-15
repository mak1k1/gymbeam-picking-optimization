import axios from 'axios'
import { Position } from '../types'

if (!process.env.GYMBEAM_API_URL) {
  throw new Error('GYMBEAM_API_URL environment variable is not set')
}

const api = axios.create({
  baseURL: process.env.GYMBEAM_API_URL.replace(/\/$/, ''),
  headers: {
    'x-api-key': process.env.GYMBEAM_API_KEY
  },
  timeout: 5000
})

export const getProductPositions = async (productId: string): Promise<Position[]> => {
  try {
    const response = await api.get<Position[]>(`/products/${productId}/positions`)
    return response.data || []
  } catch (error) {
    throw new Error(`Failed to fetch positions for product ${productId}, error: ${error}`)
  }
}

export const getAllProductPositions = async (productIds: string[]): Promise<Position[]> => {
  try {
    const uniqueIds = [...new Set(productIds)]
    const results = await Promise.all(uniqueIds.map((id) => getProductPositions(id)))
    return results.flat()
  } catch (error) {
    throw new Error(`Failed to fetch product positions, error: ${error}`)
  }
}
