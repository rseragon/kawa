import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='h-full w-full flex items-center flex-col mt-40'>
      <p className='text-9xl font-bold'>404</p>
      <p className='font-mono font-semibold my-2'>Could not find requested resource</p>
      <Link href="/" className='shadow rounded-lg bg-lavender p-3 text-base m-4'>Return Home?</Link>
    </div>
  )
}
