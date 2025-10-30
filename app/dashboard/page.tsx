//Fetch data for the dashboard overview page , from data.ts???
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';

//To fetch data for the <RevenueChart/> component, import the fetchRevenue function from data.ts and call it inside your component:
import { fetchRevenue } from '@/app/lib/data';

export default async function Page() {
    const revenue = await fetchRevenue();
  return (
    <main>
        <h1 className = {`${lusitana.className} mb-4 text-xl md:text-2xl`}>Dashboard</h1>
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {/* <Card title="Collected" value={totalPaidInvoices} type="collected" /> */}
            {/* <Card title="Pending" value={totalPendingInvoices} type="pending" /> */}
            {/* <Card title="Total Invoices" value={numberOfInvoices} type="invoices" /> */}
            {/* <Card
                title="Total Customers"
                value={numberOfCustomers}
                type="customers"
            /> */}
        </div>
        <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8'>
            <RevenueChart revenue={revenue}  />
            {/* <LatestInvoices latestInvoices={latestInvoices} /> */}
        </div>
    </main>
  );
}

//The code above is intentionally commented out. We will now begin to example each piece.