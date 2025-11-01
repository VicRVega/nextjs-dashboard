import DashboardSkeleton from '@/app/ui/skeletons';
//found in /app/ui/skeletons.tsx

//Since loading.tsx is a level higher than /invoices/page.tsx and /customers/page.tsx, its also applied to those pages when they are loading.
//We can change this with Route Groups
//Create a new folder called /(overview) inside the dashboard folder. 
// Then, move your loading.tsx and page.tsx files inside the folder:

export default function Loading() {
  return <DashboardSkeleton />;
}