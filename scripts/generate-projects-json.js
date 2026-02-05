#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');

async function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const contentDir = path.join(repoRoot, 'content', 'gallery');
  const outFile = path.join(repoRoot, 'data', 'projects.json');

  // Read content directory
  let entries = [];
  try {
    const files = await fs.readdir(contentDir);
    for (const file of files) {
      if (path.extname(file).toLowerCase() !== '.md') continue;
      const full = path.join(contentDir, file);
      const src = await fs.readFile(full, 'utf8');
      const parsed = matter(src);
      const data = parsed.data || {};

      // Ensure there's a slug (fallback to filename)
      if (!data.slug) data.slug = path.basename(file, path.extname(file));

      entries.push(data);
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn('No content/gallery directory found — writing empty projects array.');
    } else {
      console.error('Failed to read content/gallery:', err);
      process.exit(1);
    }
  }

  // Ensure output file can be created (create parent dir if needed)
  const outDir = path.dirname(outFile);
  await fs.mkdir(outDir, { recursive: true });

  // Write JSON (array of project objects), preserve all fields
  await fs.writeFile(outFile, JSON.stringify(entries, null, 2), 'utf8');

  console.log(`Wrote ${entries.length} project(s) to ${path.relative(process.cwd(), outFile)}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
