import axios from 'axios';

// Function to handle user login
export const login = async (credentials) => {
 try {
    const response = await axios.post('http://127.0.0.1:5000/login', credentials); // Assuming the login route is at '/login'
    if (response.status === 200) {
      const { access_token, refresh_token } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      return response.data;
    }
    throw new Error('Login failed: Invalid response status');
 } catch (error) {
    console.error('Login failed', error);
    throw error;
 }
};

// Function to handle user signup
export const signup = async (userDetails) => {
 try {
    const response = await axios.post('http://127.0.0.1:5000/signup', userDetails); // Assuming the signup route is at '/signup'
    if (response.status === 201) {
      return response.data;
    }
    throw new Error('Signup failed: Invalid response status');
 } catch (error) {
    console.error('Signup failed', error);
    throw error;
 }
};

// Function to handle user logout
export const logout = async () => {
    try {
        // Retrieve the access token from local storage
        const accessToken = localStorage.getItem('access_token');

        // Make a POST request to the logout endpoint
        const response = await axios.post('http://127.0.0.1:5000/logout', {}, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        // Check if the request was successful
        if (response.status === 200) {
            // Remove the access and refresh tokens from local storage
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            // Redirect to the login page or perform other logout actions
            // You might need to use a router library like react-router-dom for redirection
            // For example: navigate('/login');
        } else {
            throw new Error('Logout failed: Invalid response status');
        }
    } catch (error) {
        console.error('Logout failed', error);
        // Handle error, e.g., show a message to the user
    }
};


// Function to refresh access token
export const refreshAccessToken = async () => {
 try {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) {
      throw new Error('No refresh token found');
    }
    const response = await axios.post('http://127.0.0.1:5000/refresh', { refresh_token }); // Assuming the refresh token route is at '/refresh'
    const { access_token } = response.data;
    localStorage.setItem('access_token', access_token);
    return access_token;
 } catch (error) {
    console.error('Refresh token failed', error);
    throw error;
 }
};


export const authFetch = async (url, options = {}) => {
  try {
     let token = localStorage.getItem('access_token');
     if (!token) {
       // If access token is not present, try refreshing it
       token = await refreshAccessToken();
       if (!token) {
         // If refresh token is also not present or failed to refresh, throw an error
         throw new Error('No access token or refresh token found');
       }
     }
     
     // Ensure the Content-Type is set to application/json
     const headers = {
       ...options.headers,
       Authorization: `Bearer ${token}`,
       'Content-Type': 'application/json',
     };
     
     // Create a copy of options to avoid mutating the original object
     const requestOptions = { ...options, headers };
     
     // If the request method is POST and there's a body, ensure it's stringified
     if (options.method === 'POST' && options.body) {
       requestOptions.data = JSON.stringify(options.body);
       delete requestOptions.body; // Remove the original body property
     }
     
     const response = await axios(url, requestOptions);
     return response.data;
  } catch (error) {
     console.error('Authenticated request failed', error);
     throw error;
  }
 };
 
 // auth.js

// This is a simplified example. Your actual implementation might be more complex,
// especially if you're using JWT tokens or other authentication methods.

export const isAuthenticated = () => {
  // Check if there's a valid access token in local storage or cookies
  const token = localStorage.getItem('access_token');
  if (!token) {
      return false;
  }

  // Optionally, you can also check if the token is expired
  // This depends on how you're storing and managing tokens

  return true;
};
