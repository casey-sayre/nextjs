// src/actions/guitars.ts
'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Guitar } from '@/types/Guitar';

import { mockGuitars } from '@/lib/mock-guitars'; // Make sure this is the mutable array

// --- Utility Functions (updated crypto.randomUUID for better UUID generation) ---
const generateUUID = () => crypto.randomUUID();
const slugify = (text: string) => text.toString().toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/[^\w-]+/g, '')
  .replace(/--+/g, '-')
  .replace(/^-+/, '')
  .replace(/-+$/, '');
// --- End Utility Functions ---

export async function addGuitar(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const stringsSize = formData.get('stringsSize') as string;
  const stringsLastChanged = formData.get('stringsLastChanged') as string;

  if (!name || !description || !stringsSize || !stringsLastChanged) {
    return { error: 'All fields are required.' };
  }

  // Generate a slug that is likely unique, perhaps by appending a short ID portion
  let uniqueSlug = slugify(name);
  if (mockGuitars.some(g => g.slug === uniqueSlug)) {
      uniqueSlug = `${uniqueSlug}-${generateUUID().substring(0, 5)}`; // Append unique part if slug exists
  }


  const newGuitar: Guitar = {
    id: generateUUID(), // Generate UUID for the new guitar
    name,
    description,
    slug: uniqueSlug, // Use the generated slug
    strings: {
      size: stringsSize,
      lastChanged: stringsLastChanged,
    },
  };

  console.log('Attempting to add new guitar (mock):', newGuitar);
  mockGuitars.push(newGuitar);

  revalidatePath('/guitars');
  revalidatePath(`/guitars/${newGuitar.slug}`); // Also revalidate the potential new detail page cache

  redirect(`/guitars/${newGuitar.slug}`);
}


export async function updateGuitar(formData: FormData) {
  const id = formData.get('id') as string;
  const originalSlug = formData.get('originalSlug') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const stringsSize = formData.get('stringsSize') as string;
  const stringsLastChanged = formData.get('stringsLastChanged') as string;

  if (!id || !originalSlug || !name || !description || !stringsSize || !stringsLastChanged) {
    console.error('Missing required fields for updating guitar.');
    return { error: 'All fields are required for update.' };
  }

  const guitarIndex = mockGuitars.findIndex(g => g.id === id);

  if (guitarIndex === -1) {
    console.error(`Guitar with ID ${id} not found for update.`);
    return { error: 'Guitar not found.' };
  }

  const updatedSlug = originalSlug; // For now, assume slug doesn't change on edit

  const updatedGuitar: Guitar = {
    ...mockGuitars[guitarIndex],
    id,
    name,
    description,
    slug: updatedSlug,
    strings: {
      size: stringsSize,
      lastChanged: stringsLastChanged,
    },
  };

  mockGuitars[guitarIndex] = updatedGuitar;
  console.log('Attempting to update guitar (mock):', updatedGuitar);

  revalidatePath('/guitars'); // Revalidate list page
  revalidatePath(`/guitars/${originalSlug}`); // Revalidate old detail page slug (if slug changed, this clears old cache)
  // if (originalSlug !== updatedSlug) {
      revalidatePath(`/guitars/${updatedSlug}`); // Revalidate new detail page slug if it changed
  // }


  redirect(`/guitars/${updatedSlug}`); // Redirect to the (potentially new) detail page slug
}