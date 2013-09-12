function Game() {
  var player = new Player({x: 120, y: 150});
  var world = new World({image: "pixel_map_alpha.png"});
  var viewport = new jaws.Viewport({max_x: world.pixel_map.width, max_y: world.pixel_map.height});

  var bombs = [];
  var spiders = [];

  spiders.push( new Spider({x: 110, y: 30}) );
  spiders.push( new Spider({x: 440, y: 10}) );
  spiders.push( new Spider({x: 540, y: 10}) );

  this.setup = function() {
    player.vx = player.vy = 0;
    jaws.preventDefaultKeys("up", "down", "left", "right", "space")
  }

  this.update = function() {
    if(jaws.pressed("right d")) { player.vx = 2 }
    if(jaws.pressed("left a"))  { player.vx = -2 }
    if(jaws.pressedWithoutRepeat("up")) { player.vy = -7 }
    if(jaws.pressedWithoutRepeat("ctrl")) {
      var bomb = new Bomb({x: player.x, y: player.y - player.height, vx: player.vx * 4, vy: -8 })
      bombs.push( bomb )
    }

    if(jaws.pressedWithoutRepeat("esc")) { 
      var game_state = new jaws.game_states.Edit({constructors: [Spider], grid_size: [2,2], game_objects: spiders, url: "/game_objects"})
      jaws.switchGameState( game_state )
    }

    // Update gamelogic, animations etc.
    jaws.update(player, spiders, bombs);

    // Apply physics to player, all spiders and all bombs
    world.update(player, spiders, bombs);

    for(var i = 0; i < bombs.length; i++) {
      if(bombs[i].status == "exploded") {
        world.explodeBomb(bombs[i]);
        bombs.splice(i, 1);
      }
    }
  }

  this.draw = function() {
    jaws.fill("blue");                                    
    
    // Everything within viewport.apply is offseted correctly
    viewport.apply( function() {
      // Paint player and objects first to put it behind grass/water/etc
      jaws.draw(player, bombs, spiders, world.pixel_map)
    });

    viewport.centerAround(player);
  }
}

jaws.assets.add("droid_11x15.png", "pixel_map_alpha.png", "spider_8x5.bmp", "bomb_7x8.bmp");

jaws.start(Game, {width: 900, height: 300})

