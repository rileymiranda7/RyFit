export class Exercise {
  constructor(
    name, restTime, notes, maxWeight, maxWeightDate, 
    maxReps, maxRepsDate, maxVolume, maxVolumeDate
    ) {
    this.name = name;
    this.restTime = restTime;
    this.notes = notes;
    this.maxWeight = maxWeight,
    this.maxWeightDate = maxWeightDate,
    this.maxReps = maxReps,
    this.maxRepsDate = maxRepsDate,
    this.maxVolume = maxVolume,
    this.maxVolumeDate = maxVolumeDate
  }
}
