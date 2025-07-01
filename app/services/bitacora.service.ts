import axios from 'axios'
import { Bitacora } from '../lib/definitions'
export async function createBitacora(bitacora: Bitacora) {
    try {
        // incidencia.idUser = idUser
        const response = await axios.post(
            '/api',
            bitacora
        )

        // Check if the response status code is within the 2xx range to ensure success.
        if (response.status >= 200 && response.status < 300) {
            return response.data // Return the data from the response.
        } else {
            throw new Error(`Request failed with status ${response.status}`)
        }
    } catch (error) {
        // Handle any errors, e.g., network issues, API errors, etc.
        console.error('Error creating post:', error)
        throw error // Re-throw the error for higher-level error handling.
    }
}