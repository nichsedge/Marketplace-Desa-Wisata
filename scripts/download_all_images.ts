import fs from 'fs';
import path from 'path';

const TARGET_DIR = path.resolve('public/images/unsplash');
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

function findUrlsInFile(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const urlRegex = /https:\/\/images\.unsplash\.com\/[^\s'"`)<>]+/g;
  const matches = content.match(urlRegex) || [];
  return matches
    .map(u => u.replace(/&amp;/g, '&'))
    .filter(u => u !== 'https://images.unsplash.com/...' && !u.endsWith('...'));
}

function walkDir(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(fullPath));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

async function run() {
  const allFiles = walkDir('./src').concat(fs.existsSync('./index.html') ? ['./index.html'] : []);
  const urlMap = new Map<string, string>(); // originalUrl -> localPath
  const allUrls = new Set<string>();

  allFiles.forEach(f => {
    findUrlsInFile(f).forEach(u => allUrls.add(u));
  });

  console.log(`Found ${allUrls.size} valid Unsplash URLs across ${allFiles.length} files.`);

  // Create deterministic unique filename for each URL
  let counter = 1;
  for (const url of allUrls) {
    try {
      const parsed = new URL(url);
      let baseName = parsed.pathname.replace(/^\//, '').replace(/[^a-zA-Z0-9_-]/g, '_');
      if (!baseName) baseName = `img_${counter++}`;
      
      const width = parsed.searchParams.get('w');
      const filename = width ? `${baseName}_w${width}.jpg` : `${baseName}.jpg`;
      const localWebPath = `/images/unsplash/${filename}`;
      urlMap.set(url, localWebPath);
    } catch {
      const fallbackName = `img_${counter++}.jpg`;
      urlMap.set(url, `/images/unsplash/${fallbackName}`);
    }
  }

  // Verify all files exist in public/images/unsplash
  let missingCount = 0;
  for (const [url, localPath] of urlMap.entries()) {
    const destFile = path.join('public', localPath.replace(/^\//, ''));
    if (!fs.existsSync(destFile) || fs.statSync(destFile).size < 1000) {
      console.error(`Missing or empty: ${destFile} for ${url}`);
      missingCount++;
    }
  }

  if (missingCount > 0) {
    console.error(`Total missing: ${missingCount}`);
    process.exit(1);
  }

  console.log(`All ${urlMap.size} local image files verified in public/images/unsplash!`);

  // Replace URLs in source files
  console.log('\nReplacing external Unsplash URLs with local paths in source files...');
  let totalReplacements = 0;

  for (const file of allFiles) {
    let content = fs.readFileSync(file, 'utf-8');
    let fileChanged = false;

    // Sort URLs by length descending to prevent partial match issues
    const sortedUrls = Array.from(urlMap.keys()).sort((a, b) => b.length - a.length);

    for (const url of sortedUrls) {
      if (content.includes(url)) {
        const localPath = urlMap.get(url)!;
        content = content.replaceAll(url, localPath);
        fileChanged = true;
        totalReplacements++;
      }
    }

    if (fileChanged) {
      fs.writeFileSync(file, content, 'utf-8');
      console.log(`Updated: ${file}`);
    }
  }

  console.log(`\nSuccessfully replaced ${totalReplacements} image references with local offline assets!`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
