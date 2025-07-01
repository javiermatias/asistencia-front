import 'react-toastify/dist/ReactToastify.css'

interface Props {
    title: string
    onRemove: () => void;

}

export default function Badge({ title, onRemove }: Props) {
    return (
        <>
            {/*        <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-3 py-1 rounded dark:bg-blue-900 dark:text-blue-300">
                {title}
                <span className="cursor-pointer ml-1 text-red-500 hover:text-red-700" onClick={() => alert("hola")}>X</span>
            </span> */}

            <span id="badge-dismiss-default" className="inline-flex items-center px-2 py-1 me-2 mt-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300">
                {title}
                <button onClick={() => onRemove()} type="button" className="inline-flex items-center p-1 ms-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300" data-dismiss-target="#badge-dismiss-default" aria-label="Remove">
                    <svg className="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span className="sr-only">Eliminar</span>
                </button>
            </span>
        </>
    )
}