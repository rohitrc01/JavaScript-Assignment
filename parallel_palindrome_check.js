import { readFile } from 'fs/promises';

/* reverse complement */
function reverseComplement(seq) {
  const comp = { A: 'T', T: 'A', C: 'G', G: 'C' };
  let rc = '';
  for (let i = seq.length - 1; i >= 0; i--) {
    rc += comp[seq[i]];
  }
  return rc;
}

/* count palindromes in one sequence */
function countPalindromes(seq, minLen = 6, maxLen = 12) {
  let count = 0;

  for (let len = minLen; len <= maxLen; len++) {
    for (let i = 0; i <= seq.length - len; i++) {
      const fragment = seq.slice(i, i + len);
      if (fragment === reverseComplement(fragment)) {
        count++;
      }
    }
  }
  return count;
}

/* parse sequences from plain text (FASTA-style) */
function parseSequences(text) {
  const sequences = {};
  let currentId = null;

  for (const line of text.split('\n')) {
    if (line.startsWith('>')) {
      currentId = line.slice(1).trim();
      sequences[currentId] = '';
    } else if (currentId) {
      sequences[currentId] += line.trim().toUpperCase();
    }
  }
  return sequences;
}

/* process ONE file */
async function processFile(filePath) {
  console.log(`START processing ${filePath}`);

  const content = await readFile(filePath, 'utf8');
  const sequences = parseSequences(content);

  for (const [id, seq] of Object.entries(sequences)) {
    const count = countPalindromes(seq);
    console.log(`${filePath} | ${id}: ${count} palindromes`);
  }

  console.log(`END processing ${filePath}`);
}

/* process TWO files in parallel */
async function processTwoFiles(file1, file2) {
  await Promise.all([
    processFile(file1),
    processFile(file2)
  ]);
}

/* run */
processTwoFiles('seq.txt', 'seq2.txt')
  .catch(console.error);
