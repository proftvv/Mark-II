// Test users endpoint
const http = require('http');

function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`\n${path}:`);
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers:`, res.headers);
        if (res.headers['content-type']?.includes('application/json')) {
          try {
            console.log('Body:', JSON.parse(data));
          } catch (e) {
            console.log('Body (parse error):', data.substring(0, 200));
          }
        } else {
          console.log('Body (non-JSON):', data.substring(0, 200));
        }
        resolve();
      });
    }).on('error', (err) => {
      console.error(`${path}: ERROR -`, err.message);
      resolve();
    });
  });
}

async function runTests() {
  console.log('Testing endpoints...\n');
  await testEndpoint('/');
  await testEndpoint('/debug/routes');
  await testEndpoint('/users');
  await testEndpoint('/logs');
  await testEndpoint('/logs/stats');
  console.log('\n✅ Tests complete!');
  process.exit(0);
}

runTests();
