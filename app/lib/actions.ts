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

    //step 5 create sql query to insert the new invoice into the database
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

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
 
  const amountInCents = amount * 100;
 
  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


//Ch 12 CREATING an Invoice 
/* 
1. done in page.tsx and create-form.tsx

2. Create a Server Action to handle form submission
Great, now let's create a Server Action that is going to be called when the form is submitted.

Navigate to your lib/ directory and create a new file named actions.ts. At the top of this file, add the React use server directive:
In your actions.ts file, create a new async function that accepts formData:
Then, in your <Form> component, import the createInvoice from your actions.ts file. Add a action attribute to the <form> element, and call the createInvoice action.

3. Extract data from formData
Back in your actions.ts file, you'll need to extract the values of formData, there are a couple of methods you can use. For this example, let's use the .get(name) method.

4. Validate form data with Zod
Before sending the form data to your database, you want to ensure it's in the correct format and with the correct types. 
You'll notice that amount is of type string and not number. This is because input elements with type="number" actually return a string, not a number!

The amount field is specifically set to coerce (change) from a string to a number while also validating its type.

You can then pass your rawFormData to CreateInvoice to validate the types:

Let's convert the amount into cents:

new date with the format "YYYY-MM-DD"

5. Inserting data into your database 
create query and insert the new invoice into the database
Right now, we're not handling any errors. We'll talk about this in the next chapter. For now, let's move on to the next step.

6. Revalidate and redirect
you want to clear this cache and trigger a new request to the server. 
You can do this with the revalidatePath function from Next.js:

Once the database has been updated, the /dashboard/invoices path will be revalidated, and fresh data will be fetched from the server.

At this point, you also want to redirect the user back to the /dashboard/invoices page. You can do this with the redirect function from Next.js:


*/