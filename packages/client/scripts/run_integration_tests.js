const ARGS = process.argv.slice(2);
const TEST_FILE = "./src/tmp/it-test.js";

const npm = require('npm');
const fs = require('fs');

const cleanup = () => fs.existsSync(TEST_FILE) && fs.unlinkSync(TEST_FILE);

process.on('unhandledRejection', err => {
  throw err;
});

process.on('SIGINT', cleanup);

new Promise((resolve, reject) => {
  npm.load(function(loadError) {
    if (loadError) {
      reject(loadError);
    } else {
      clean()
        .then(generateTestFile)
        .then(runJest)
        .catch(reject)
        .then(resolve)
        .finally(cleanup);
    }
  });
});


const clean = () => new Promise((resolve, reject) => {
  npm.run('clean', (runError) => {
    if (runError) {
      reject(runError);
    } else {
      resolve();
    }
  });
});

const generateTestFile = () => new Promise((resolve, reject) => {
  getTestModules().then((testModules) => {
    fs.writeFile(
      TEST_FILE,
      testModules.map(m => `require('${m}');`).join('\n') + '\n',
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
});

const runJest = () => new Promise((resolve, reject) => {
  npm.run('it:run', (runError) => {
    process.stdout.write(runError);
    if (runError) {
      reject(runError);
    } else {
      resolve();
    }
  });
});

const getTestModules = () => new Promise((resolve, reject) => {
  if (ARGS.length) {
    resolve(ARGS.map(a => a.replace('src', '..').replace('.js', '')));
  } else {
    fs.readdir('./src/integration_tests', (err, items) => {
      if (err) {
        reject(err);
      } else {
        resolve(
          items
            .filter(i => i.endsWith('-test.js'))
            .map(i => i.replace('.js', ''))
            .map(i => '../integration_tests/' + i )
        );
      }
    });
  }
});
