import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

// 1. Define the DTO and the expected response types
interface RegistrarAsistenciaDto {
  qrToken: string;
  latitud: number;
  longitud: number;
}

// This can be the 'Asistencia' entity shape from your backend
interface AsistenciaResponse {
  id: number;
  fecha_ingreso: string;
  fecha_egreso: string | null;
  latitud: number;
  longitud: number;
  enRango: boolean;
}
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/asistencia/registrar`;
// 2. Define the function that performs the API call
const registrarAsistencia = async ({
    dto,
    token,
  }: {
    dto: RegistrarAsistenciaDto;
    token: string;
  }): Promise<AsistenciaResponse> => {
    const { data } = await axios.post(API_URL, dto, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  };
  
  // 2. Custom mutation hook
  export const useRegistrarAsistencia = () => {
    const queryClient = useQueryClient();
  
    return useMutation<
      AsistenciaResponse,
      AxiosError,
      { dto: RegistrarAsistenciaDto; token: string }
    >({
      mutationFn: registrarAsistencia,
      onSuccess: () => {
        // Refresh related queries if needed
        queryClient.invalidateQueries({ queryKey: ["asistencias"] });
      },
      onError: (error) => {
        console.error(
          "Error registrando asistencia:",
          error.response?.data || error.message
        );
      },
    });
  };