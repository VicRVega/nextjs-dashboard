import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data'; 
import { notFound } from 'next/navigation'; //ch 13

  
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]); 

  if(!invoice) {
    notFound(); //ch 13
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}

//Ch12 UPDATE 
/*
1. create a Dynamic Route Segment with the invoice id 
In your /invoices folder, create a new dynamic route called [id], 
then a new route called edit with a page.tsx file. Your file structure should look like this:

In your <Table> component, notice there's a <UpdateInvoice /> button that receives the invoice's id from the table records.

Navigate to your <UpdateInvoice /> component, and update the href of the Link to accept the id prop. 
You can use template literals to link to a dynamic route segment:

2. Read the invoice id from page params 
Back on your <Page> component, paste the following code:

In addition to searchParams, page components also accept a prop called params which you can use to access the id. 
Update your <Page> component to receive the prop:

3. Fetch the specific invoice 
Import a new function called fetchInvoiceById and pass the id as an argument.
Import fetchCustomers to fetch the customer names for the dropdown.
You can use Promise.all to fetch both the invoice and customers in parallel:
UUIDs vs. Auto-incrementing Keys

We use UUIDs instead of incrementing keys (e.g., 1, 2, 3, etc.). This makes the URL longer; however, UUIDs eliminate the risk of ID collision, are globally unique, and reduce the risk of enumeration attacks - making them ideal for large databases.

However, if you prefer cleaner URLs, you might prefer to use auto-incrementing keys.

4. Pass the id to the Server Action 
Lastly, you want to pass the id to the Server Action so you can update the right record in your database. 
you can pass id to the Server Action using JS bind. This will ensure that any values passed to the Server Action are encoded.
Then, in your actions.ts file, create a new action, updateInvoice:
*/