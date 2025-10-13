import { gmail_v1 } from 'googleapis';
import { getAccessTokenFromLocalStorage } from './misc';

export async function fetchGmailMessages(): Promise<string[]> {
  const res = await fetch(`/api/gmail`, {
    headers: {
      Authorization: await getAccessTokenFromLocalStorage(),
    },
  });
  return res.json();
}
export async function fetchGmailMessageById(msgId: string) {
  const res = await fetch(`/api/gmail/${msgId}`, {});
}
