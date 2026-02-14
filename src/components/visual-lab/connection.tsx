import React from 'react'
import { ConnectionType } from '@/lib/types'

interface ConnectionProps {
  x1: number
  y1: number
  x2: number
  y2: number
  active?: boolean
  type?: ConnectionType // 'boost' | 'suppress' | 'blend'
  strength?: number // 0-1, affects opacity/width
}

export function ConnectionComponent({ x1, y1, x2, y2, active, type = 'blend', strength = 0.5 }: ConnectionProps) {
  // Calculate control points for a smooth curve
  const dist = Math.abs(x2 - x1)
  const curvature = Math.max(dist * 0.5, 50)

  const cp1x = x1 + curvature
  const cp1y = y1
  const cp2x = x2 - curvature
  const cp2y = y2

  const path = `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`

  let color = '#11a4d4' // Default Cyan (Blend)
  let dashArray = 'none'

  if (type === 'boost') {
      color = '#22c55e' // Green
  } else if (type === 'suppress') {
      color = '#ef4444' // Red
      dashArray = '5, 5'
  }

  const opacity = active ? 1 : Math.max(0.3, strength)
  const width = active ? 3 : 1 + (strength * 2)

  return (
    <g className="pointer-events-none">
        {/* Shadow/Outline for better visibility */}
        <path
            d={path}
            fill="none"
            stroke="black"
            strokeWidth={width + 2}
            strokeOpacity={0.5}
            strokeLinecap="round"
        />
        {/* Main Line */}
        <path
            d={path}
            fill="none"
            stroke={color}
            strokeWidth={width}
            strokeOpacity={opacity}
            strokeDasharray={dashArray}
            className="transition-all duration-300"
            style={{
                filter: active ? `drop-shadow(0 0 4px ${color}80)` : 'none',
                vectorEffect: 'non-scaling-stroke'
            }}
            strokeLinecap="round"
        />
    </g>
  )
}
