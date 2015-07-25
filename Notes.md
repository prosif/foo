07/24/15 Coquette adds all entities into collision checking performing n^2
checks. Only entities setup for collision should be added to collision pairs.
This is likely to make a difference.

07/24/15 It might be nice to create an exists(var) function to check for
undefined/throw an error
