import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className='animate-slide-in-top'>
      <SignIn appearance={{
        variables: {
          colorBackground: '#0F0F0F',
          colorText: 'white'
        }
      }} />
    </div>
  )
}