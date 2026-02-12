import React from 'react'
import { CollaborationHeader } from '@/components/collaboration/collaboration-header'
import { CollaborationLeftSidebar } from '@/components/collaboration/collaboration-left-sidebar'
import { CollaborationRightSidebar } from '@/components/collaboration/collaboration-right-sidebar'
import { NetworkGraph } from '@/components/collaboration/network-graph'

export default function CollaborationPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground font-display">
      <CollaborationHeader />
      <main className="flex-1 flex relative overflow-hidden">
        <CollaborationLeftSidebar />
        <NetworkGraph />
        <CollaborationRightSidebar />
      </main>
    </div>
  )
}
