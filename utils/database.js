import * as SQLite from "expo-sqlite";

import { Exercise } from "../models/exercise";
import { Routine } from "../models/routine";

const database = SQLite.openDatabase("RyFit.db");

export function init() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `
        CREATE TABLE IF NOT EXISTS workouts (
          workoutId INTEGER PRIMARY KEY NOT NULL,
          startTime DATE NOT NULL,
          duration INTEGER NOT NULL,
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
      tx.executeSql(`CREATE TABLE IF NOT EXISTS sets (
        setNumber INTEGER PRIMARY KEY NOT NULL,
        exerciseInstanceId INTEGER NOT NULL,
        weight INTEGER NOT NULL,
        reps INTEGER NOT NULL,
        type TEXT NOT NULL
       );`);
      tx.executeSql(`
       CREATE TABLE IF NOT EXISTS exerciseInstances (
        exerciseInstanceId INTEGER PRIMARY KEY NOT NULL,
        exerciseName TEXT NOT NULL,
        workoutId INT NOT NULL
      );
       `);
      tx.executeSql(`
       CREATE TABLE IF NOT EXISTS exercises (
        exerciseName TEXT PRIMARY KEY NOT NULL,
        restTime TEXT,
        exerciseNotes TEXT,
        routineName TEXT
      );
       `);
      tx.executeSql(`
      INSERT INTO exercises VALUES('Bicep Curl', '2:00', null, 'Pull B');
       `);
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
      // get list of routine names
      let routineNames = [];
      tx.executeSql(
        `SELECT DISTINCT routineName FROM exercises WHERE routineName IS NOT NULL;`,
        [],
        (_, result) => {
          for (const rt of result.rows._array) {
            routineNames.push(rt.routineName);
          }
          console.log("routineNames: " + routineNames);
          resolve(routineNames);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
}

export function fetchRoutine(routineName) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM exercises WHERE routineName = ?`,
        [routineName],
        (_, result) => {
          const routine = new Routine(routineName, result.rows._array);
          resolve(routine);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
}

export async function fetchRoutines() {
  const routineNames = await fetchRoutineNamesList();
  let routines = [];
  await Promise.all(
    routineNames.map(async (routineName) => {
      const routine = await fetchRoutine(routineName);
      routines.push(routine);
    })
  );
  return routines;
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
  console.log("inside insertExercise");
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO exercises (exerciseName, restTime, exerciseNotes, routineName) VALUES (?, ?, ?, ?)`,
        [
          exercise.name,
          exercise.restTime,
          exercise.notes,
          exercise.routineName,
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
