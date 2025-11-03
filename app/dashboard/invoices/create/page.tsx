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

THE REST DONE IN ACTIONS steps 2-6 

*/
