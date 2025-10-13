import path from 'path';
import process from 'process';
import { google } from 'googleapis';
import { readFile } from 'fs/promises';
import { NextRequest } from 'next/server';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

export async function GET(req: NextRequest) {
  const fileBuffer = await readFile(CREDENTIALS_PATH);
  const file = JSON.parse(fileBuffer.toString());

  const { client_secret, client_id, redirect_uris } = file.web;

  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris,
  );

  const url = oauth2Client.generateAuthUrl({
    scope: SCOPES,
  });

  return Response.json({ url });
}
