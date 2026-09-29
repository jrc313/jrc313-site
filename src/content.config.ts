import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const sketches = defineCollection({
	// Load Markdown and MDX files in the `src/content/sketch/` directory.
	loader: glob({ base: './src/content/sketches', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			sketchScript: z.string()
		}),
});

const socials = defineCollection({
	loader: file("src/data/socials.json")
})

export const collections = { sketches, socials };
