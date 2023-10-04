import './style.css'
import { BLOCK_SIZE, BOARD_HEIGHT, BOARD_WITH } from './public/const'

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const $score = document.querySelector('span')

let SCORE = 0

canvas.width = BLOCK_SIZE * BOARD_WITH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)

// 3. board
const board = CreateBoard(BOARD_WITH, BOARD_HEIGHT)

function CreateBoard (width, height) {
  return Array(height).fill().map(() => Array(width).fill(0))
}

// 4. Pieza player
const piece = {
  position: { x: 5, y: 5 },
  shape: [
    [1, 1],
    [1, 1]
  ]
}

// 9. random piece  prueba de nueva rama 3 
const PIECES = [
  [
    [1, 1],
    [1, 1]
  ],
  [
    [1, 1, 1, 1]
  ],
  [[0, 1, 0],
    [1, 1, 1]],
  [
    [1, 0],
    [1, 0],
    [1, 1]
  ],
  [
    [1, 0],
    [1, 1],
    [0, 1]
  ],
  [
    [0, 1],
    [1, 1],
    [1, 0]
  ],
  [
    [0, 1],
    [0, 1],
    [1, 1]
  ]
]

// 2. game loop

// function update () {
//   draw()
//   window.requestAnimationFrame(update)
// }

// 8. auto drop
let dropcounter = 0
let lastTime = 0

function update (time = 0) {
  const deltatime = time - lastTime
  lastTime = time
  dropcounter += deltatime

  if (dropcounter > 1000) {
    piece.position.y++
    dropcounter = 0
    if (checkCollision()) {
      piece.position.y--
      solidfypiece()
      removeRows()
    }
  }

  draw()
  window.requestAnimationFrame(update)
}

function draw () {
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = 'yellow'
        context.fillRect(x, y, 1, 1)
      }
    })
  })

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = 'red'
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1)
      }
    })
  })
  $score.innerText = SCORE
}

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') {
    piece.position.x--
    if (checkCollision()) {
      piece.position.x++
    }
  }
  if (event.key === 'ArrowRight') {
    piece.position.x++
    if (checkCollision()) {
      piece.position.x--
    }
  }
  if (event.key === 'ArrowDown') {
    piece.position.y++
    if (checkCollision()) {
      piece.position.y--
      solidfypiece()
      removeRows()
    }
  }
  if (event.key === 'ArrowUp') {
    const rotated = []
    for (let i = 0; i < piece.shape[0].length; i++) {
      const row = []
      for (let j = piece.shape.length - 1; j >= 0; j--) {
        row.push(piece.shape[j][i])
      }
      rotated.push(row)
    }
    const previousShape = piece.shape
    piece.shape = rotated
    if (checkCollision()) {
      piece.shape = previousShape
    }
  }
})

function checkCollision () {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value !== 0 &&
         board[y + piece.position.y]?.[x + piece.position.x] !== 0
      )
    })
  })
}

function solidfypiece () {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        board[y + piece.position.y][x + piece.position.x] = 1
      }
    })
  })

  piece.position.x = Math.floor(BOARD_WITH / 2)
  piece.position.y = 0

  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)]

  if (checkCollision()) {
    window.alert('Game over!! Sorry')
    board.forEach((row) => row.fill(0))
  }
}

function removeRows () {
  const rowsToRemove = []

  board.forEach((row, y) => {
    if (row.every(value => value === 1)) {
      rowsToRemove.push(y)
    }
  })
  rowsToRemove.forEach(y => {
    board.splice(y, 1)
    const newRow = Array(BOARD_WITH).fill(0)
    board.unshift(newRow)
    SCORE += 10
  })
}

const $section = document.querySelector('section')

$section.addEventListener('click', () => {
  update()
  $section.remove()
  const audio = new window.Audio('./tetris.mp3')
  audio.volume = 0.5
  audio.play()
}
)
