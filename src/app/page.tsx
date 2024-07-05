import Link from "next/link";


export default function HomePage() {
  return (
    <main className="grid place-items-center h-svh">
      <ul className="flex flex-col gap-2">
        <Link href="/nextjs">
          <li className="underline">r/nextjs</li>
        </Link>
        <Link href="/reactjs">
          <li className="underline">r/reactjs</li>
        </Link>
        <Link href="/typescript">
          <li className="underline">r/typescript</li>
        </Link>
      </ul>
    </main>
  )
}