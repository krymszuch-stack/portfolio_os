import { PublicClientApplication, Configuration } from '@azure/msal-browser';

// Fallback dynamic Multi-tenant Client ID, or load from process/Vite env
const CLIENT_ID = (import.meta as any).env?.VITE_MICROSOFT_CLIENT_ID || '42db64a1-bdfc-4cb0-9bc7-c93d9ef9999a';

const msalConfig: Configuration = {
  auth: {
    clientId: CLIENT_ID,
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  } as any,
};

// Instancja MSAL wyeksportowana synchronicznie
export const msalInstance = new PublicClientApplication(msalConfig);

// loginRequest z wymaganymi uprawnieniami
export const loginRequest = {
  scopes: ['Mail.Send', 'Calendars.ReadWrite', 'Contacts.ReadWrite', 'User.Read'],
};

// Funkcja pomocnicza zwracająca instancję msal (kompatybilność wsteczna)
export const getMsalInstance = async (): Promise<PublicClientApplication> => {
  return msalInstance;
};

// Logowanie popup z MSAL (kompatybilność wsteczna)
export const loginMicrosoft = async () => {
  try {
    const result = await msalInstance.loginPopup({
      ...loginRequest,
      prompt: 'select_account',
    });
    return {
      user: {
        displayName: result.account.name || result.account.username,
        email: result.account.username,
        uid: result.account.homeAccountId,
      },
      accessToken: result.accessToken,
    };
  } catch (error) {
    console.error('Microsoft login error:', error);
    throw error;
  }
};

// Wylogowanie z MSAL (kompatybilność wsteczna)
export const logout = async () => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    try {
      await msalInstance.logoutPopup({
        account: accounts[0],
        postLogoutRedirectUri: window.location.origin,
      });
    } catch (err) {
      console.error('Microsoft logoutPopup error:', err);
      localStorage.clear();
      window.location.reload();
    }
  }
};

// Funkcja pozyskiwania tokenu dostępu Microsoft Graph API
export const getGraphToken = async (): Promise<string | null> => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length === 0) {
    return null;
  }

  try {
    const tokenResponse = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account: accounts[0],
    });
    return tokenResponse.accessToken;
  } catch (error) {
    console.warn('Silent token acquisition failed, trying popup...', error);
    try {
      const tokenResponse = await msalInstance.acquireTokenPopup(loginRequest);
      return tokenResponse.accessToken;
    } catch (popupError) {
      console.error('Popup token acquisition failed:', popupError);
      return null;
    }
  }
};

// Alias dla kompatybilności wstecznej
export const getGraphAccessToken = getGraphToken;
