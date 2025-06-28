// src/app/page.tsx

'use client'; // <-- IMPORTANT: This directive makes this a Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Hook for navigation in App Router

export default function HomePage() {
  const [slugInput, setSlugInput] = useState('');
  const router = useRouter(); // Initialize the router

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSlugInput(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    if (slugInput.trim()) { // Ensure the input is not empty
      router.push(`/details/${slugInput.trim()}`); // Navigate to the dynamic route
    }
  };

  return (
    <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome to the Main App Page</h1>
      <p>Enter a slug to view details:</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={slugInput}
          onChange={handleInputChange}
          placeholder="e.g., product-123"
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          style={{
            padding: '8px 15px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Go to Details
        </button>
      </form>

      <p>
        <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer">
          Next.js Docs
        </a>
      </p>
    </main>
  );
}