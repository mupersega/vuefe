// This script generates the API client from a running API server with command line parameters
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get command line arguments
const args = process.argv.slice(2);
const portArgIndex = args.findIndex(arg => arg === '--port' || arg === '-p');
const hostArgIndex = args.findIndex(arg => arg === '--host' || arg === '-h');

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..', '..');

// Default parameters
const defaultPort = '5248';
const defaultHost = 'localhost';
const outputDir = resolve(projectRoot, 'src/api-client');

// Parse command line arguments
const apiPort = portArgIndex !== -1 && args[portArgIndex + 1] ? args[portArgIndex + 1] : defaultPort;
const apiHost = hostArgIndex !== -1 && args[hostArgIndex + 1] ? args[hostArgIndex + 1] : defaultHost;

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
  process.exit(1);
}
