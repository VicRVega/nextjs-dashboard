'use server';

import { z } from 'zod'; //step 4 validation
import { revalidatePath } from 'next/cache'; //step 6 revalidate
import { redirect } from 'next/navigation'; //step 6 redirect
import postgres from 'postgres'; //step 5 inserting in db 

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' }); //step 5

//step 4: create a schema to validate and parse the form data
const FormSchema = z.object({
    id: z.string(), 
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

//step 4 pass your rawFormData to CreateInvoice to validate the types:

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
    //step 4 store values in cents and create new dates 
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
      //step 5 create sql query to insert new invoice
      await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
    } catch (error) {
      //we'll also log the error to the console for now
      console.error(error);
      return {
        message: 'Database Error: Failed to Create Invoice.'
      };
    }

    revalidatePath('/dashboard/invoices'); //step 6
    redirect('/dashboard/invoices'); //step 6

}

//new action, updateInvoice
// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = Math.round(Number(amount) * 100);

try{
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
} catch (error) {
  //`
  console.error(error);
  return {
    message: 'Database Error: Failed to Update Invoice.'
  };
}
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

//new action deleteInvoice
export async function deleteInvoice(id: string) {
  throw new Error('Failed to Delete Invoice'); //added for testing error, remove later 

  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}
