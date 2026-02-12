import React from 'react'

interface ConnectionProps {
  x1: number
  y1: number
  x2: number
  y2: number
  active?: boolean
}

export function ConnectionComponent({ x1, y1, x2, y2, active }: ConnectionProps) {
  // Calculate control points for a smooth curve
  // Control points should be offset horizontally to create a "wire" look
  // Adjust curvature based on distance
  const dist = Math.abs(x2 - x1)
  const curvature = Math.max(dist * 0.5, 50)

  const cp1x = x1 + curvature
  const cp1y = y1
  const cp2x = x2 - curvature
  const cp2y = y2

  const path = `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`

  return (
    <g className="pointer-events-none">
        {/* Shadow/Outline for better visibility */}
        <path
            d={path}
            fill="none"
            stroke="black"
            strokeWidth={active ? 5 : 3}
            strokeOpacity={0.2}
            strokeLinecap="round"
        />
        {/* Main Line */}
        <path
            d={path}
            fill="none"
            stroke={active ? "#11a4d4" : "#11a4d4"}
            strokeWidth={active ? 3 : 2}
            strokeOpacity={active ? 1 : 0.4}
            className="transition-all duration-300"
            style={{ filter: active ? 'drop-shadow(0 0 4px rgba(17, 164, 212, 0.5))' : 'none' }}
            strokeLinecap="round"
        />
    </g>
  )
}
