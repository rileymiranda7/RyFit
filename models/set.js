/**
 * A Set is an object representing one row in a
 * table of Sets. This table (array) of Sets is
 * associated with a certain exercise
 */

class Set {
  constructor(
    setNumber,
    weight,
    reps,
    type, // "WORKING", "WARMUP", "DROPSET"
    status, // "COMPLETED", "FAILED", "IN PROGRESS"
    exerciseName,
    workoutId
  ) {
    this.setNumber = setNumber;
    this.weight = weight;
    this.reps = reps;
    this.exerciseName = exerciseName;
    this.workoutId = workoutId;
    this.type = type;
    this.status = status;
  }
}

export default Set;
