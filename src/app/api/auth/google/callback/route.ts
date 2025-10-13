import path from 'path';
import process from 'process';
import { google } from 'googleapis';
import { readFile } from 'fs/promises';
import { NextRequest } from 'next/server';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  const fileBuffer = await readFile(CREDENTIALS_PATH);
  const file = JSON.parse(fileBuffer.toString());

  const { client_secret, client_id, redirect_uris } = file.web;

  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris,
  );

  const res = await oauth2Client.getToken(code || '');
  console.log('res from google: ', res);

  const payload = res.tokens;
  const html = `
    <script>
      window.opener.postMessage(${JSON.stringify(payload)}, window.origin);
      window.close();
    </script>
  `;
  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}
