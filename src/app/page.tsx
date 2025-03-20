import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to Spotify Tracker</h1>
      <div className="flex gap-6">
        <Link
          href="/register"
          className="px-6 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
        >
          Register
        </Link>
        <Link
          href="/login"
          className="px-6 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          Login
        </Link>
      </div>
    </main>
  );
}
