export function getAccessTokenFromLocalStorage(): Promise<string> {
  return new Promise((resolve, reject) => {
    const access_token = localStorage.getItem('access_token');
    const token_type = localStorage.getItem('token_type');
    const expiry_date = localStorage.getItem('expiry_date');
    if (access_token && token_type && expiry_date) {
      if (Date.now() >= parseInt(expiry_date)) {
        reject('access token expired refresh using refresh token');
      } else {
        resolve(`${token_type} ${access_token}`);
      }
    } else {
      reject('no access token found');
    }
  });
}
