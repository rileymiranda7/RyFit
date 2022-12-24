import * as SQLite from "expo-sqlite";
import { 
  fetchExerciseNumberInRoutine, 
  fetchExercisesFromPastWorkout, 
  fetchSetsFromExerciseInstance } from "./fetchFunctions";
import { updateRoutineOrder, updateSetOrder } from "./updateFunctions";
const database = SQLite.openDatabase("RyFit.db");

export async function deleteExerciseFromRoutine(
  exerciseName, routineName, newExerciseOrder
) {
  const exerciseToDeletePosition = await fetchExerciseNumberInRoutine(
    routineName, exerciseName
  );
  await updateRoutineOrder(
    routineName, newExerciseOrder, false, exerciseToDeletePosition
  );
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM routineExerciseBridge 
        WHERE exerciseName = ? 
        AND routineName = ?`,
        [exerciseName, routineName],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function deleteRoutineFromRoutineExerciseBridge(routineName) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM routineExerciseBridge WHERE routineName = ?`,
        [routineName],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function deleteRoutineFromRoutines(routineName) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM routines WHERE routineName = ?`,
        [routineName],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export async function deleteRoutine(routineName) {
  await deleteRoutineFromRoutineExerciseBridge(routineName);
  await deleteRoutineFromRoutines(routineName);
}

export async function deleteWorkout(workoutId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM workouts WHERE workoutId = ?`,
        [workoutId],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export async function deleteIncompleteSetsFromWorkout(workoutId) {
  // get names of each exercise instance from workout
  const exerList = await fetchExercisesFromPastWorkout(workoutId);
  Promise.all(
    exerList.map(async (e) => {
      // for each array of sets belonging to each exercise, get set indices 
      // for sets in progress in order to delete these sets
      let finalSetArr;
      const sets = await fetchSetsFromExerciseInstance(
        e.exerciseName, workoutId);
      let setNumsToDelete = [];
      for (let set of sets) {
        if (set.status === "IN PROGRESS") {
          setNumsToDelete.push(set.setNumber);
        }
      }
      // delete each set in progress and update order each time
      // work off up to date set array using finalSetArr
      finalSetArr = [...sets];
      if (setNumsToDelete.length > 0) {
        setNumsToDelete.map(async (setNumToDelete) => {
          let temp = finalSetArr;
          temp.splice(setNumToDelete - 1, 1);
          let newSetsArr = temp.map((set) => {
            if (set.setNumber > setNumToDelete) {
              return {
                ...set,
                setNumber: set.setNumber - 1,
              };
            } else {
              return set;
            }
          });
          finalSetArr = newSetsArr;
        });
      }
      await deleteAllSetsFromCurrentExercise(workoutId, e.exerciseName);
      await updateSetOrder(workoutId, e.exerciseName, finalSetArr);
    })
  );
}

export async function deleteAllSetsFromWorkout(workoutId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM sets WHERE workoutId = ?;`,
        [workoutId],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export async function deleteSet(
  workoutId, exerciseName, setNumberToBeDeleted
) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM sets WHERE workoutId = ?
        AND exerciseName = ?
        AND setNumber = ?;`,
        [workoutId, exerciseName, setNumberToBeDeleted],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export async function deleteAllSetsFromCurrentExercise(
  workoutId, exerciseName
) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM sets WHERE workoutId = ?
        AND exerciseName = ?;`,
        [workoutId, exerciseName],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export async function deleteExerciseInstancesWithNoCompletedSets(
  workoutId, exerciseList
) {
  await Promise.all(
    exerciseList.map(async (exercise) => {
      let exerHasCompletedSet = false;
      const sets = await fetchSetsFromExerciseInstance(
        exercise.name, workoutId);
      for (let set of sets) {
        if (set.status === "COMPLETED") {
          exerHasCompletedSet = true;
          break;
        }
      }
      if (!exerHasCompletedSet) {
        await deleteExerciseInstance(exercise.name, workoutId);
      }
    })
  )
}

export function deleteExerciseInstance(exerciseName, workoutId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM exerciseInstances 
        WHERE exerciseName = ?
        AND workoutId = ?;`,
        [exerciseName, workoutId],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function deleteAllExerciseInstancesFromWorkout(workoutId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM exerciseInstances 
        WHERE workoutId = ?;`,
        [workoutId],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}