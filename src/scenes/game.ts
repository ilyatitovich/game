import Phaser from 'phaser'

export default class GameScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Image
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private score: number = 0
  private scoreText!: Phaser.GameObjects.Text
  private enemies!: Phaser.Physics.Arcade.Group

  constructor() {
    super('GameScene')
  }

  create() {
    // Add track background
    this.add.tileSprite(400, 300, 800, 600, 'track')

    // Add player car
    this.player = this.physics.add.image(400, 500, 'playerCar').setScale(0.5)
    this.player.setCollideWorldBounds(true)

    // Add score text
    this.scoreText = this.add.text(10, 10, 'Score: 0', {
      fontSize: '20px',
      color: '#fff'
    })

    // Create enemies group
    this.enemies = this.physics.add.group()

    // Add keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys()

    // Spawn enemies periodically
    this.time.addEvent({
      delay: 1000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    })

    // Add collision detection
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.handleGameOver,
      undefined,
      this
    )
  }

  update() {
    // Player movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200)
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200)
    } else {
      this.player.setVelocityX(0)
    }

    // Update score
    this.score += 1
    this.scoreText.setText(`Score: ${this.score}`)
  }

  spawnEnemy() {
    const x = Phaser.Math.Between(100, 700)
    const enemy = this.enemies.create(x, 0, 'enemyCar').setScale(0.5)
    enemy.setVelocityY(200) // Move enemy downward
    enemy.setCollideWorldBounds(true)
    enemy.setBounce(1)
  }

  handleGameOver() {
    this.scene.restart() // Restart the game
  }
}
