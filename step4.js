function Spider(options) {
  jaws.Sprite.call(this, options);
  var animation = new jaws.Animation({sprite_sheet: "spider_8x5.bmp", frame_size: [8,5], frame_duration: 20, scale_image: 2});
  this.setImage( animation.frames[0] );
  this.vy = 0;
  this.vx = 0;

  var self=this;

  this.update = function() {
    if(self.vy < 5) self.vx = -2;
    self.setImage( animation.next() )
  }
}

function PixelMapExample() {
  var anim = new jaws.Animation({sprite_sheet: "droid_11x15.png", frame_duration: 100, scale_image: 2});
  var player = new jaws.Sprite({x:100, y:200, anchor: "bottom_center"});
  var pixel_map = new jaws.PixelMap({image: "pixel_map_alpha.png", scale_image: 3});
  var viewport = new jaws.Viewport({max_x: pixel_map.width, max_y: pixel_map.height});

  var spiders = [];
  spiders.push( new Spider({x: 140, y: 10}) );
  spiders.push( new Spider({x: 440, y: 10}) );
  spiders.push( new Spider({x: 540, y: 10}) );

  pixel_map.nameColor("air", pixel_map.at(0,0));
  pixel_map.nameColor("ground", [0,0,0,255]);

  player.anim_rest = anim.slice(0,5);
  player.anim_left = anim.slice(10,12);
  player.anim_right = anim.slice(12,14);

  this.setup = function() {
    player.vx = player.vy = 0;
    jaws.preventDefaultKeys("up", "down", "left", "right", "space")
  }

  this.update = function() {
    player.setImage(player.anim_rest.next());
    if(jaws.pressed("right d")) { 
      player.vx = 2; 
      player.setImage(player.anim_right.next()); 
    }
    if(jaws.pressed("left a"))  { 
      player.vx = -2; 
      player.setImage(player.anim_left.next()); 
    }
    if(jaws.pressedWithoutRepeat("up")) { player.vy = -7; }

    if(jaws.pressedWithoutRepeat("esc")) { 
      jaws.switchGameState( new jaws.game_states.Edit({constructors: [Spider], grid_size: [2,2], game_objects: spiders, url: "/game_objects"}) )
    }

    updatePhysics(player);
    spiders.forEach(updatePhysics);

    jaws.update(spiders);
  }

  this.draw = function() {
    jaws.fill("blue");                      // Fill in background
    viewport.apply( function() {            // Everthing within viewport.apply is offsetted correctly
      jaws.draw(player, pixel_map, spiders) // Paint player first to put it behind grass/water
    });
    viewport.centerAround(player);
  }

  function updatePhysics(sprite) {
    sprite.vy += 0.3;
    if(sprite.vy > 5) sprite.vy = 5;

    /*
     * We need to:
     * - Step 1 pixel at the time checking for collisions
     * - Be able to step both forward (+) and backwards (-)
     * - Be able to tell if we collided while moving vertical or horizontal (see collided)
     */
    var collided = sprite.stepToWhile(sprite.x + sprite.vx, sprite.y + sprite.vy, function(sprite) {
      return !pixel_map.namedColorAtRect("ground", sprite.rect())
    });

    /*
     * If we collided while moving vertically and had a vertical velocity, enable jumping again
     */
    if(collided.y) {
      if(sprite.vy > 0) sprite.can_jump = true;
      sprite.vy = 0;
    }

    if(collided.x && sprite.vx != 0) {
      var saved_position = [sprite.x, sprite.y];
      var try_y = sprite.y - 5;
      var collided = sprite.stepToWhile(sprite.x + sprite.vx, try_y, function(sprite) {
        if(sprite.y != try_y) return true;
        return !pixel_map.namedColorAtRect("ground", sprite.rect())
      });

      if(collided.x || collided.y) { 
        sprite.moveTo(saved_position) 
      }
    }

    sprite.vx = 0;
  }
}

jaws.onload = function() {
  Spider.prototype = jaws.Sprite.prototype;
  jaws.assets.add("droid_11x15.png", "pixel_map_alpha.png", "spider_8x5.bmp");
  jaws.start(PixelMapExample, {width: 900, height: 300});
}

