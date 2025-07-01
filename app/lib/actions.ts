'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ZodError, z } from 'zod';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { FormState, User } from './definitions';



export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

/* type FormState = {
    message: string;
}; */


const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

// Define the schema
const createRegisterSchema = z.object({
    nombre: z.string().min(1, 'Nombre es requirido'),
    email: z.string().email('Ingrese un email valido'),
    password: z.string().min(6, 'Contraseña tiene que ser de al menos 6 caracteres'),
    numero: z.string().min(1, 'Numero de empleado es requerido'),
    posicion: z.string().min(1, 'Posicion es requerida'),
    proyecto: z.string().min(1, 'Projecto es requerido'),
});
export async function registerUser(formState: FormState,
    formData: FormData) {
    try {
        const { nombre, email, password, numero, posicion, proyecto } = createRegisterSchema.parse({
            nombre: formData.get('nombre')?.toString(),
            email: formData.get('email')?.toString(),
            password: formData.get('password')?.toString(),
            numero: formData.get('numero')?.toString(),
            posicion: formData.get('posicion')?.toString(),
            proyecto: formData.get('proyecto')?.toString(),
        });
        await sql`
        INSERT INTO users (
          nombre, 
          email, 
          password, 
          role, 
          numero, 
          posicion, 
          proyecto
        ) VALUES (
          ${nombre}, 
          ${email}, 
          ${password},
          ${'AGENTE'}, 
          ${numero}, 
          ${posicion}, 
          ${proyecto}
        )
      `;

    } catch (error) {
        return fromErrorToFormState(error);
    }



    redirect('/login');

}


export async function createInvoice(prevState: State, formData: FormData) {
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    // Insert data into the database
    try {
        await sql`
          INSERT INTO invoices (customer_id, amount, status, date)
          VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
        // If a database error occurs, return a more specific error.
        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }

    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}
// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// ...

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100;

    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {

    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Credenciales Invalidas';
                default:
                    return 'Oops! Algo salio mal';
            }
        }
        throw error;
    }
}

export const fromErrorToFormState = (error: unknown) => {
    if (error instanceof ZodError) {
        return {
            status: 'ERROR' as const,
            message: '',
            fieldErrors: error.flatten().fieldErrors,
            timestamp: Date.now(),
        };
    } else if (error instanceof Error) {
        return {
            status: 'ERROR' as const,
            message: error.message,
            fieldErrors: {},
            timestamp: Date.now(),
        };
    } else {
        return {
            status: 'ERROR' as const,
            message: 'Error desconocido',
            fieldErrors: {},
            timestamp: Date.now(),
        };
    }
};

export const toFormState = (
    status: FormState['status'],
    message: string
): FormState => {
    return {
        status,
        message,
        fieldErrors: {},
        timestamp: Date.now(),
    };
};

