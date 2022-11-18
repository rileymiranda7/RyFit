import * as SQLite from "expo-sqlite";

import { Exercise } from "../models/exercise";
import { Routine } from "../models/routine";

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
        `DROP TABLE workouts;`,
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
export function initRoutineExerciseBridge() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `
        CREATE TABLE IF NOT EXISTS routineExerciseBridge (
          exerciseName TEXT NOT NULL,
          routineName TEXT NOT NULL,
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
          startTime DATE NOT NULL,
          endTime DATE,
          name TEXT NOT NULL
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
          setNumber INTEGER PRIMARY KEY NOT NULL,
          exerciseInstanceId INTEGER NOT NULL,
          weight INTEGER NOT NULL,
          reps INTEGER NOT NULL,
          type TEXT NOT NULL
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
          exerciseInstanceId INTEGER PRIMARY KEY NOT NULL,
          exerciseName TEXT NOT NULL,
          workoutId INT NOT NULL,
          numberInWorkout INT NOT NULL
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

export const getExercise = async (exerciseName) => {
  let exercise = await fetchExercise(exerciseName);
  return exercise;
};

export async function fetchRoutines() {
  const routineNames = await fetchRoutineNamesList();
  const getRoutines = async (result) => {
    let routines = [];
    for (const routineName of routineNames) {
      let routine = new Routine(routineName.routineName, []);
      for (const routineExercise of result.rows._array) {
        if (routineExercise.routineName === routineName.routineName) {
          const exercise = await getExercise(routineExercise.exerciseName);
          routine?.exercises?.push(exercise);
        }
      }
      routines.push(routine);
    }
    return routines;
  };
  const result = await fetchRoutineExercises();
  const routines = await getRoutines(result);
  return routines;
}

export async function fetchRoutine(routineName) {
  const getRoutine = async (result) => {
    let routine = new Routine(routineName, []);
    await Promise.all(
      result.rows._array.map(async (routineExercise) => {
        if (routineExercise.routineName === routineName) {
          const exercise = await getExercise(routineExercise.exerciseName);
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

export async function fetchRoutineExercises() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM routineExerciseBridge;`,
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

export function insertIntoRoutineExerciseBridge(routineExercise) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO routineExerciseBridge (exerciseName, routineName) VALUES (?, ?);`,
        [routineExercise.exerciseName, routineExercise.routineName],
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

export function fetchPastWorkouts() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM workouts;`,
        [],
        (_, result) => {
          /* const places = [];
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
          resolve(places); */
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

export function deleteExerciseFromRoutine(exerciseName, routineName) {
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

export async function createWorkout(name) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO workouts (startTime, name) 
        VALUES (DATETIME('now'), ?) 
        RETURNING workoutId;`,
        [name],
        (_, result) => {
          console.log(result.rows._array)
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
          console.log('updateWorkout')
          console.log(result.rows._array)
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

export async function fetchWorkoutName(workoutId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT name FROM workouts
        WHERE workoutId = ?;`,
        [workoutId],
        (_, result) => {
          console.log('workoutName: ' + result.rows._array[0].name);
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

export function fetchWorkouts() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM workouts;`,
        [],
        (_, result) => {
          console.log('all workouts')
          console.log(result.rows._array)
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