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
