'use client'
import React from 'react'

const Page = () => {
  return (
    <div className="h-3/4 flex flex-col">
      <div className=" flex-1 flex gap-4 px-5 py-5">
        <div className="w-2/5 bg-gray-200 rounded">Sidebar</div>
        <div className="w-3/5 border border-gray-700 bg-white rounded">Main content</div>
      </div>
    </div>
  )
}

export default Page
