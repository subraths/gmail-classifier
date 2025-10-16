import { getAccessTokenFromLocalStorage } from './misc';

export async function fetchGmailMessages(): Promise<
  { id: string; message: string }[]
> {
  const res = await fetch(`/api/gmail?max-results=100`, {
    headers: {
      Authorization: await getAccessTokenFromLocalStorage(),
    },
  });
  return res.json();
}
export async function fetchGmailMessageById(msgId: string) {
  const res = await fetch(`/api/gmail/${msgId}`, {});
  return res.json();
}
