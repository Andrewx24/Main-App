export const googleConfig = {
    iosClientId: "31361740434-uasqvn754uln5hgcijp6n59lc4ig4s74.apps.googleusercontent.com",
    webClientId: "31361740434-f1lrp7btuc35vupc4mdnls5kd0i6ae8d.apps.googleusercontent.com",
    androidClientId: "31361740434-o5sr17g1hom518s2t82vr7df7naendcs.apps.googleusercontent.com",
    scopes: ['profile', 'email'],
    redirectUri: "com.googleusercontent.apps.31361740434-uasqvn754uln5hgcijp6n59lc4ig4s74:/oauth2redirect",
    // Add these recommended configurations
    responseType: 'id_token',
    prompt: 'select_account',
    returnSecureToken: true
  };