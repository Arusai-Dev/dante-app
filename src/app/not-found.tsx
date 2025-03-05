import Link from 'next/link'

export default function NotFound() {
    return (
        <div className='w-full h-screen flex flex-col justify-center items-center'>
            <h1 className=' text-5xl font-bold'>Not found – 404!</h1>
            <div className=' mt-4 text-[1.2rem]'>
                <Link href="/">Go back to Home</Link>
            </div>
        </div >
    )
}