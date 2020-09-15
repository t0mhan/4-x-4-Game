# 4-x-4-Game
The game can be played using arrow keys. The game reflects the following rules:
* The playing field consists of 4 x 4 fields
* Each field is initialized randomly with the value EMPTY, 1 or 2
* The player can move the playing field with the cursor keys Left, Right, Up, Down.
* Hereby each field moves one field in the corresponding direction. It applies:
  * A field cannot be moved beyond the edge of the playing field.
  * A field cannot move into its direction, if the field in the corresponding direction is already occupied and does not have the same value.
  * A field can be moved to another field if both values of the fields are identical.
  * If this happens, one field is removed and the value of the other field is doubled.

* After each move, a 1 or 2 is randomly added at the opposite edge of the move direction, on an empty field.
* The game is over when there are no more valid moves