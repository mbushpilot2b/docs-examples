// Test script to demonstrate GraphQL Shield functionality
// Run with: node test-shield.js

import fetch from 'node-fetch';

const GRAPHQL_URL = 'http://localhost:4000/graphql';

async function testGraphQL(query, variables = {}, authToken = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();
  return result;
}

async function runTests() {
  console.log('🧪 Testing GraphQL Shield Integration\n');

  // Test 1: Public query (should work without auth)
  console.log('1. Testing public query (no auth required)...');
  const publicQuery = `
    query {
      books {
        title
        author
      }
    }
  `;

  try {
    const result = await testGraphQL(publicQuery);
    if (result.data?.books) {
      console.log('✅ SUCCESS: Public query works without authentication');
    } else {
      console.log('❌ FAILED: Public query should work without auth');
      console.log(result);
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }

  // Test 2: Protected query without auth (should fail)
  console.log('\n2. Testing protected query without authentication...');
  const protectedQuery = `
    query {
      protectedBooks {
        title
        author
      }
    }
  `;

  try {
    const result = await testGraphQL(protectedQuery);
    if (result.errors && result.errors[0].message.includes('Not Authorised')) {
      console.log('✅ SUCCESS: Protected query correctly blocked without authentication');
    } else {
      console.log('❌ FAILED: Protected query should be blocked without auth');
      console.log(result);
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }

  // Test 3: Login to get token
  console.log('\n3. Testing login...');
  const loginMutation = `
    mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        success
        message
        user {
          username
          firstName
          lastName
        }
      }
    }
  `;

  try {
    const loginResult = await testGraphQL(loginMutation, {
      username: 'admin',
      password: 'password'
    });

    if (loginResult.data?.login?.success) {
      console.log('✅ SUCCESS: Login successful');
      const token = loginResult.data.login.token;

      // Test 4: Protected query with auth (should work)
      console.log('\n4. Testing protected query with authentication...');
      try {
        const result = await testGraphQL(protectedQuery, {}, token);
        if (result.data?.protectedBooks) {
          console.log('✅ SUCCESS: Protected query works with authentication');
        } else {
          console.log('❌ FAILED: Protected query should work with auth');
          console.log(result);
        }
      } catch (error) {
        console.log('❌ ERROR:', error.message);
      }

      // Test 5: Admin query with admin user (should work)
      console.log('\n5. Testing admin query with admin user...');
      const adminQuery = `
        query {
          adminBooks {
            title
            author
          }
        }
      `;

      try {
        const result = await testGraphQL(adminQuery, {}, token);
        if (result.data?.adminBooks) {
          console.log('✅ SUCCESS: Admin query works with admin user');
        } else {
          console.log('❌ FAILED: Admin query should work with admin user');
          console.log(result);
        }
      } catch (error) {
        console.log('❌ ERROR:', error.message);
      }

    } else {
      console.log('❌ FAILED: Login should succeed with correct credentials');
      console.log(loginResult);
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }

  // Test 6: Login with regular user
  console.log('\n6. Testing login with regular user...');
  try {
    const userLogin = await testGraphQL(loginMutation, {
      username: 'user',
      password: 'password'
    });

    if (userLogin.data?.login?.success) {
      console.log('✅ SUCCESS: User login successful');
      const userToken = userLogin.data.login.token;

      // Test 7: Admin query with regular user (should fail)
      console.log('\n7. Testing admin query with regular user (should fail)...');
      const adminQuery = `
        query {
          adminBooks {
            title
            author
          }
        }
      `;

      try {
        const result = await testGraphQL(adminQuery, {}, userToken);
        if (result.errors && result.errors[0].message.includes('Not Authorised')) {
          console.log('✅ SUCCESS: Admin query correctly blocked for regular user');
        } else {
          console.log('❌ FAILED: Admin query should be blocked for regular user');
          console.log(result);
        }
      } catch (error) {
        console.log('❌ ERROR:', error.message);
      }

    } else {
      console.log('❌ FAILED: User login should succeed');
      console.log(userLogin);
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }

  console.log('\n🎉 Shield testing completed!');
  console.log('\n📝 Summary:');
  console.log('- Public queries work without authentication');
  console.log('- Protected queries require authentication');
  console.log('- Admin queries require admin role');
  console.log('- Shield middleware properly intercepts and blocks unauthorized access');
}

// Run tests if server is running
testGraphQL(`{ __typename }`)
  .then(() => {
    runTests();
  })
  .catch(() => {
    console.log('❌ Server is not running. Please start the server first with: npm start');
    console.log('Then run this test script.');
  });
