/**
 * A Set is an object representing one row in a
 * table of Sets. This table (array) of Sets is
 * associated with a certain exercise
 */

class Set {
  constructor(
    setNumber,
    weightDone,
    repsCompleted,
    type, // "WORKING", "WARMUP", "DROPSET"
    status // "COMPLETED", "FAILED", "IN PROGRESS"
  ) {
    this.setNumber = setNumber;
    this.weightDone = weightDone;
    this.repsCompleted = repsCompleted;
  }
}

export default Set;
