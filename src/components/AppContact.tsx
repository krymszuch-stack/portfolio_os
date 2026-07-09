/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { OSConfig } from '../types';
import { initAuth as initGoogleAuth, googleSignIn, logout as logoutGoogle } from '../lib/googleAuth';
import { getMsalInstance, loginMicrosoft, logout as logoutMicrosoft, getGraphAccessToken } from '../lib/microsoftAuth';
import { ContactForm } from './contact/ContactForm';
import { ContactIntegrations } from './contact/ContactIntegrations';
import { ContactInfo } from './contact/ContactInfo';

interface AppContactProps {
  config?: OSConfig;
  setConfig?: React.Dispatch<React.SetStateAction<OSConfig>>;
}

// Base64URL encoder helper for Gmail API
const makeRawEmail = (to: string, from: string, subject: string, message: string) => {
  const str = [
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    `Content-Transfer-Encoding: 8bit`,
    '',
    message
  ].join('\r\n');
  
  const utf8 = new TextEncoder().encode(str);
  let binString = '';
  for (let i = 0; i < utf8.length; i++) {
    binString += String.fromCharCode(utf8[i]);
  }
  
  return btoa(binString)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const AppContact: React.FC<AppContactProps> = ({ config, setConfig }) => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Google & Microsoft auth states
  const [googleUser, setGoogleUser] = useState<{ displayName: string | null; email: string | null } | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [msUser, setMsUser] = useState<{ displayName: string | null; email: string | null } | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Load auth states on mount
  useEffect(() => {
    // 1. Google/Firebase Auth
    const unsubscribe = initGoogleAuth(
      (user, cachedToken) => {
        setGoogleUser({
          displayName: user.displayName,
          email: user.email
        });
        setGoogleToken(cachedToken);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );

    // 2. Microsoft MSAL Auth
    getMsalInstance().then(msal => {
      const accounts = msal.getAllAccounts();
      if (accounts.length > 0) {
        setMsUser({
          displayName: accounts[0].name || accounts[0].username,
          email: accounts[0].username
        });
      }
    }).catch(err => {
      console.error('Error initializing MSAL:', err);
    });

    return () => unsubscribe();
  }, []);

  const handleConnectGoogle = async () => {
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser({
          displayName: result.user.displayName,
          email: result.user.email
        });
        setGoogleToken(result.accessToken);
        if (setConfig) {
          setConfig(prev => ({ ...prev, emailProvider: 'google' }));
        }
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      setAuthError('Błąd połączenia z Google. Spróbuj ponownie.');
    }
  };

  const handleDisconnectGoogle = async () => {
    setAuthError(null);
    try {
      await logoutGoogle();
      setGoogleUser(null);
      setGoogleToken(null);
      if (config?.emailProvider === 'google' && setConfig) {
        setConfig(prev => ({ ...prev, emailProvider: 'smtp' }));
      }
    } catch (err: any) {
      console.error('Google logout error:', err);
    }
  };

  const handleConnectMicrosoft = async () => {
    setAuthError(null);
    try {
      const result = await loginMicrosoft();
      if (result) {
        setMsUser({
          displayName: result.user.displayName,
          email: result.user.email
        });
        if (setConfig) {
          setConfig(prev => ({ ...prev, emailProvider: 'microsoft' }));
        }
      }
    } catch (err: any) {
      console.error('Microsoft login error:', err);
      setAuthError('Błąd połączenia z Microsoft. Upewnij się, że zezwalasz na wyskakujące okienka.');
    }
  };

  const handleDisconnectMicrosoft = async () => {
    setAuthError(null);
    try {
      await logoutMicrosoft();
      setMsUser(null);
      if (config?.emailProvider === 'microsoft' && setConfig) {
        setConfig(prev => ({ ...prev, emailProvider: 'smtp' }));
      }
    } catch (err: any) {
      console.error('Microsoft logout error:', err);
    }
  };

  const handleSendMessage = async (formData: { name: string; email: string; subject: string; message: string }) => {
    setIsSending(true);
    setAuthError(null);

    const provider = config?.emailProvider || 'smtp';

    const dispatchNewMsgEvent = () => {
      window.dispatchEvent(new CustomEvent('portfolio_os_new_message', {
        detail: {
          sender: formData.name || 'Anonimowy gość',
          senderEmail: formData.email,
          subject: formData.subject || '(brak tematu)',
          message: formData.message
        }
      }));
    };

    if (provider === 'google') {
      if (!googleUser || !googleToken) {
        setAuthError('Twoja sesja Google wygasła. Połącz się ponownie.');
        setIsSending(false);
        return;
      }

      try {
        const mailContent = `Otrzymałeś nową wiadomość z formularza kontaktowego PortfolioOS!

Od: ${formData.name || 'Anonimowy gość'} <${formData.email}>
Temat: ${formData.subject || '(brak tematu)'}

Treść wiadomości:
--------------------------------------------------
${formData.message}
--------------------------------------------------`;

        const raw = makeRawEmail(
          googleUser.email || formData.email,
          googleUser.email || '',
          `[PortfolioOS Contact] ${formData.subject || 'Wiadomość z formularza'}`,
          mailContent
        );

        const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${googleToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ raw })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error?.message || 'Błąd wysyłania e-maila przez Gmail API');
        }

        setIsSending(false);
        setIsSent(true);
        dispatchNewMsgEvent();

      } catch (error: any) {
        console.error('Error sending via Gmail:', error);
        setAuthError(`Błąd Gmail API: ${error.message || 'Nieznany błąd'}`);
        setIsSending(false);
      }

    } else if (provider === 'microsoft') {
      if (!msUser) {
        setAuthError('Twoja sesja Microsoft wygasła. Połącz się ponownie.');
        setIsSending(false);
        return;
      }

      try {
        const token = await getGraphAccessToken();
        if (!token) {
          throw new Error('Nie udało się pobrać tokenu dostępu Microsoft Graph API');
        }

        const mailContent = `Otrzymałeś nową wiadomość z formularza kontaktowego PortfolioOS!

Od: ${formData.name || 'Anonimowy gość'} <${formData.email}>
Temat: ${formData.subject || '(brak tematu)'}

Treść wiadomości:
--------------------------------------------------
${formData.message}
--------------------------------------------------`;

        const recipientEmail = msUser.email || '';

        const graphMailBody = {
          message: {
            subject: `[PortfolioOS Contact] ${formData.subject || 'Wiadomość z formularza'}`,
            body: {
              contentType: 'Text',
              content: mailContent
            },
            toRecipients: [
              {
                emailAddress: {
                  address: recipientEmail
                }
              }
            ]
          },
          saveToSentItems: 'true'
        };

        const response = await fetch('https://graph.microsoft.com/v1.0/me/sendMail', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(graphMailBody)
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error?.message || 'Błąd wysyłania e-maila przez Microsoft Graph API');
        }

        setIsSending(false);
        setIsSent(true);
        dispatchNewMsgEvent();

      } catch (error: any) {
        console.error('Error sending via Microsoft Graph:', error);
        setAuthError(`Błąd Microsoft Graph: ${error.message || 'Nieznany błąd'}`);
        setIsSending(false);
      }

    } else {
      setTimeout(() => {
        setIsSending(false);
        setIsSent(true);
        dispatchNewMsgEvent();
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      <ContactIntegrations 
        config={config} 
        setConfig={setConfig} 
        googleUser={googleUser}
        msUser={msUser}
        authError={authError}
        onConnectGoogle={handleConnectGoogle}
        onDisconnectGoogle={handleDisconnectGoogle}
        onConnectMicrosoft={handleConnectMicrosoft}
        onDisconnectMicrosoft={handleDisconnectMicrosoft}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Contact Form (Left column, 7 spans) */}
        <div className="lg:col-span-7">
          <ContactForm 
            onSubmit={handleSendMessage} 
            isSending={isSending} 
            isSent={isSent} 
            onResetSent={() => setIsSent(false)} 
          />
        </div>

        {/* Directory cards (Right column, 5 spans) */}
        <div className="lg:col-span-5 space-y-6">
          <ContactInfo 
            config={config} 
            setConfig={setConfig} 
          />
        </div>
      </div>
    </div>
  );
};
