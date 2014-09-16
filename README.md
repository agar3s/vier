vier
====

Game for the js13k challenge 2014, Fight against elemental enemies in a brutal pixelated world. 

Vier graphics are inspired in Old Atari videoGames that I played when I was a child, and the gameplay is inspired in beat'em ups like double dragon and fatal fury.

The game contains 6 different levels:

* The Beginning
* The Gate
* Air Palace
* Earth Palace
* Water & Fire Montains
* Grand Master Palace

5 different Kinds of enemies
and 7 final bosses

Every enemy has a different behaviour and different attributes depending on the level.

Could you defeat the game I made in less than 13kilobytes?

Preview:

![alt text](http://www.html5gamedevs.com/uploads/monthly_09_2014/post-7571-0-98461900-1410895144.gif "screenshot")

## Development

The project contains 3 utilities I made to create the sprites in the game:

* **spriteGenerator/index.html** is a web editor that allows you to create 16X16 one color sprites, also it allows you to add frames to preview different kind of animations.
* **transformSprites.js** is a script that transform .sprite files into enconded strings that are used by the game.
* **animator.js** is another script that takes more than one sprite and describes an animation following the [xor algorithm](http://aweeklyproject.tumblr.com/post/96357132658/js13kgames-week-2-animations-powers-build-system) to animate my special sprites.

**sprites** is a directory where I put all my generated sprites.

**animations** is a directory where the generated animations are placed.

To build the project I used **gulp**, the script concatenates and uglify the code I made in js, also it zipped in one single file.

I had a small server only to serve my game and test it locally with friends < index.html>

**dist** is a directory that contains the uglified version of the game.

**app** directory contains all the sources of the game:

* **js/initializers.js** contains all the declarations of the variables of the game, also it initialize the canvas context and sets default values for the screen.
* **js/keyEvents.js** adds the key listeners for the game.
* **js/elements.js** contains the core logic behind the elements ratio attacks and power.
* **js/particles.js** It is used as effects for backgrounds and character deaths.
* **js/sprites.js** has the different images and frames used in the game as encoded strings.
* **js/sprite.js** contains the logic to transform and animate encoded strings into graphics and manage it into the canvas
* **js/platform.js** is the responsible to draw the platforms of the game and also validates the collisions.
* **js/powers.js** contains the logic of the element powers like collisions and movement into the level. 
* **js/booster.js** contains the logic of the booster packages
* **js/enemyBook.js** describes the logic of every enemy in the game, it's graphics, behaviour and attributes.
* **js/enemies.js** is the class for the enemy character, contains the hole logic to load the information from the enemy book. Also has the concrete implementations for every possible action that an enemy can do. 
* **js/levels.js** is the class responsible to load the platforms and enemies also generates enemies and validates when the level is ended.
* **js/levelGenerator.js** describes the different posibles levels in the game in an object, it contains too the logic to load a level when is restarted or initialized.
* **js/hero.js** is the class responsible to manage the hole behaviour of the hero.
* **js/screens.js** functions to draw the screens of the game
* **js/main.js** contains the gameLoop to update the variables and manage the differnt elements in the game

