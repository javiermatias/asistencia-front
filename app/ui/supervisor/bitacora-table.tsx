'use client'
import Image from 'next/image';
import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredInvoices } from '@/app/lib/data';
import { useQuery } from '@tanstack/react-query';
import { Bitacora } from '@/app/lib/definitions';

export default function BitacoraTable({
  currentPage,
}: {
  currentPage: number;
}) {
  //console.log(currentPage);

  const { isPending, error, data,isSuccess } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch(`/api?page=${currentPage}`).then((res) =>
        res.json(),
      ),
  })
  if (isPending) return 'Loading...'

  if (error) return 'Ocurrio un error al cargar las bitacoras: ' + error.message

 

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">

          <table className="min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Asunto
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Nombre Colaborador
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Fecha
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Nombre Despacho
                </th>
                <th scope="col" className="px-3 font-medium whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex justify-end gap-3">Ver Bitacora</div>
                  
                </th>
           
              </tr>
            </thead>
            <tbody className="bg-white">
              {data?.result?.map((bitacora:Bitacora) => (
                <tr
                  key={bitacora.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
            
                  <td className="whitespace-nowrap px-3 py-3">
                    {bitacora.asunto}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {bitacora.nombre}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(bitacora.fecha)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {bitacora.nombre_despacho}
                  </td>
           <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateInvoice id={bitacora.id.toString()} />
                      
                    </div>
                  </td> 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}