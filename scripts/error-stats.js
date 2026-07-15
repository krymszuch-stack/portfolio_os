#!/usr/bin/env node
// scripts/error-stats.js
// Simple parser that reads linter/test output from stdin or a file and counts the most frequent error identifiers/messages.

const fs = require('fs');
const path = require('path');

function printUsage() {
  console.log('Usage: node scripts/error-stats.js [path/to/log.txt]');
  console.log('Or pipe into it: cat log.txt | node scripts/error-stats.js');
}

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => data += chunk);
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

function extractTokens(text) {
  const counts = new Map();

  // Common patterns
  const patterns = [
    /\bTS\d{3,4}\b/g, // TypeScript error codes e.g. TS2345
    /@?\b[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+\b/g, // eslint rules like jsx-a11y/label-has-associated-control or @typescript-eslint/no-explicit-any
    /\bno-[a-z-]+\b/g, // eslint rule form no-unused-vars etc
    /error:\s*([^\n]+)/gi, // generic error: message
    /warning:\s*([^\n]+)/gi, // generic warning
    /\b[A-Za-z0-9_./-]+\.ts\(?\d*,?\d*\)?[:]?\s*(error|warning)?/gi // file references
  ];

  // For message grouping: we will also capture final words after rule names
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    // quick skip empty
    if (!line || line.trim().length === 0) continue;

    // Extract rule-like tokens
    for (const pat of patterns) {
      let m;
      while ((m = pat.exec(line)) !== null) {
        const token = (m[0] || '').trim();
        if (!token) continue;
        const key = token.toLowerCase();
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    }

    // Also extract ESLint rule ids expressed as "[rule]" at end (e.g. "no-unused-vars")
    const eslintIdMatch = line.match(/\b([a-z0-9@\-_/]+)\b/gi);
    if (eslintIdMatch) {
      for (const t of eslintIdMatch) {
        if (t.includes('/') || t.startsWith('@') || t.startsWith('no-') || t.startsWith('@typescript-eslint')) {
          const key = t.toLowerCase();
          counts.set(key, (counts.get(key) || 0) + 0); // ensure presence (we already count by patterns)
        }
      }
    }
  }

  return counts;
}

function summarizeMap(map) {
  const arr = Array.from(map.entries()).map(([k,v]) => ({ token: k, count: v }));
  arr.sort((a,b) => b.count - a.count);
  return arr;
}

async function main() {
  try {
    let text = '';
    const arg = process.argv[2];
    if (arg) {
      const p = path.resolve(process.cwd(), arg);
      if (!fs.existsSync(p)) {
        console.error('File not found:', p);
        process.exit(2);
      }
      text = fs.readFileSync(p, 'utf8');
    } else {
      // Read from stdin
      const stat = fs.fstatSync(0);
      if (stat && stat.size > 0) {
        text = fs.readFileSync(0, 'utf8');
      } else {
        // attempt to read stdin async
        text = await readStdin();
      }
    }

    if (!text || text.trim().length === 0) {
      printUsage();
      process.exit(0);
    }

    const counts = extractTokens(text);
    const summary = summarizeMap(counts);

    const totalUnique = summary.length;
    const top = summary.slice(0, 25);

    const out = {
      generatedAt: new Date().toISOString(),
      totalUniqueTokens: totalUnique,
      top25: top
    };

    console.log(JSON.stringify(out, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error in error-stats:', err);
    process.exit(1);
  }
}

main();
