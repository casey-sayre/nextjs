import Link from 'next/link';

interface DetailsPageProps {
  params: {
    slug: string; // The dynamic segment from the URL, e.g., 'item-id'
  };
  searchParams: { [key: string]: string | string[] | undefined }; // For query parameters
}

export default async function DetailsPage({ params }: DetailsPageProps) {
  const { slug } = await params;

  // You can now use the 'slug' to fetch the specific item's data
  // This component will be a Server Component by default, so you can directly fetch data:
  // const item = await fetch(`https://api.example.com/items/${slug}`).then(res => res.json());

  return (
    <div>
      <h1>Details for: {slug}</h1>
      <div style={{ marginTop: '30px' }}>
        <Link href="/" style={{ color: '#0070f3', textDecoration: 'underline' }}>
          Go back to Home
        </Link>
      </div>
    </div>
  );
}