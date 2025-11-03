'use client'; //needs to be a Client Component.
 
import { useEffect } from 'react';
 
//acepts two props (error, reset)
export default function Error({
  error, //object is an instance of JavaScript's native Error object.
  reset, //function to reset the error boundary.
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);
 
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}

//option 1: Handling Errors with error.tsx
//While error.tsx is useful for catching uncaught exceptions, 


//option2: Handling 404 erros with the nonFound function
// notFound can be used when you try to fetch a resource that doesn't exist.