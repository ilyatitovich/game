<script lang="ts">
  import Phaser from "phaser";
  import { onMount } from "svelte";

  let game: Phaser.Game;

  // Creating canvas for game
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    backgroundColor: "#87ceeb",
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 30 },
      },
    },
    scene: {
      preload,
      create,
      update,
    },
  };

  let player: Phaser.Physics.Arcade.Sprite;
  let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  let stars: Phaser.Physics.Arcade.Group;

  // Loading all assets for game
  function preload(this: Phaser.Scene): void {
    this.load.setBaseURL("https://labs.phaser.io");
    this.load.image("sky", "assets/skies/space3.png");
    this.load.image("star", "assets/demoscene/star.png");
    this.load.image("platform", "assets/sprites/platform.png");
  }

  //
  function create(this: Phaser.Scene): void {
    this.add.image(400, 300, "sky");

    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 590, "platform").setScale(2).refreshBody();

    player = this.physics.add.sprite(400, 500, "star");
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
      key: "star",
      repeat: 5,
      setXY: { x: 12, y: 0, stepX: 150 },
    });

    stars.children.iterate((child) => {
      const star = child as Phaser.Physics.Arcade.Sprite;
      star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, undefined, this);
  }

  function update(this: Phaser.Scene): void {
    if (cursors.left?.isDown) {
      player.setVelocityX(-160);
    } else if (cursors.right?.isDown) {
      player.setVelocityX(160);
    } else {
      player.setVelocityX(0);
    }
  }

  function collectStar(
    player: Phaser.GameObjects.GameObject,
    star: Phaser.GameObjects.GameObject
  ): void {
    (star as Phaser.Physics.Arcade.Sprite).disableBody(true, true);
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
