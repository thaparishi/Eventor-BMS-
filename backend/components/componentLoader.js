import { ComponentLoader } from 'adminjs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new ComponentLoader instance
const componentLoader = new ComponentLoader();

// Use the correct method based on your AdminJS version
if (typeof componentLoader.register === 'function') {
  // Newer versions use register
  componentLoader.register('ShowImage', path.join(__dirname, 'ShowImage.jsx'));
} else if (typeof componentLoader.add === 'function') {
  // Some versions use add
  componentLoader.add('ShowImage', path.join(__dirname, 'ShowImage.jsx'));
} else {
  console.error('Unable to register component - incompatible ComponentLoader API');
}

export { componentLoader };