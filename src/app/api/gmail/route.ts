import { google } from 'googleapis';

export async function GET(req: Request) {
  const access_token = req.headers.get('authorization')?.split(' ')[1];

  if (!access_token) {
    return new Response('Missing tokens', { status: 400 });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({
    access_token,
  });
  const gmail = google.gmail({ version: 'v1', auth });
  try {
    const { data } = await gmail.users.messages.list({ userId: 'me' });

    const messageIds = data.messages?.map((msg) => msg.id);

    return Response.json(messageIds);
  } catch (err) {
    console.log('err while login: ', err);
    return new Response('Error accessing Gmail API', { status: 500 });
  }
}
