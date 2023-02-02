import * as SQLite from "expo-sqlite";
const database = SQLite.openDatabase("RyFit.db");

import { Workout } from "../../models/workout";
import { Routine } from "../../models/routine";
import { Exercise } from "../../models/exercise";

/* FETCH FUNCTIONS */

export async function fetchRoutines() {
  const routineNames = await fetchRoutineNamesList();
  const getRoutines = async (result) => {
    let routines = [];
    for (const routineName of routineNames) {
      let routine = new Routine(routineName.routineName, []);
      for (const routineExercise of result.rows._array) {
        if (routineExercise.routineName === routineName.routineName) {
          const exercise = await fetchExercise(routineExercise.exerciseName);
          routine?.exercises?.push(exercise);
        }
      }
      routines.push(routine);
    }
    return routines;
  };
  const result = await fetchRoutineExercises();
  if (!result || result?.rows?._array < 0) {
    return [];
  }
  const routines = await getRoutines(result);
  return routines;
}

export async function fetchRoutine(routineName) {
  const getRoutine = async (result) => {
    let routine = new Routine(routineName, []);
    await Promise.all(
      result.rows._array.map(async (routineExercise) => {
        if (routineExercise.routineName === routineName) {
          const exercise = await fetchExercise(routineExercise.exerciseName);
          routine.exercises.push(exercise);
        }
      })
    );
    return routine;
  };
  const result = await fetchRoutineExercises();
  const routine = await getRoutine(result);
  return routine;
}

export async function fetchRoutineSize(routineName) {
  const routine = await fetchRoutine(routineName);
  return routine.exercises.length;
}

export async function fetchRoutineExercises() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM routineExerciseBridge
        ORDER BY numberInRoutine ASC;`,
        [],
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

export async function fetchExerciseNumberInRoutine(routineName, exerciseName) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT numberInRoutine FROM routineExerciseBridge
        WHERE routineName = ?
        AND exerciseName = ?;`,
        [routineName, exerciseName],
        (_, result) => {
          resolve(result.rows._array[0].numberInRoutine);
        },
        (_, error) => {
          reject(error);
        }
        );
      });
    });
    return promise;
  }

export async function fetchExercise(exerciseName) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM exercises WHERE exerciseName = ?`,
        [exerciseName],
        (_, result) => {
            const exercise = new Exercise(
              result?.rows?._array[0]?.exerciseName,
              result?.rows?._array[0]?.restTime,
              result?.rows?._array[0]?.setTimerOn,
              result?.rows?._array[0]?.exerciseNotes
              );
            resolve(exercise);
          },
          (_, error) => {
            reject(error);
          }
          );
        });
      });
  return promise;
}

export async function exerciseAlreadyExists(exerciseName) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM exercises WHERE exerciseName = ?`,
        [exerciseName],
        (_, result) => {
            resolve(result.rows._array.length > 0);
          },
          (_, error) => {
            reject(error);
          }
          );
        });
      });
  return promise;
}

export function fetchRoutineNamesList() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM routines ORDER BY dateCreated ASC;`,
        [],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
}

export function fetchExercises() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM exercises
        ORDER BY exerciseName;`,
        [],
        (_, result) => {
          const exercises = [];
          for (const e of result.rows._array) {
            exercises.push(
              new Exercise(
                e.exerciseName,
                e.restTime,
                e.setTimerOn,
                e.exerciseNotes,
                e.maxWeight,
                e.maxWeightDate,
                e.maxReps,
                e.maxRepsDate,
                e.maxVolume,
                e.maxVolumeDate
              )
            );
          }
          resolve(exercises);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export async function fetchWorkoutName(workoutId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT name FROM workouts
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

export async function fetchWorkoutDateShort(workoutId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT dateShort FROM workouts
        WHERE workoutId = ?;`,
        [workoutId],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
}

export async function workoutInProgress() {
  const workout = await fetchLastWorkout();
  // make sure workouts table exists and that 
  // last workout was not completed
  return workout?.workoutId && !workout?.duration;
}

export async function fetchActiveWorkout() {
  const workout = await fetchLastWorkout();
  const exersAndInsts = await fetchExersAndInstsFromPastWorkout(workout.workoutId);
  return { workout: workout, exersAndInsts: exersAndInsts};
}

export function fetchLastWorkout() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql( 
        `SELECT * FROM workouts
        ORDER BY timestamp DESC;`,
        [],
        (_, result) => {
          resolve(result.rows._array[0]);
        },
        (_, error) => {
          resolve(false);
        }
      );
    });
  });

  return promise;
}

export function fetchCompletedWorkouts() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql( 
        `SELECT * FROM workouts
        WHERE duration IS NOT NULL
        ORDER BY timestamp DESC;`,
        [],
        (_, result) => {
          const workouts = [];
          for (const w of result.rows._array) {
            workouts.push(
              new Workout(
                w.workoutId,
                w.dateShort,
                w.dateFull,
                w.startTime,
                w.duration,
                w.name
              )
            )
          }
          resolve(workouts);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function fetchSets() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM sets;`,
        [],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function fetchExercisesFromPastWorkout(workoutId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT exerciseName FROM exerciseInstances
        WHERE workoutId = ?
        ORDER BY numberInWorkout;`,
        [workoutId],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;

}

export function fetchExersAndInstsFromPastWorkout(workoutId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM
          (SELECT * FROM exerciseInstances
          WHERE workoutId = ?
          ORDER BY numberInWorkout) as insts
        INNER JOIN exercises
        ON exercises.exerciseName = insts.exerciseName
          ;`,
        [workoutId],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function fetchSetsFromExerciseInstance(exerciseName, workoutId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM sets
        WHERE exerciseName = ?
        AND workoutId = ?
        ORDER BY setNumber;`,
        [exerciseName, workoutId],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function fetchAllExerciseInstances() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM exerciseInstances;`,
        [],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function fetchAllSetsFromAllExerciseInstances(
  exerciseName, workoutIdToNotInclude) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT type, setNumber, weight, reps, dateShort, name, 
        timestamp, workouts.workoutId
        FROM 
          sets INNER JOIN workouts
        ON workouts.workoutId = sets.workoutId
        WHERE 
          exerciseName = ? AND 
          workouts.workoutId != ?
        ORDER BY timestamp DESC;`,
        [exerciseName, workoutIdToNotInclude],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function fetchExerciseNotes(exerciseName) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT exerciseNotes FROM exercises WHERE
        exerciseName = ?;`,
        [exerciseName],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function fetchExerciseInstanceNotes(exerciseName, workoutId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT exerInstNotes, workouts.timestamp, workouts.workoutId
        FROM 
          exerciseInstances INNER JOIN workouts
        ON workouts.workoutId = exerciseInstances.workoutId
        WHERE 
          exerciseName = ? AND 
          workouts.workoutId != ?
        ORDER BY timestamp DESC;`,
        [exerciseName, workoutId],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function fetchExerciseRecords(exerciseName) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT maxWeight, maxReps, maxVolume, 
        maxWeightDate, maxRepsDate, maxVolumeDate
        FROM exercises 
        WHERE exerciseName = ?;`,
        [exerciseName],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function doesRoutineAlreadyExist(routineName) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM routines
        WHERE routineName = ?;`,
        [routineName],
        (_, result) => {
          resolve(result.rows._array.length > 0);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}