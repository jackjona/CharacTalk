"use client";
import Link from "next/link";
// TODO: Build Homepage

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-8">
      <header className="bg-blue-600 text-white py-4 px-6 text-center text-xl font-bold shadow-md rounded-xl">
        Links To Characters
      </header>

      <main className="flex flex-col flex-1 w-full max-w-3xl bg-white rounded-lg shadow-lg p-4 mt-8 space-y-4 overflow-hidden">
        <Link
          href="/chat/58e1b5a0-099b-43b6-bc53-358c99b6e1a7"
          className="w-full bg-blue-400 rounded-lg"
        >
          Lucas Harrington
        </Link>
        <Link
          href="/chat/86a56fec-9946-4752-a31a-bfdd04a060d2"
          className="w-full bg-blue-400 rounded-lg"
        >
          Aiko Takahashi
        </Link>
      </main>
    </div>
  );
}
