import * as SQLite from "expo-sqlite";
const database = SQLite.openDatabase("RyFit.db");

import Set from "../../models/set"
import { 
  fetchExerciseRecords, 
  fetchSetsFromExerciseInstance, 
  fetchWorkoutDateShort } from "./fetchFunctions";
import { insertSet } from "./insertFunctions";

export async function updateWorkoutName(workoutId, name) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE workouts 
        SET name = ?
        WHERE workoutId = ?
        RETURNING name;`,
        [name, workoutId],
        (_, result) => {
          resolve(result.rows._array[0]);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export async function updateExerciseName(oldName, newName) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE exercises 
        SET exerciseName = ?
        WHERE exerciseName = ?;`,
        [newName, oldName],
        (_, result) => {
          resolve(result.rows._array[0]);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export async function updateWorkoutDuration(duration, workoutId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE workouts 
        SET duration = ?
        WHERE workoutId = ?
        RETURNING duration;`,
        [duration, workoutId],
        (_, result) => {
          resolve(result.rows._array[0]);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export async function updateRoutineOrder(
  routineName, newExerciseOrder, notDeletingExercise, exerciseToDeletePosition
  ) {
    if (notDeletingExercise) {
      await Promise.all(
        newExerciseOrder.map(async (exercise, index) => {
          await updateExerciseNumberInRoutine(
            routineName, exercise.name, index + 1);
        })
      );
    } else {
      await Promise.all(
        newExerciseOrder.map(async (exercise, index) => {
          if (index + 1 > exerciseToDeletePosition) {
            await updateExerciseNumberInRoutine(
              routineName, exercise.name, index);
          }
        })
      );
    }
}

export async function updateExerciseNumberInRoutine(
  routineName, exerciseName, newPositionInRoutine
  ) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE routineExerciseBridge 
        SET numberInRoutine = ?
        WHERE routineName = ?
        AND exerciseName = ?;`,
        [newPositionInRoutine, routineName, exerciseName],
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
export async function updateWorkoutExerciseOrder(
  newExerciseOrder, workoutId, notDeletingExercise, exerciseToDeletePosition
  ) {
    if (notDeletingExercise) {
      await Promise.all(
        newExerciseOrder.map(async (exerInst, index) => {
          await updateExerciseNumberInWorkout(
            workoutId, exerInst.exer.name, index + 1);
        })
      );
    } else {
      await Promise.all(
        newExerciseOrder.map(async (exerInst, index) => {
          if (index + 1 > exerciseToDeletePosition) {
            await updateExerciseNumberInWorkout(
              routineName, exerInst.exer.name, index);
          }
        })
      );
    }
}

export async function updateExerciseNumberInWorkout(
  workoutId, exerciseName, newPositionInWorkout
  ) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE exerciseInstances 
        SET numberInWorkout = ?
        WHERE workoutId = ?
        AND exerciseName = ?;`,
        [newPositionInWorkout, workoutId, exerciseName],
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

export async function updateSetNumberInExercise(
  workoutId, exerciseName, newSetNumber
  ) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE sets 
        SET setNumber = ?
        WHERE workoutId = ?
        AND exerciseName = ?;`,
        [newSetNumber, workoutId, exerciseName],
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

export async function updateSetWeight(
  setNumber, workoutId, exerciseName, newWeight) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE sets 
        SET weight = ?
        WHERE setNumber = ?
        AND workoutId = ?
        AND exerciseName = ?;`,
        [newWeight, setNumber, workoutId, exerciseName],
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

export async function updateSetReps(
  setNumber, workoutId, exerciseName, newReps) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE sets 
        SET reps = ?
        WHERE setNumber = ?
        AND workoutId = ?
        AND exerciseName = ?;`,
        [newReps, setNumber, workoutId, exerciseName],
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

export async function updateSetStatus(
  setNumber, workoutId, exerciseName, newStatus) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE sets 
        SET status = ?
        WHERE setNumber = ?
        AND workoutId = ?
        AND exerciseName = ?;`,
        [newStatus, setNumber, workoutId, exerciseName],
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

export async function updateSetType(
  setNumber, workoutId, exerciseName, newType) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE sets 
        SET type = ?
        WHERE setNumber = ?
        AND workoutId = ?
        AND exerciseName = ?;`,
        [newType, setNumber, workoutId, exerciseName],
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

export async function updateSetOrder(
  workoutId, exerciseName, newSetOrder) {
  await Promise.all(
    newSetOrder.map(async (set) => {
      const setObj = new Set(
        set.setNumber, set.weight, set.reps, set.type, 
        set.status, exerciseName, workoutId, set.isWeightRecord,
        set.isRepsRecord, set.isVolumeRecord, set.previous
      );
      await insertSet(setObj);
    })
  );
}

export async function updateExerciseRestTime(exerciseName, newRestTime) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE exercises 
        SET restTime = ?
        WHERE exerciseName = ?;`,
        [newRestTime, exerciseName],
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

export async function updateExerciseSetTimerOn(exerciseName, newStatus) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE exercises 
        SET setTimerOn = ?
        WHERE exerciseName = ?;`,
        [newStatus, exerciseName],
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

export async function updateExerciseNotes(newNotes, exerciseName) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE exercises 
        SET exerciseNotes = ?
        WHERE exerciseName = ?;`,
        [newNotes, exerciseName],
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

export async function updateExerInstNotes(newNotes, exerciseName, workoutId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE exerciseInstances 
        SET exerInstNotes = ?
        WHERE exerciseName = ?
        AND workoutId = ?;`,
        [newNotes, exerciseName, workoutId],
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

export async function updateRecords(
  workoutId, exerciseList
) {
  await Promise.all(
    exerciseList.map(async (exercise) => {
      const dateSqlResult = await fetchWorkoutDateShort(workoutId);
      const date = dateSqlResult[0].dateShort;
      const records = await fetchExerciseRecords(exercise.name);
      let { maxWeight, maxVolume, maxReps } = records[0];
      const sets = await fetchSetsFromExerciseInstance(
        exercise.name, workoutId);
      for (let set of sets) {
        if (set.status === "COMPLETED") {
          if (set.weight > maxWeight && set.reps !== 0) {
            maxWeight = set.weight
            await removeWeightRecord(exercise.name);
            await updateExerciseMaxWeight(set.weight, date, exercise.name);
            await updateIsWeightRecord(
              1, exercise.name, workoutId, set.setNumber)
          }
          if (set.reps > maxReps) {
            maxReps = set.reps;
            await removeRepsRecord(exercise.name);
            await updateExerciseMaxReps(set.reps, date, exercise.name);
            await updateIsRepsRecord(
              1, exercise.name, workoutId, set.setNumber)
          }
          if ((set.weight * set.reps) > maxVolume) {
            maxVolume = set.weight * set.reps
            await removeVolumeRecord(exercise.name);
            await updateExerciseMaxVolume(
              (set.weight * set.reps), date, exercise.name);
            await updateIsVolumeRecord(
              1, exercise.name, workoutId, set.setNumber)
          } 
        }
      }
    })
  );
}

export async function updateExerciseMaxWeight(
  newMaxWeight, newMaxWeightDate, exerciseName) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE exercises 
        SET maxWeight = ?,
        maxWeightDate = ?
        WHERE exerciseName = ?;`,
        [newMaxWeight, newMaxWeightDate, exerciseName],
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

export async function updateExerciseMaxReps(
  newMaxReps, newMaxRepsDate, exerciseName) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE exercises 
        SET maxReps = ?,
        maxRepsDate = ?
        WHERE exerciseName = ?;`,
        [newMaxReps, newMaxRepsDate, exerciseName],
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

export async function updateExerciseMaxVolume(
  newMaxVolume, newMaxVolumeDate, exerciseName) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE exercises 
        SET maxVolume = ?,
        maxVolumeDate = ?
        WHERE exerciseName = ?;`,
        [newMaxVolume, newMaxVolumeDate, exerciseName],
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

export async function updateIsWeightRecord(
  isWeightRecord, exerciseName, workoutId, setNumber) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE sets 
        SET isWeightRecord = ?
        WHERE exerciseName = ?
        AND workoutId = ?
        AND setNumber = ?;`,
        [isWeightRecord, exerciseName, workoutId, setNumber],
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

export async function updateIsRepsRecord(
  isRepsRecord, exerciseName, workoutId, setNumber) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE sets 
        SET isRepsRecord = ?
        WHERE exerciseName = ?
        AND workoutId = ?
        AND setNumber = ?;`,
        [isRepsRecord, exerciseName, workoutId, setNumber],
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

export async function updateIsVolumeRecord(
  isVolumeRecord, exerciseName, workoutId, setNumber) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE sets 
        SET isVolumeRecord = ?
        WHERE exerciseName = ?
        AND workoutId = ?
        AND setNumber = ?;`,
        [isVolumeRecord, exerciseName, workoutId, setNumber],
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
export async function removeWeightRecord(exerciseName) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE sets 
        SET isWeightRecord = 0
        WHERE isWeightRecord = 1
        AND exerciseName = ?;`,
        [exerciseName],
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

export async function removeRepsRecord(exerciseName) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE sets 
        SET isRepsRecord = 0
        WHERE isRepsRecord = 1
        AND exerciseName = ?;`,
        [exerciseName],
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

export async function removeVolumeRecord(exerciseName) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE sets 
        SET isVolumeRecord = 0
        WHERE isVolumeRecord = 1
        AND exerciseName = ?;`,
        [exerciseName],
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