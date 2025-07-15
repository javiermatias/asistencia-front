"use client";

import { useState } from 'react';

// Import the CSS module
import styles from './DespachoCrud.module.css';
import { Despacho } from '@/app/types/despacho';
import { useDeleteDespacho, useGetDespachos } from '@/app/hooks/despacho/useDespachos';
import DespachoForm from './DespachoForm';

export default function DespachoPage() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingDespacho, setEditingDespacho] = useState<Despacho | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const { data: despachos, isLoading, isError, error } = useGetDespachos();
  const deleteMutation = useDeleteDespacho();

  const handleAddClick = () => {
    setEditingDespacho(null);
    setIsFormVisible(true);
    setGlobalError(null); // Clear previous errors
  };

  const handleEditClick = (despacho: Despacho) => {
    setEditingDespacho(despacho);
    setIsFormVisible(true);
    setGlobalError(null); // Clear previous errors
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Are you sure you want to delete this despacho?')) {
      deleteMutation.mutate(id, {
        onError: (error) => {
          // Handle specific UI error for this action
          const errorMessage = error.response?.data as string || "An unknown error occurred.";
          setGlobalError(`Failed to delete despacho. Server says: ${errorMessage}`);
        },
        onSuccess: () => {
          setGlobalError(null); // Clear error on success
        }
      });
    }
  };

  const handleFormSuccess = () => {
    setIsFormVisible(false);
    setEditingDespacho(null);
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setEditingDespacho(null);
  };

  if (isLoading) return <div>Loading despachos...</div>;
  
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Despacho Management</h1>
      
      {/* Display global errors (like delete error) */}
      {globalError && <div className={styles.errorText}>{globalError}</div>}
      
      {/* Display fetch error */}
      {isError && <div className={styles.errorText}>Error loading data: {error.message}</div>}

      {!isFormVisible && (
        <button onClick={handleAddClick} className={`${styles.button} ${styles.buttonAdd}`}>
          Add New Despacho
        </button>
      )}

      {isFormVisible && (
        <DespachoForm
          initialData={editingDespacho}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      <div className={styles.listContainer}>
        <h2 className={styles.subtitle}>List of Despachos</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {despachos?.map((despacho) => (
              <tr key={despacho.id}>
                <td>{despacho.nombre_despacho}</td>
                <td>{despacho.latitud}</td>
                <td>{despacho.longitud}</td>
                <td className={styles.actionsCell}>
                  <button onClick={() => handleEditClick(despacho)} className={styles.button}>Edit</button>
                  <button 
                    onClick={() => handleDeleteClick(despacho.id)} 
                    className={`${styles.button} ${styles.buttonDelete}`}
                    disabled={deleteMutation.isPending && deleteMutation.variables === despacho.id}
                  >
                    {deleteMutation.isPending && deleteMutation.variables === despacho.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}