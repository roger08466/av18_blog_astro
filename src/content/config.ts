import { defineCollection, z } from 'astro:content';

// Helper function to safely parse JSON-like string arrays (e.g., "['tag1', 'tag2']")
// or simple comma-separated strings into an array.
// You might need to adjust this based on the actual format in your DB.
const parseStringArray = z.string().transform((str: string) => { // Add type for str
  if (!str) return [];
  try {
    // Attempt to parse as JSON array
    const parsed = JSON.parse(str.replace(/'/g, '"')); // Replace single quotes for valid JSON
    if (Array.isArray(parsed)) {
      return parsed.map(item => String(item)); // Ensure items are strings
    }
  } catch (e) {
    // Fallback for comma-separated or other formats
    return str.split(/[,、]/).map((s: string) => s.trim()).filter(Boolean); // Add type for s
  }
  return []; // Return empty array if parsing fails
}).pipe(z.array(z.string())); // Ensure the final output is an array of strings

const videosCollection = defineCollection({
  type: 'content', // default, specifies markdown/mdx files
  schema: z.object({
    // --- Fields primarily from 'videos' table ---
    hid: z.string(), // Unique identifier, useful even if filename is based on it
    barcode: z.string().optional(), // Barcode might be optional
    thumbnail_small: z.string().url().optional(), // URL for small thumbnail
    thumbnail_large: z.string().url().optional(), // URL for large thumbnail
    manufacturer: z.string().optional(), // Manufacturer name
    upload_date: z.date(), // Date the video was uploaded/added
    production_date: z.date().optional(), // Production date, might be optional
    views: z.number().default(0), // View count

    // --- Fields primarily from 'video_translations' table ---
    title: z.string(), // Video title (language specific)
    // description: z.string().optional(), // Description (language specific) - Often put in the main body of Markdown
    tags: parseStringArray.optional().default([]), // Tags (language specific), parsed into array
    actors: parseStringArray.optional().default([]), // Actors (language specific), parsed into array
    video_url: z.string().url().optional(), // URL for the video stream (language specific?)
    source: z.string().optional(), // Source information (language specific?)

    // --- Optional SEO/Metadata fields you might want to add ---
    // isDraft: z.boolean().optional().default(false),
    // customSlug: z.string().optional(), // If you don't want to use hid as slug
  }),
});

export const collections = {
  'videos': videosCollection,
};
