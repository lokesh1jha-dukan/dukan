import { LoadingSpinner } from '@/components/ui/loading-spinner'
import React from 'react'

type Props = {}

export default function loading({}: Props) {
  return (
    <div className='w-full h-screen flex items-center justify-center'><LoadingSpinner/></div>
  )
}