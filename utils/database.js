import * as SQLite from "expo-sqlite";

import { Exercise } from "../models/exercise";
import { Routine } from "../models/routine";
import Set from "../models/set";
import { Workout } from "../models/workout";

const database = SQLite.openDatabase("RyFit.db");

export async function init() {
  await initRoutineExerciseBridge();
  await initExercises();
  await initRoutines();
  await initWorkouts();
  await initSets();
  await initExerciseInstances();

  /* const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `DROP TABLE exerciseInstances;`,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise; */

}

/** INIT TABLES */

export function initRoutineExerciseBridge() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `
        CREATE TABLE IF NOT EXISTS routineExerciseBridge (
          exerciseName TEXT NOT NULL,
          routineName TEXT NOT NULL,
          numberInRoutine INT NOT NULL,
          PRIMARY KEY (exerciseName, routineName),
          FOREIGN KEY(exerciseName) REFERENCES exercises(exerciseName),
          FOREIGN KEY(routineName) REFERENCES routines(routineName)
        );
      `,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}
export function initExercises() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `
        CREATE TABLE IF NOT EXISTS exercises (
          exerciseName TEXT PRIMARY KEY NOT NULL,
          restTime TEXT,
          exerciseNotes TEXT
        );
      `,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}
export function initRoutines() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `
        CREATE TABLE IF NOT EXISTS routines (
          routineName TEXT PRIMARY KEY NOT NULL,
          dateCreated DATE NOT NULL
        );
      `,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}
export function initWorkouts() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `
        CREATE TABLE IF NOT EXISTS workouts (
          workoutId INTEGER PRIMARY KEY NOT NULL,
          dateShort TEXT NOT NULL,
          dateFull TEXT NOT NULL,
          startTime TEXT NOT NULL,
          duration TEXT,
          name TEXT NOT NULL,
          timestamp DATE NOT NULL
        );
      `,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}
export function initSets() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `
        CREATE TABLE IF NOT EXISTS sets (
          setNumber INTEGER NOT NULL,
          weight INTEGER,
          reps INTEGER,
          type TEXT NOT NULL,
          status TEXT NOT NULL,
          exerciseName TEXT NOT NULL,
          workoutId INT NOT NULL,
          PRIMARY KEY (exerciseName, workoutId, setNumber),
          FOREIGN KEY(exerciseName) REFERENCES exerciseInstances(exerciseName),
          FOREIGN KEY(workoutId) REFERENCES exerciseInstances(workoutId)
        );
      `,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}
export function initExerciseInstances() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `
        CREATE TABLE IF NOT EXISTS exerciseInstances (
          exerciseName TEXT NOT NULL,
          workoutId INT NOT NULL,
          numberInWorkout INT NOT NULL,
          PRIMARY KEY (exerciseName, workoutId),
          FOREIGN KEY(exerciseName) REFERENCES exercises(exerciseName),
          FOREIGN KEY(workoutId) REFERENCES workouts(workoutId)
        );
      `,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}




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
              result.rows._array[0].exerciseName,
              result.rows._array[0].restTime,
              result.rows._array[0].exerciseNotes
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
      
/*   export function fetchPastWorkouts() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM workouts;`,
          [],
          (_, result) => {
            const places = [];
            for (const dp of result.rows._array) {
              places.push(
                new Place(
                  dp.title,
                  dp.imageUri,
                  {
                    address: dp.address,
                    lat: dp.lat,
                    lng: dp.lng,
                  },
                  dp.id
                )
              );
            }
            resolve(places);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  
    return promise;
  } */

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
          `SELECT * FROM exercises;`,
          [],
          (_, result) => {
            const exercises = [];
            for (const e of result.rows._array) {
              exercises.push(
                new Exercise(
                  e.exerciseName,
                  e.restTime,
                  e.exerciseNotes,
                  e.routineName
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
            /* const sets = [];
            for (const s of result.rows._array) {
              sets.push(
                new Set(
                  s.setNumber,
                  s.weight,
                  s.reps,
                  s.type,
                  s.status,
                  s.exerciseName,
                  s.workoutId
                )
              );
            } */
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
  export function fetchSetsFromCompletedExercise(exerciseName, workoutId) {
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




  /* INSERT FUNCTIONS */


  export function insertIntoRoutineExerciseBridge(routineExercise) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO routineExerciseBridge 
          (exerciseName, routineName, numberInRoutine) VALUES (?, ?, ?);`,
          [routineExercise.exerciseName, 
            routineExercise.routineName, 
            routineExercise.numberInRoutine
          ],
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

export async function insertEmptyRoutine(routineName) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO routines (routineName, dateCreated) VALUES (?, DATETIME('now'));`,
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


export function insertExercise(exercise) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO exercises (exerciseName, restTime, exerciseNotes) VALUES (?, ?, ?);`,
        [exercise.name, exercise.restTime, exercise.notes],
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

export async function createWorkout(name) {
  const dateShort = 
  (new Date().toLocaleDateString(undefined,{dateStyle:'short'})).toString();
  const dateFull =
  (new Date().toLocaleDateString(undefined,{dateStyle:'full'})).toString();
  const startTime = 
  (new Date().toLocaleTimeString(undefined,{timeStyle:'short'})).toString();
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO workouts (dateShort, dateFull, startTime, name, timestamp) 
        VALUES (?, ?, ?, ?, datetime('now')) 
        RETURNING workoutId;`,
        [dateShort, dateFull, startTime, name],
        (_, result) => {
          resolve(result.rows._array[0].workoutId);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export async function insertExerciseInstance
  (exerciseInstance) {
    const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO exerciseInstances (exerciseName, workoutId, numberInWorkout) 
        VALUES (?, ?, ?);`,
        [exerciseInstance.name, exerciseInstance.workoutId, exerciseInstance.numberInWorkout],
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

export async function insertSet(set) {
    const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO sets (
          setNumber, 
          weight, 
          reps,
          type,
          status,
          exerciseName,
          workoutId
          ) 
        VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [
          set.setNumber,
          set.weight,
          set.reps,
          set.type,
          set.status,
          set.exerciseName,
          set.workoutId
        ],
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


/* DELETE FUNCTIONS */

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
        `DELETE FROM routineExerciseBridge WHERE exerciseName = ? AND routineName = ?`,
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

export async function deleteIncompleteSets(workoutId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM sets WHERE workoutId = ?
        AND status = "IN PROGRESS";`,
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




/* UPDATE FUNCTIONS */

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
          await updateExerciseNumberInRoutine(routineName, exercise.name, index + 1);
        })
      );
    } else {
      await Promise.all(
        newExerciseOrder.map(async (exercise, index) => {
          if (index + 1 > exerciseToDeletePosition) {
            await updateExerciseNumberInRoutine(routineName, exercise.name, index);
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
        newExerciseOrder.map(async (exercise, index) => {
          await updateExerciseNumberInWorkout(workoutId, exercise.name, index + 1);
        })
      );
    } else {
      await Promise.all(
        newExerciseOrder.map(async (exercise, index) => {
          if (index + 1 > exerciseToDeletePosition) {
            await updateExerciseNumberInWorkout(routineName, exercise.name, index);
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

export async function updateSetWeight(setNumber, workoutId, exerciseName, newWeight) {
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

export async function updateSetReps(setNumber, workoutId, exerciseName, newReps) {
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

export async function updateSetOrder(
  workoutId, exerciseName, newSetOrder) {
  await Promise.all(
    newSetOrder.map(async (set) => {
        await insertSet(new Set(
          set.setNumber, set.lbs, set.reps, "WORKING", 
          set.status, exerciseName, workoutId
        ));
    })
  );
}