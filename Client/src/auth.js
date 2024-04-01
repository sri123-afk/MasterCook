import { useState, useEffect } from 'react';
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
export const logout = () => {
 localStorage.removeItem('access_token');
 localStorage.removeItem('refresh_token');
 // Redirect to login page or perform other logout actions
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

// Function to make authenticated requests
export const authFetch = async (url, options = {}) => {
 try {
    let token = localStorage.getItem('access_token');
    if (!token) {
      // If access token is not present, try refreshing it
      token = await refreshAccessToken();
    }
    // Ensure the Content-Type is set to application/json
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', // Add this line
    };
    // If the request method is POST and there's a body, ensure it's stringified
    if (options.method === 'POST' && options.body) {
      options.data = JSON.stringify(options.body);
      delete options.body; // Remove the original body property
    }
    const response = await axios(url, { ...options, headers });
    return response.data;
 } catch (error) {
    console.error('Authenticated request failed', error);
    throw error;
 }
};
