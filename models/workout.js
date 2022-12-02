export class Workout {
  constructor(workoutId, dateShort, dateFull, startTime, duration, name) {
    this.workoutId = workoutId;
    this.dateShort = dateShort;
    this.dateFull = dateFull;
    this.startTime = startTime;
    this.duration = duration;
    this.name = name;
  }
}