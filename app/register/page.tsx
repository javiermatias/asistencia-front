'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { registerUser } from '../lib/actions';
import { useFormStatus } from 'react-dom';
import { useFormState } from 'react-dom';
import { EMPTY_FORM_STATE } from '../lib/definitions';
type SubmitButtonProps = {
    label: string;
    loading: React.ReactNode;
};
const SubmitButton = ({ label, loading }: SubmitButtonProps) => {
    const { pending } = useFormStatus();

    return (
        <button className="w-full bg-blue-700 text-white text-sm font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300"
            disabled={pending} type="submit">
            {pending ? loading : label}
        </button>
    );
};


export default function RegisterForm() {
    const initialState = { message: null, errors: {} };

    const [formState, action] = useFormState(registerUser, EMPTY_FORM_STATE);
    // const [state, dispatch] = useFormState(registerUser, initialState);

    /*  const {
         register,
         handleSubmit,
         formState: { errors },
         getValues
     } = useForm() */
    //const [loading, setLoading] = useState(false)
    const { pending } = useFormStatus();
    const [showPassword, setShowPassword] = useState(false);
    /*     export type User = {
            id: string;
            name: string; //nombreColaborador
            email: string;
            password: string;
            role: string;
            numeroEmpleado: string;
            posicion: string; //posicionColaborador;
            proyecto: string; //proyectoPerteneces
          }; */

    const onSubmit = async (data: any) => {




        // To set the incidencia object
        /*      setLoading(true)
             setIncidencia({
               ...incidencia,
               nombre: getValues('nombre'),
               email: getValues('email'),
               legajo: getValues('legajo'),
               celular: getValues('celular'),
               direccion: getValues('direccion') 
             }) */
        //router.push('/empleado/noEnfermedad')

    }
    //registerUser(formData: FormData)
    return (
        <>

            <div className="container mx-auto py-8">
                <form action={action} className="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md">

                    <h2 className="text-2xl mb-6 text-center text-gray-400">Registro Usuario</h2>


                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Nombre y apellido
                        </label>
                        <input

                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                            type="text"
                            id="nombre"
                            name="nombre"
                            placeholder="Juan Perez"
                        />
                        <span className="text-xs text-red-400">
                            {formState.fieldErrors['nombre']?.[0]}
                        </span>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input

                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                            type="email"
                            id="email"
                            name="email"
                            placeholder="juan@ejemplo.com"
                        />
                        <span className="text-xs text-red-400">
                            {formState.fieldErrors['email']?.[0]}
                        </span>

                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-md focus-within:border-blue-500">
                            <input

                                className="w-full px-3 py-2 focus:outline-none"
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder=""
                            />
                            <span className="text-xs text-red-400">
                                {formState.fieldErrors['password']?.[0]}
                            </span>

                            <button
                                type="button"
                                className="px-3 py-2 focus:outline-none"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numero">
                            Numero Empleado
                        </label>
                        <input

                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                            type="text"
                            id="numero"
                            name="numero"
                            placeholder="101..."
                        />
                        <span className="text-xs text-red-400">
                            {formState.fieldErrors['numero']?.[0]}
                        </span>

                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="posicion">
                            Posición
                        </label>
                        <input

                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                            type="text"
                            id="posicion"
                            name="posicion"
                            placeholder="Posición Colaborador"
                        />
                        <span className="text-xs text-red-400">
                            {formState.fieldErrors['posicion']?.[0]}
                        </span>

                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="proyecto">
                            Proyecto
                        </label>
                        <input

                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                            type="text"
                            id="proyecto"
                            name="proyecto"
                            placeholder="Proyecto al que perteneces"
                        />
                        <span className="text-xs text-red-400">
                            {formState.fieldErrors['proyecto']?.[0]}
                        </span>
                    </div>

                    <SubmitButton label="Registrar Usuario" loading="Registrando..." />
                    <span className="font-bold">{formState.message}</span>

                </form>
            </div>

        </>
    );
}


