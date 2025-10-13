'use client';

import React, { useEffect } from 'react';
import { fetchGmailMessages } from './utils/fetch';
import { gmail_v1 } from 'googleapis';

export default function Home() {
  const [output, setOutput] = React.useState('');
  const [messageIds, setMessageIds] = React.useState<string[]>();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.origin) return;
      const tokens = event.data;
      localStorage.setItem('access_token', tokens.access_token);
      localStorage.setItem('token_type', tokens.token_type);
      localStorage.setItem('expiry_date', tokens.expiry_date);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const prompt = formData.get('prompt');

    const res = await fetch(`/api/prompt-ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const reader = res.body?.getReader();

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;
      const text = decoder.decode(value);
      setOutput((prev) => prev + text);
    }
  }

  return (
    <div>
      <h1>AI Response</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="prompt" />
        <button type="submit">Ask AI</button>
      </form>
      <p>{output}</p>

      <div>
        <button
          className="px-4 py-2 border hover:cursor-pointer"
          onClick={async () => {
            const res = await fetch('/api/auth/login');
            const { url } = await res.json();
            window.open(url, 'google-oauth', 'width=500,height=600');
          }}
        >
          signin
        </button>
      </div>
      <div>
        <button
          className="px-4 py-2 border hover:cursor-pointer"
          onClick={async () => {
            const data = await fetchGmailMessages();
            setMessageIds(data);
          }}
        >
          get mails
        </button>
      </div>
      {messageIds?.map((msg) => (
        <p>{msg}</p>
      ))}
    </div>
  );
}
