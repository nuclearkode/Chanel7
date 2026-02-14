import { Ingredient, ConnectionType } from "@/lib/types"

export type NodeType = 'ingredient' | 'accord' | 'output'

export interface NodeData {
  ingredient?: Ingredient
  label: string
  concentration?: number // Percentage in formula (calculated)
  items?: VisualNode[] // For accord/macro nodes
  color?: string
  description?: string
  olfactiveProfile?: { [key: string]: number } // Simple key-value for profile chart
  totalWeight?: number
  // Other potential data fields
}

export interface VisualNode {
  id: string
  type: NodeType
  data: NodeData
  position: { x: number; y: number }
  selected?: boolean
}

export interface Connection {
  id: string
  source: string
  target: string
  type: ConnectionType
  strength: number // 0-1
}

export interface DragItem {
  type: 'sidebar-ingredient' | 'canvas-node'
  data: Ingredient | VisualNode
}

export interface AccordGroup {
  id: string
  label: string
  nodeIds: string[]
  color?: string
}
