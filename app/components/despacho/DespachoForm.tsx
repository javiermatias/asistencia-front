"use client";

import { useState, useEffect, FormEvent } from 'react';

// Import the CSS module
import styles from './DespachoCrud.module.css';
import { Despacho } from '@/app/types/despacho';
import { useAddDespacho, useUpdateDespacho } from '@/app/hooks/despacho/useDespachos';

interface DespachoFormProps {
  initialData?: Despacho | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const DespachoForm = ({ initialData, onSuccess, onCancel }: DespachoFormProps) => {
  const [nombre, setNombre] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');

  const addDespachoMutation = useAddDespacho();
  const updateDespachoMutation = useUpdateDespacho();

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre_despacho);
      setLatitud(String(initialData.latitud));
      setLongitud(String(initialData.longitud));
    }
  }, [initialData]);

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
      <h2 className={styles.subtitle}>{initialData ? 'Edit Despacho' : 'Add Despacho'}</h2>
      
      {/* Display error message from the mutation */}
      {mutation.isError && (
        <div className={styles.errorText}>
          Error: {mutation.error.response?.data as string || mutation.error.message}
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="nombre_despacho">Despacho Name</label>
        <input
          id="nombre_despacho"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="latitud">Latitude</label>
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
        <label htmlFor="longitud">Longitude</label>
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
          {isLoading ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className={styles.button}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default DespachoForm;