import path from 'path';
import process from 'process';
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

export async function GET(req: NextRequest, response: NextResponse) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing code', { status: 400 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens) {
      return new Response('Error retrieving access token', { status: 500 });
    }

    const cookie = await cookies();
    cookie.set('access_token', tokens.access_token ?? '', { httpOnly: true });
    cookie.set('refresh_token', tokens.refresh_token ?? '', {
      httpOnly: true,
    });
    cookie.set('token_type', tokens.token_type ?? '', { httpOnly: true });
    cookie.set('expiry_date', tokens.expiry_date?.toString() ?? '', {
      httpOnly: true,
    });
    cookie.set('id_token', tokens.id_token ?? '', { httpOnly: true });
    cookie.set('scope', tokens.scope ?? '', { httpOnly: true });

    const html = `
      <html>
        <script>
          window.close();
        </script>
      </html>
    `;

    return new Response(html, { headers: { 'Content-Type': 'text/html' } });
  } catch (error) {
    console.log(error);
    return new Response('Error retrieving access token', { status: 500 });
  }
}
