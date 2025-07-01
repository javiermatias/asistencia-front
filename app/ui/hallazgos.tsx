import React from 'react';


interface AccionesTableProps {
    hallazgos: String[];
    onRemove: (name: String) => void;
}

const HallazgosTable: React.FC<AccionesTableProps> = ({ hallazgos, onRemove }) => {
    return (
        <table className="w-full border divide-y divide-gray-200">
            <thead>
                <tr>
                    <th className="px-6 py-2">Nombre</th>

                </tr>
            </thead>
            <tbody>
                {hallazgos.map((hallazgo, index) => (
                    <tr key={index}>
                        <td className="px-4 py-2">{hallazgo}</td>
                        <td>
                            <button onClick={() => onRemove(hallazgo)} type="button" className="inline-flex items-center p-1 ms-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300" data-dismiss-target="#badge-dismiss-default" aria-label="Remove">
                                <svg className="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Eliminar</span>
                            </button>
                        </td>

                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default HallazgosTable;