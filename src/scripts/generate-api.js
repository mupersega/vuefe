// This script generates the API client from a running API server
import { execSync } from 'child_process';
import { createInterface } from 'readline/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..', '..');

// Default parameters
const defaultPort = '5428';
const defaultHost = 'localhost';
const outputDir = resolve(projectRoot, 'src/api-client');

async function generateApiClient() {
  try {
    // Ask for the port
    const port = await rl.question(`Enter API server port (default: ${defaultPort}): `);
    const apiPort = port || defaultPort;
    
    // Ask for the host
    const host = await rl.question(`Enter API server host (default: ${defaultHost}): `);
    const apiHost = host || defaultHost;
    
    console.log(`Generating API client from http://${apiHost}:${apiPort}/swagger/v1/swagger.json...`);
    
    try {
      const command = `npx @openapitools/openapi-generator-cli generate \
        -i http://${apiHost}:${apiPort}/swagger/v1/swagger.json \
        -g typescript-axios \
        -o ${outputDir} \
        --additional-properties=supportsES6=true,withSeparateModelsAndApi=true,modelPackage=models,apiPackage=api`;
      
      console.log(`Executing: ${command}`);
      execSync(command, { stdio: 'inherit' });
      console.log('API client generated successfully!');
    } catch (error) {
      console.error('Error generating API client:');
      console.error(error.message);
      console.error('Make sure your API server is running and the Swagger endpoint is accessible.');
    }
  } finally {
    rl.close();
  }
}

// Run the function
generateApiClient();
