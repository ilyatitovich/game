import Phaser from 'phaser'

export default class SnakeGameScene extends Phaser.Scene {
  private snake: Phaser.GameObjects.Group
  private food!: Phaser.GameObjects.Rectangle
  private direction: Phaser.Math.Vector2
  private newDirection: Phaser.Math.Vector2
  private score: number = 0
  private scoreText!: Phaser.GameObjects.Text

  private moveInterval: number = 150
  private lastMoveTime: number = 0

  constructor() {
    super('SnakeGameScene')
    this.direction = new Phaser.Math.Vector2(1, 0) // Start moving right
    this.newDirection = this.direction.clone()
  }

  create() {
    // Initialize snake
    this.snake = this.add.group()
    this.addSnakeSegment(400, 300) // Initial snake head

    // Add food
    this.spawnFood()

    // Add score text
    this.scoreText = this.add.text(10, 10, 'Score: 0', {
      fontSize: '20px',
      color: '#fff'
    })

    // Set up keyboard controls
    this.input.keyboard.on('keydown', this.handleInput, this)
  }

  update(time: number) {
    if (time - this.lastMoveTime > this.moveInterval) {
      this.lastMoveTime = time
      this.moveSnake()

      // Check for collisions
      if (this.checkCollision()) {
        this.gameOver()
      }
    }
  }

  handleInput(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        if (this.direction.y === 0) this.newDirection.set(0, -1)
        break
      case 'ArrowDown':
        if (this.direction.y === 0) this.newDirection.set(0, 1)
        break
      case 'ArrowLeft':
        if (this.direction.x === 0) this.newDirection.set(-1, 0)
        break
      case 'ArrowRight':
        if (this.direction.x === 0) this.newDirection.set(1, 0)
        break
    }
  }

  moveSnake() {
    // Update direction
    this.direction = this.newDirection.clone()

    // Get head position
    const head = this.snake.getFirstAlive()
    if (!head) return
    const headPosition = head.getBounds()

    // Calculate new position
    const newHeadX = headPosition.x + this.direction.x * 20
    const newHeadY = headPosition.y + this.direction.y * 20

    // Add new head
    const newHead = this.addSnakeSegment(newHeadX, newHeadY)

    // Check if food is eaten
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        newHead.getBounds(),
        this.food.getBounds()
      )
    ) {
      this.food.destroy()
      this.spawnFood()
      this.score += 10
      this.scoreText.setText(`Score: ${this.score}`)
    } else {
      // Remove tail
      const tail = this.snake.getLast(true)
      if (tail) tail.destroy()
    }
  }

  addSnakeSegment(x: number, y: number): Phaser.GameObjects.Rectangle {
    const segment = this.add.rectangle(x, y, 20, 20, 0x00ff00).setOrigin(0)
    this.snake.add(segment)
    return segment
  }

  spawnFood() {
    const gridX = Phaser.Math.Between(0, 39) * 20
    const gridY = Phaser.Math.Between(0, 29) * 20

    this.food = this.add.rectangle(gridX, gridY, 20, 20, 0xff0000).setOrigin(0)
  }

  checkCollision(): boolean {
    const head = this.snake.getFirstAlive()
    if (!head) return false

    // Get head position
    const headBounds = head.getBounds()

    // Check for wall collision
    if (
      headBounds.x < 0 ||
      headBounds.x >= 800 ||
      headBounds.y < 0 ||
      headBounds.y >= 600
    ) {
      return true
    }

    // Check for self-collision
    const segments = this.snake.getChildren() as Phaser.GameObjects.Rectangle[]
    return segments.some(
      (segment, index) =>
        index > 0 &&
        Phaser.Geom.Intersects.RectangleToRectangle(
          headBounds,
          segment.getBounds()
        )
    )
  }

  gameOver() {
    this.scene.restart()
  }
}
