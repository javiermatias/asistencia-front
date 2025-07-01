import React from 'react';
import { Accion } from '../lib/definitions';

interface AccionesTableProps {
    acciones: Accion[];
}

const AccionesTable: React.FC<AccionesTableProps> = ({ acciones }) => {
    return (
        <table className="w-full border divide-y divide-gray-200">
            <thead>
                <tr>
                    <th className="px-4 py-2">Descripcion</th>
                    <th className="px-4 py-2">Responsable</th>
                    <th className="px-4 py-2">Fecha</th>
                    {/* Add more columns as needed */}
                </tr>
            </thead>
            <tbody>
                {acciones.map((accion) => (
                    <tr key={accion.id}>
                        <td className="px-4 py-2">{accion.descripcion}</td>
                        <td className="px-4 py-2">{accion.responsable}</td>
                        <td className="px-4 py-2">{accion.fecha}</td>
                        {/* Add more cells for other data */}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default AccionesTable;
