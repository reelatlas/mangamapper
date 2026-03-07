import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const OAuthPopupCallback = () => {
  const [message, setMessage] = useState('Completing Google sign-in...');

  useEffect(() => {
    let finished = false;

    const finish = (nextMessage: string) => {
      if (finished) return;
      finished = true;
      setMessage(nextMessage);
    };

    if (!window.opener) {
      finish('Sign-in completed. You can close this tab.');
      return;
    }

    const postSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        window.opener?.postMessage(
          {
            type: 'oauth-error',
            message: error.message,
          },
          window.location.origin
        );
        finish('Unable to complete sign-in. You can close this tab.');
        return;
      }

      const session = data.session;

      if (!session?.access_token || !session.refresh_token) {
        return;
      }

      window.opener?.postMessage(
        {
          type: 'oauth-session',
          payload: {
            accessToken: session.access_token,
            refreshToken: session.refresh_token,
          },
        },
        window.location.origin
      );

      finish('Sign-in completed. Closing...');
      window.close();
    };

    const pollInterval = window.setInterval(() => {
      void postSession();
    }, 300);

    const timeoutId = window.setTimeout(() => {
      window.opener?.postMessage(
        {
          type: 'oauth-error',
          message: 'Timed out while completing Google sign-in.',
        },
        window.location.origin
      );
      finish('Sign-in timed out. You can close this tab.');
    }, 20000);

    void postSession();

    return () => {
      window.clearInterval(pollInterval);
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <p className="font-mono text-sm text-muted-foreground">{message}</p>
    </main>
  );
};

export default OAuthPopupCallback;
