// Web Worker for mining simulation
import { calculateHash } from '../lib/crypto';

// Define the worker context
const ctx: Worker = self as any;

// Handle messages from the main thread
ctx.addEventListener('message', (event) => {
  const { blockData, difficulty, hashPower } = event.data;
  
  if (blockData && difficulty) {
    // Start mining process
    mine(blockData, difficulty, hashPower);
  }
});

// Mining function that attempts to find a valid hash
function mine(blockData: any, difficulty: number, hashPower: number): void {
  let nonce = 0;
  const requiredPrefix = '0'.repeat(difficulty);
  const startTime = Date.now();
  let validHash = '';
  let hashesCalculated = 0;
  
  // Parse the block data if it's a string
  const parsedBlockData = typeof blockData === 'string' ? blockData : JSON.stringify(blockData);
  
  // Compute hash rate based on hashPower (1-10)
  // Higher hashPower means more attempts per loop
  const hashesPerLoop = Math.ceil(hashPower * 5);
  
  // Mining loop
  while (true) {
    // Check if we should report progress
    if (hashesCalculated % 100 === 0) {
      const elapsed = (Date.now() - startTime) / 1000; // seconds
      const hashRate = elapsed > 0 ? Math.round(hashesCalculated / elapsed) : 0;
      
      // Send progress update
      ctx.postMessage({
        type: 'progress',
        hashRate,
        nonce,
        hashesCalculated
      });
    }
    
    // Try multiple hashes per loop based on hashPower
    for (let i = 0; i < hashesPerLoop; i++) {
      // Create a temporary block object for hashing with the current nonce
      const currentNonce = nonce + i;
      const blockWithNonce = typeof parsedBlockData === 'string' 
        ? parsedBlockData.replace(/"nonce":\d+/, `"nonce":${currentNonce}`)
        : JSON.stringify({...JSON.parse(parsedBlockData), nonce: currentNonce});
      
      const hash = calculateHash(blockWithNonce);
      hashesCalculated++;
      
      // Check if hash meets difficulty requirement
      if (hash.startsWith(requiredPrefix)) {
        validHash = hash;
        nonce = currentNonce;
        
        // Send successful mining result
        ctx.postMessage({
          type: 'success',
          hash: validHash,
          nonce,
          hashesCalculated,
          time: Date.now() - startTime
        });
        
        return;
      }
    }
    
    // Increment nonce by hashesPerLoop
    nonce += hashesPerLoop;
    
    // Artificial slowdown for educational purposes
    // This makes mining more visual and less CPU intensive
    if (hashesCalculated % 1000 === 0) {
      setTimeout(() => {
        // Do nothing, just give the CPU a break
      }, 10);
    }
  }
}

export {};
