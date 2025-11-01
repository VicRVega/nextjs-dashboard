//Fetch data for the dashboard overview page , from data.ts???
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react'; //ch 9 
import { RevenueChartSkeleton } from '@/app/ui/skeletons'; //ch 9 

//1. To fetch data for the <RevenueChart/> component, import the fetchRevenue function from data.ts and call it inside your component:
//2. To fetch data for the <LatestInvoices/> component, import the fetchLatestInvoices function from data.ts
import { fetchLatestInvoices, fetchCardData } from '@/app/lib/data'; //ch 9: remove fetchRevenue

export default async function Page() {
    //const revenue = await fetchRevenue(); remove in ch 9 for component streming 

    const latestInvoices = await fetchLatestInvoices(); // wait for fetchRevenue() to finish
    const { numberOfInvoices, numberOfCustomers, totalPaidInvoices, totalPendingInvoices } = await fetchCardData(); // wait for fetchLatestInvoices() to finish

  return (
    <main>
        <h1 className = {`${lusitana.className} mb-4 text-xl md:text-2xl`}>Dashboard</h1>
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            <Card title="Collected" value={totalPaidInvoices} type="collected" />
            <Card title="Pending" value={totalPendingInvoices} type="pending" />
            <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
            <Card
                title="Total Customers"
                value={numberOfCustomers}
                type="customers"
            />
        </div>
        <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8'>
            {/* modified for ch 9: wrap RevenueChart in Suspense for component streaming */}
            <Suspense fallback={<RevenueChartSkeleton />}>
                <RevenueChart  />
            </Suspense>
            <LatestInvoices latestInvoices={latestInvoices} />
        </div>
    </main>
  );
}

//The code above is intentionally commented out. We will now begin to example each piece.


//However... there are two things you need to be aware of:
    //1. The data requests are unintentionally blocking each other, creating a request waterfall.
    //2. By default, Next.js prerenders routes to improve performance, this is called Static Rendering. So if your data changes, it won't be reflected in your dashboard.
    //Let's discuss number 1 in this chapter, then look into detail at number 2 in the next chapter(ch 8).

//1. Waterfall: 
/*For example, we need to wait for fetchRevenue() to execute before fetchLatestInvoices() can start running, and so on.
This pattern is not necessarily bad. 
There may be cases where you want waterfalls because you want a condition to be satisfied before you make the next request. 
For example, you might want to fetch a user's ID and profile information first. 
Once you have the ID, you might then proceed to fetch their list of friends. 
In this case, each request is contingent on the data returned from the previous request.
However, this behavior can also be unintentional and impact performance.*/