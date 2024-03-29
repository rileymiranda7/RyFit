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
    type, // "WORKING", "WARMUP"
    status, // "COMPLETED", "FAILED", "IN PROGRESS"
    exerciseName,
    workoutId,
    isWeightRecord,
    isRepsRecord,
    isVolumeRecord,
    previous

  ) {
    this.setNumber = setNumber;
    this.weight = weight;
    this.reps = reps;
    this.exerciseName = exerciseName;
    this.workoutId = workoutId;
    this.type = type;
    this.status = status;
    this.isWeightRecord = isWeightRecord;
    this.isRepsRecord = isRepsRecord;
    this.isVolumeRecord = isVolumeRecord;
    this.previous = previous;
  }
}

export default Set;
