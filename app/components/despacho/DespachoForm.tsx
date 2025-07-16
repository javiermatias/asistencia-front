import styles from './DespachoCrud.module.css';
import { Despacho } from '@/app/types/despacho';
import { useAddDespacho, useUpdateDespacho } from '@/app/hooks/despacho/useDespachos';
import { FormEvent, useEffect, useState } from 'react';

interface DespachoFormProps {
  initialData?: Despacho | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const DespachoForm = ({ initialData, onSuccess, onCancel }: DespachoFormProps) => {
  const [nombre, setNombre] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [geoError, setGeoError] = useState<string | null>(null);

  const addDespachoMutation = useAddDespacho();
  const updateDespachoMutation = useUpdateDespacho();

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre_despacho);
      setLatitud(String(initialData.latitud));
      setLongitud(String(initialData.longitud));
    }
  }, [initialData]);

  const handleGetCoordinates = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitud(position.coords.latitude.toFixed(6));
        setLongitud(position.coords.longitude.toFixed(6));
        setGeoError(null);
      },
      (error) => {
        setGeoError('Unable to retrieve your location.');
        console.error(error);
      }
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const despachoData = {
      nombre_despacho: nombre,
      latitud: parseFloat(latitud),
      longitud: parseFloat(longitud),
    };

    if (initialData) {
      updateDespachoMutation.mutate(
        { id: initialData.id, ...despachoData },
        { onSuccess }
      );
    } else {
      addDespachoMutation.mutate(despachoData, { onSuccess });
    }
  };

  const mutation = initialData ? updateDespachoMutation : addDespachoMutation;
  const isLoading = mutation.isPending;

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2 className={styles.subtitle}>{initialData ? 'Editar Despacho' : 'Agregar despacho'}</h2>

      {mutation.isError && (
        <div className={styles.errorText}>
          Error: {mutation.error.response?.data as string || mutation.error.message}
        </div>
      )}

      {geoError && <div className={styles.errorText}>⚠️ {geoError}</div>}

      <div className={styles.formGroup}>
        <label htmlFor="nombre_despacho">Nombre Despacho</label>
        <input
          id="nombre_despacho"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="latitud">Latitud</label>
        <input
          id="latitud"
          type="number"
          step="any"
          value={latitud}
          onChange={(e) => setLatitud(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="longitud">Longitud</label>
        <input
          id="longitud"
          type="number"
          step="any"
          value={longitud}
          onChange={(e) => setLongitud(e.target.value)}
          required
        />
      </div>

      <div className={styles.formActions}>
        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? 'Guardando...' : 'Guardar'}
        </button>
        <button type="button" onClick={onCancel} className={styles.button}>
          Cancelar
        </button>
        <button type="button" onClick={handleGetCoordinates} className={`${styles.button} ${styles.getCoordinatesButton}`}>
          Obtener Coordenadas
        </button>
      </div>
    </form>
  );
};

export default DespachoForm;