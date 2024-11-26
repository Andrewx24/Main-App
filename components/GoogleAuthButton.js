import React, { useCallback } from 'react';
import { Button, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { googleConfig } from '../utils/Googleauth';
import { API_URL } from '../config';
import { showToast } from '../utils/toastNotification';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { useAuth } from '../state/AuthProvider';

WebBrowser.maybeCompleteAuthSession();

const ENDPOINTS = {
  LOGIN: '/auth/google/login',
  SIGNUP: '/auth/google/signup'
};

const GoogleAuthButton = ({ onAuthComplete, isSignUp = false }) => {
  const navigation = useNavigation();
  const { login } = useAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    ...googleConfig,
    redirectUri: makeRedirectUri({
      scheme: 'com.googleusercontent.apps.31361740434-uasqvn754uln5hgcijp6n59lc4ig4s74',
      path: 'oauth2redirect'
    }),
    useProxy: Platform.select({ web: false, default: true })
  });

  const handleNavigation = useCallback(async (screen) => {
    try {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: screen }],
        })
      );
    } catch (error) {
      console.error('Navigation error:', error);
      showToast('Navigation failed');
    }
  }, [navigation]);

  const callBackend = async (endpoint, userData) => {
    try {
      const baseUrl = __DEV__ ? 'http://localhost:4000' : API_URL;
      const url = `${baseUrl}${endpoint}`;
      
      console.log('Making backend request to:', url);
      console.log('Request data:', userData);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      const result = JSON.parse(responseText);
      return result;
    } catch (error) {
      console.error('Backend request failed:', error);
      throw new Error('Failed to communicate with server');
    }
  };

  const processAuthResult = useCallback(async (authResponse) => {
    try {
      if (!authResponse?.accessToken) {
        throw new Error('No access token received');
      }

      // Get Google user info
      const userInfoResponse = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authResponse.accessToken}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!userInfoResponse.ok) {
        throw new Error('Failed to get user info from Google');
      }

      const userInfo = await userInfoResponse.json();
      console.log('Received user info from Google:', userInfo);

      const userData = {
        googleId: userInfo.id,
        email: userInfo.email,
        name: userInfo.name || userInfo.given_name
      };

      if (isSignUp) {
        // Attempt signup
        const signupResult = await callBackend(ENDPOINTS.SIGNUP, userData);
        console.log('Signup result:', signupResult);

        if (signupResult.message === 'Email already registered') {
          // If user exists, try logging in
          showToast('Account exists, logging in...');
          const loginResult = await callBackend(ENDPOINTS.LOGIN, userData);
          
          if (loginResult.success) {
            await login({
              token: loginResult.token,
              user: loginResult.user
            });
            showToast('Welcome back!');
            handleNavigation('Home');
          } else {
            throw new Error('Login failed after existing account found');
          }
        } else if (signupResult.success) {
          // New user signup successful
          await login({
            token: signupResult.token,
            user: signupResult.user
          });
          showToast('Sign up successful');
          handleNavigation('AccountType');
        } else {
          throw new Error(signupResult.message || 'Signup failed');
        }
      } else {
        // Direct login flow
        const loginResult = await callBackend(ENDPOINTS.LOGIN, userData);
        
        if (loginResult.success) {
          await login({
            token: loginResult.token,
            user: loginResult.user
          });
          showToast('Login successful');
          handleNavigation('Home');
        } else {
          throw new Error(loginResult.message || 'Login failed');
        }
      }

      if (onAuthComplete) {
        onAuthComplete(loginResult);
      }

    } catch (error) {
      console.error('Auth processing error:', error);
      showToast(error.message || 'Authentication failed');
    }
  }, [isSignUp, login, handleNavigation, onAuthComplete]);

  React.useEffect(() => {
    if (response?.type === 'success') {
      console.log('Google auth successful, processing...');
      processAuthResult(response.authentication).catch(error => {
        console.error('Auth effect error:', error);
        showToast('Authentication failed');
      });
    } else if (response?.type === 'error') {
      console.error('Google auth error:', response.error);
      showToast('Google authentication failed');
    }
  }, [response, processAuthResult]);

  const handlePress = async () => {
    try {
      console.log('Google auth button pressed');
      const result = await promptAsync();
      console.log('Prompt result:', result);
    } catch (error) {
      console.error('Button press error:', error);
      showToast('Failed to start authentication');
    }
  };

  return (
    <Button
      title={isSignUp ? "Sign up with Google" : "Login with Google"}
      onPress={handlePress}
      disabled={!request}
    />
  );
};

export default GoogleAuthButton;