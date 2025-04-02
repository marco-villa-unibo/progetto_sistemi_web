const fs = require('fs-extra');

(async function build() {
  try {
    await fs.remove('dist');
    await fs.remove('node_modules');
    await fs.remove('src/schemas/index.d.ts');
    await fs.remove('src/schemas/openapi.json');
    console.log('Project clean!');
  } catch (error) {
    console.log('ERROR cleaning the project.');
    console.log('error :>> ', error);
  }
})();
