import React from 'react';
import { Button, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

const GoogleAuthButton = ({ onAuthComplete }) => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "31361740434-r2bk04trpif4jfq6ej8aogdkepdnobmi.apps.googleusercontent.com",
    iosClientId: "31361740434-uasqvn754uln5hgcijp6n59lc4ig4s74.apps.googleusercontent.com",
    webClientId: "31361740434-f1lrp7btuc35vupc4mdnls5kd0i6ae8d.apps.googleusercontent.com",
    scopes: ['profile', 'email']
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      fetchUserInfo(response.authentication.accessToken);
    }
  }, [response]);

  const fetchUserInfo = async (accessToken) => {
    try {
      const response = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      const userInfo = await response.json();
      onAuthComplete({
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        accessToken: accessToken
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Button
      title="Sign in with Google"
      onPress={() => promptAsync({ useProxy: true })}
      disabled={!request}
    />
  );
};

export default GoogleAuthButton;