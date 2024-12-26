<script lang="ts">
  import PreloadScene from './scenes/preload.ts'
  import GameScene from './scenes/game.ts'
  import Snake from './scenes/snake.ts'
  import Phaser from "phaser";
  import { onMount } from "svelte";

  let game: Phaser.Game;

  // Creating canvas for game
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

function preload (): void
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

let platforms;

function create(): void
{
  this.add.image(400, 300, 'sky');
  this.add.image(400, 300, 'star');

  platforms = this.physics.add.staticGroup();

platforms.create(400, 568, 'ground').setScale(2).refreshBody();

platforms.create(600, 400, 'ground');
platforms.create(50, 250, 'ground');
platforms.create(750, 220, 'ground');
}

function update(): void
{

}


  onMount(() => {
    game = new Phaser.Game({ ...config, parent: "phaser-container" });
    return () => {
      game.destroy(true);
    };
  });
</script>

<div id="phaser-container"></div>

<style>

</style>
