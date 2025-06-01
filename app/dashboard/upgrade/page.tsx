import PricingPage from '@/components/PricingPage'
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

const Page = async () => {
  const user = await currentUser();
  const userId = user?.id ?? null; // Normalize undefined to null

  return (
    <div>
      <PricingPage userId={userId} />
    </div>
  )
}

export default Page;
