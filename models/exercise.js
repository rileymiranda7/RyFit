export class Exercise {
  constructor(
    name, restTime, setTimerOn, notes, maxWeight, maxWeightDate, 
    maxReps, maxRepsDate, maxVolume, maxVolumeDate
    ) {
    this.name = name;
    this.restTime = restTime;
    this.setTimerOn = setTimerOn;
    this.notes = notes;
    this.maxWeight = maxWeight;
    this.maxWeightDate = maxWeightDate;
    this.maxReps = maxReps;
    this.maxRepsDate = maxRepsDate;
    this.maxVolume = maxVolume;
    this.maxVolumeDate = maxVolumeDate;
  }
}
