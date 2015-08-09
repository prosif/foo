07/24/15 Coquette adds all entities into collision checking performing n^2
checks. Only entities setup for collision should be added to collision pairs.
This is likely to make a difference.

07/24/15 It might be nice to create an exists(var) function to check for
undefined/throw an error

07/24/15 If player has velocity, and user right-clicks the player will
continue with said velocity. It cannot be reversed ??.

07/24/15 It might be interesting to have a cloak behavior, where all enemies
lose sight of the target and continue heading along current trajectory. This
could allow for some awesome juking behavior.

07/24/15 (DONE) The exterior needs be tested to make sure bullets aren't surviving
past, if they go to fast.

07/25/15 Many patterns can be pulled out of the entities. For example, an
entities config object could have a requires array, used to test that all the
required settings were defined on the entity. A current pattern is just to
throw an error if a setting is undefined. 

07/25/15 It might be more fun if the enemies were slower to turn. It would
allow for the player to make more daring escapes. 

07/26/15 It would be cool to bind a key to a debug utility. Pressing (Z) would
console.log the value to debug! Combined with pause it could be really powerful

07/26/15 Bullet upgrades could allow for larger bullets which pass through
more enemies

07/31/15 We need a fonter module, to pull letters from an image, and draw
those as images. Otherwise calculating fonts using the standard canvas api is too
slow for an HUD

07/31/15 If the player pushes into the world boundary they slow down. In order
for the player to maintain constant speed, velocity is distributed in the
direction the player heads. `restrict` changes the players coordinates to be
within the boundaries effectively negating the velocity in the direction
facing the wall. As a result the velocity perpendicular to the wall with
magnitude less than the indended speed.

08/2/2015
To add: only pause on tab if not on splash screen
