'use client'; //client component, means you can use event listeners and hooks
//<input> this is the search input 

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce'; //debouncing 

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const {replace} = useRouter();

//Ch11 Debouncing: This function will wrap the contents of handleSearch, and only run the code after a specific time once the user has stopped typing (300ms).
const handleSearch = useDebouncedCallback((term) => {
    //debouncing 
    console.log(`Searching... ${term}`);


    const params = new URLSearchParams(searchParams);
    if(term){
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
//Ch 10: 1. capture the user's input in a search box
/*
1. Create a new handleSearch function, 
2. and add an onChange listener to the <input> element. 
3. onChange will invoke handleSearch whenever the input value changes.
*/

//2. Update the URL with search params 
/*
1. Import the useSearchParams hook from next/navigation and assign it to a variable
2. Inside handleSearch, create a new URLSearchParams instance using your new searchParams variable.
3. URLSearchParams is a Web API that provides utility methods for manipulating the URL query parameters. 
Instead of creating a complex string literal, you can use it to get the params string like ?page=1&query=a.
Next, set the params string based on the user’s input. If the input is empty, you want to delete it

4. Now that you have the query string. You can use Next.js's useRouter and usePathname hooks to update the URL.
Import useRouter and usePathname from 'next/navigation', and use the replace method from useRouter() inside handleSearch:

Here's a breakdown of what's happening:

${pathname} is the current path, in your case, "/dashboard/invoices".
As the user types into the search bar, params.toString() translates this input into a URL-friendly format.
replace(${pathname}?${params.toString()}) updates the URL with the user's search data. For example, /dashboard/invoices?query=lee if the user searches for "Lee".
The URL is updated without reloading the page, thanks to Next.js's client-side navigation (which you learned about in the chapter on navigating between pages

*/

//3. Keep URL and input in sync
/*
To ensure the input field is in sync with the URL and will be populated when sharing, 
you can pass a defaultValue to input by reading from searchParams:

When you reload the page, the input field will still show.
*/

//4. Updating the Table 
/*
1. Finally, you need to update the table component to reflect the search query.
(Navigate back to the invoices page.)
2. Page components accept a prop called searchParams, so you can pass the current URL params to the <Table> component.
3. If you navigate to the <Table> Component, you'll see that the two props, 
query and currentPage, are passed to the fetchFilteredInvoices() function which returns the invoices that match the query.
4.With these changes in place, go ahead and test it out. If you search for a term, you'll update the URL, which will send a new request to the server, 
data will be fetched on the server, and only the invoices that match your query will be returned.
*/ 

//5. Debouncing
/* You're updating the URL on every keystroke, and therefore querying your database on every keystroke! This isn't a problem as our application is small, but imagine if your application had thousands of users, each sending a new request to your database on each keystroke.

Debouncing is a programming practice that limits the rate at which a function can fire. In our case, you only want to query the database when the user has stopped typing.

How Debouncing Works:

Trigger Event: When an event that should be debounced (like a keystroke in the search box) occurs, a timer starts.
Wait: If a new event occurs before the timer expires, the timer is reset.
Execution: If the timer reaches the end of its countdown, the debounced function is executed.
You can implement debouncing in a few ways, including manually creating your own debounce function. To keep things simple, we'll use a library called use-debounce.

Install use-debounce:

In your <Search> Component, import a function called useDebouncedCallback:

*/