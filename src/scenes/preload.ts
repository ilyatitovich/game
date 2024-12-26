import Phaser from 'phaser'

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene')
  }

  preload() {
    // Loading assets
    this.load.image('playerCar', 'assets/player-car.png')
    this.load.image('enemyCar', 'assets/enemy-car.png')
    this.load.image('track', 'assets/track.png')
    this.load.image('point', 'assets/point.png')

    // Loading text
    const loadingText = this.add
      .text(400, 300, 'Loading...', {
        fontSize: '20px',
        color: '#fff'
      })
      .setOrigin(0.5)

    // Simulating loading progress
    this.load.on('progress', progress => {
      loadingText.setText(`Loading... ${Math.round(progress * 100)}%`)
    })
  }

  create() {
    // Start the game scene
    this.scene.start('GameScene')
  }
}
