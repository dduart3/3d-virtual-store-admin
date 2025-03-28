export interface Section {
    id: string
    name: string
    model: {
      path: string
      position: [number, number, number]
      rotation: [number, number, number]
      scale: number | [number, number, number]
    }
    // Add other fields as needed
  }
  