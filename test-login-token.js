// Simple test to verify login returns JWT token
import fetch from 'node-fetch';

const GRAPHQL_URL = 'http://localhost:4000/graphql';

async function testLoginToken() {
  console.log('🧪 Testing login token response...\n');

  const loginQuery = `
    mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        success
        message
        user {
          username
          firstName
          lastName
        }
        token
      }
    }
  `;

  // Test successful login
  console.log('1. Testing successful login...');
  const loginResponse = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: loginQuery,
      variables: {
        username: 'admin',
        password: 'password'
      }
    }),
  });

  const loginResult = await loginResponse.json();

  if (loginResult.data?.login?.success) {
    console.log('✅ SUCCESS: Login successful');
    console.log('   User:', loginResult.data.login.user);
    console.log('   Token:', loginResult.data.login.token ? 'PRESENT ✅' : 'MISSING ❌');
    console.log('   Token length:', loginResult.data.login.token?.length || 0);

    // Test using the token
    console.log('\n2. Testing token usage...');
    const testQuery = `
      query {
        me {
          username
          firstName
          lastName
        }
      }
    `;

    const authResponse = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginResult.data.login.token}`
      },
      body: JSON.stringify({
        query: testQuery,
      }),
    });

    const authResult = await authResponse.json();

    if (authResult.data?.me) {
      console.log('✅ SUCCESS: Token authentication works');
      console.log('   Authenticated user:', authResult.data.me);
    } else {
      console.log('❌ FAILED: Token authentication failed');
      console.log(authResult);
    }

  } else {
    console.log('❌ FAILED: Login failed');
    console.log(loginResult);
  }

  // Test failed login
  console.log('\n3. Testing failed login...');
  const failedLoginResponse = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: loginQuery,
      variables: {
        username: 'admin',
        password: 'wrongpassword'
      }
    }),
  });

  const failedLoginResult = await failedLoginResponse.json();

  if (!failedLoginResult.data?.login?.success) {
    console.log('✅ SUCCESS: Failed login handled correctly');
    console.log('   Message:', failedLoginResult.data.login.message);
    console.log('   Token:', failedLoginResult.data.login.token);
  } else {
    console.log('❌ FAILED: Failed login should return success: false');
    console.log(failedLoginResult);
  }

  console.log('\n🎉 Login token test completed!');
}

// Run test
testLoginToken().catch(console.error);
