import { google } from 'googleapis';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const maxResults = url.searchParams.get('max-results');
  const DEFAULT_MAX_RESULTS = 15;

  const cookie = await cookies();

  const access_token = cookie.get('access_token')?.value;
  const expiry_date = cookie.get('expiry_date')?.value;

  if (!access_token) {
    return new Response('Missing tokens', { status: 400 });
  }

  if (expiry_date && Date.now() >= parseInt(expiry_date)) {
    return new Response('Access token expired', { status: 401 });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({
    access_token,
  });

  const gmail = google.gmail({ version: 'v1', auth });
  const {
    data: { messages },
  } = await gmail.users.messages.list({
    userId: 'me',
    maxResults: parseInt(maxResults ?? DEFAULT_MAX_RESULTS.toString()),
  });

  const message = messages?.map((msg) => {
    if (!msg || !msg.id) return;
    return gmail.users.messages.get({
      id: msg.id,
      userId: 'me',
      format: 'full',
    });
  });

  if (!message || message.length <= 0) {
    return new Response('No messages found', { status: 404 });
  }

  const messagesWithDetails = await Promise.all(message);

  return Response.json(
    messagesWithDetails.map((msg) => {
      if (msg?.data) return msg.data;
    }),
  );
}
