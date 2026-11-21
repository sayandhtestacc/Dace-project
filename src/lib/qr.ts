/**
 * DUK Hub — QR Code Generator (deterministic, no CDN)
 * Generates a simple QR-like matrix from a string seed.
 * This is a visual representation for the demo — not a standards-compliant QR encoder.
 */

function hashSeed(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return Math.abs(hash)
}

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

export interface QRMatrix {
  size: number
  modules: boolean[][]
  token: string
}

export function generateQRMatrix(studentId: string, timestamp: number): QRMatrix {
  const size = 21
  const token = `DUK-${studentId}-${Math.floor(timestamp / 30000).toString(36).toUpperCase()}`
  const hash = hashSeed(token)
  const rng = seededRandom(hash)
  
  const modules: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false)
  )

  // Finder patterns (top-left, top-right, bottom-left)
  const drawFinder = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isOuter = r === 0 || r === 6 || c === 0 || c === 6
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4
        modules[row + r][col + c] = isOuter || isInner
      }
    }
  }

  drawFinder(0, 0)
  drawFinder(0, size - 7)
  drawFinder(size - 7, 0)

  // Timing patterns
  for (let i = 7; i < size - 7; i++) {
    modules[6][i] = i % 2 === 0
    modules[i][6] = i % 2 === 0
  }

  // Data area — pseudo-random based on seed
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder areas and timing
      if ((r < 8 && c < 8) || (r < 8 && c >= size - 8) || (r >= size - 8 && c < 8)) continue
      if (r === 6 || c === 6) continue
      modules[r][c] = rng() > 0.5
    }
  }

  return { size, modules, token }
}

export function renderQRToSVG(matrix: QRMatrix, cellSize: number = 8): string {
  const { size, modules } = matrix
  const svgSize = size * cellSize + cellSize * 2
  const offset = cellSize

  let paths = ''
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (modules[r][c]) {
        const x = offset + c * cellSize
        const y = offset + r * cellSize
        const radius = cellSize * 0.15
        paths += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="${radius}" />`
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">
    <rect width="${svgSize}" height="${svgSize}" fill="white" rx="8" />
    <g fill="#11101D">${paths}</g>
  </svg>`
}
