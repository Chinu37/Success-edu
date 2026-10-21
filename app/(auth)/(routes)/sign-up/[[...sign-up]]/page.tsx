import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className='animate-slide-in-bottom'>
      <SignUp appearance={{
        variables: {
          colorBackground: '#0F0F0F',
          colorText: 'white'
        }
      }} />
    </div>
  )

}