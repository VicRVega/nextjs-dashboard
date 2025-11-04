'use server';

import { z } from 'zod'; //step 4 validation
import { revalidatePath } from 'next/cache'; //step 6 revalidate
import { redirect } from 'next/navigation'; //step 6 redirect
import postgres from 'postgres'; //step 5 inserting in db 

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' }); //step 5

//Ch 12: step 4: create a schema to validate and parse the form data
//Ch 14:  use Zod to validate form data. Update your FormSchema
const FormSchema = z.object({
    id: z.string(), 
    customerId: z.string({
        invalid_type_error: 'Please select a customer.', //Ch 14: Server-Side Validation 
    }),
    amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }), //ch14
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.', //ch 14

    }),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

//ch 14
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

//Ch 12: step 4 pass your rawFormData to CreateInvoice to validate the types:
export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form fields using Zod
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
      //we'll also log the error to the console for now
      //console.error(error);
      return {
        message: 'Database Error: Failed to Create Invoice.'
      };
    }
    
    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/dashboard/invoices'); 
    redirect('/dashboard/invoices'); 

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

//Ch 12 new action deleteInvoice
export async function deleteInvoice(id: string) {

  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}

//CH14 ServerSide Validation 
/*
customerId - Zod already throws an error if the customer field is empty as it expects a type string. But let's add a friendly message if the user doesn't select a customer.
amount - Since you are coercing the amount type from string to number, it'll default to zero if the string is empty. Let's tell Zod we always want the amount greater than 0 with the .gt() function.
status - Zod already throws an error if the status field is empty as it expects "pending" or "paid". Let's also add a friendly message if the user doesn't select a status.

Next, update your createInvoice action to accept two parameters - prevState and formData:

formData - same as before.
prevState - contains the state passed from the useActionState hook. You won't be using it in the action in this example, but it's a required prop.
Then, change the Zod parse() function to safeParse():

safeParse() will return an object containing either a success or error field. This will help handle validation more gracefully without having put this logic inside the try/catch block.

Before sending the information to your database, check if the form fields were validated correctly with a conditional:
*/
