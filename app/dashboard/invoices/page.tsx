import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data';
 
export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchInvoicesPages(query); //query from searchParams

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} /> {/* pass totalPages prop */}
      </div>
    </div>
  );
}

//Ch 11: starting code for adding search and pagination to invoices page
//4. Updating the Table 
//If you navigate to the <Table> Component, you'll see that the two props, query and currentPage, 
// are passed to the fetchFilteredInvoices() function which returns the invoices that match the query.

//With these changes in place, go ahead and test it out. If you search for a term, you'll update the URL, which will send a new request to the server, 
// data will be fetched on the server, and only the invoices that match your query will be returned.

//6. Pagination
// import a new function called fetchInvoicesPages and pass the query from searchParams as an argument:
//Next, pass the totalPages prop to the <Pagination/> component:
