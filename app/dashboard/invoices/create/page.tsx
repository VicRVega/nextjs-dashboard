import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
 
export default async function Page() {
  const customers = await fetchCustomers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}

//Ch 12 Creating an Invoice 

/*
// 1. Create new Route and Form 
Your page is a Server Component that fetches customers and passes it to the <Form> component. 
To save time, we've already created the <Form> component for you located in app/ui/invoices/create-form.tsx. 

Navigate to the <Form> component, and you'll see that the form:

Has one <select> (dropdown) element with a list of customers.
Has one <input> element for the amount with type="number".
Has two <input> elements for the status with type="radio".
Has one button with type="submit".

2. Create a Server Action to handle form submission
Great, now let's create a Server Action that is going to be called when the form is submitted.

Navigate to your lib/ directory and create a new file named actions.ts. At the top of this file, add the React use server directive:
In your actions.ts file, create a new async function that accepts formData:
Then, in your <Form> component, import the createInvoice from your actions.ts file. Add a action attribute to the <form> element, and call the createInvoice action.

3. Extract data from formData
Back in your actions.ts file, you'll need to extract the values of formData, there are a couple of methods you can use. For this example, let's use the .get(name) method.

*/
