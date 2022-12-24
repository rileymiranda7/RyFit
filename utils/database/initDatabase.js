import { 
  initRoutineExerciseBridge, 
  initExercises, 
  initRoutines,
  initWorkouts, 
  initSets, 
  initExerciseInstances
} from "./createTables";

export async function init() {
  await initRoutineExerciseBridge();
  await initExercises();
  await initRoutines();
  await initWorkouts();
  await initSets();
  await initExerciseInstances();
}