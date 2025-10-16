'use client';

export default function LoginPage() {
  async function handleLogin() {
    const res = await fetch('/api/auth/login');
    const { url }: { url: URL } = await res.json();
    window.open(url, 'google-oauth', 'width=500,height=600');
  }
  return (
    <div className="flex justify-center items-center flex-col min-h-screen">
      <div className="border w-xl p-20 space-y-8">
        <div className="">
          <button
            className="px-6 py-3 w-full border hover:cursor-pointer"
            onClick={handleLogin}
          >
            signin with google
          </button>
        </div>
        <div>
          <input
            className="border px-4 py-2 w-full"
            placeholder="Enter gemini api key"
          />
        </div>
      </div>
    </div>
  );
}
