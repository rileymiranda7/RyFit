import * as SQLite from "expo-sqlite";

const database = SQLite.openDatabase("RyFit.db");

export function init() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS sets (
          setNumber INTEGER PRIMARY KEY NOT NULL,
          exerciseInstanceId INTEGER NOT NULL,
          weight INTEGER NOT NULL,
          reps INTEGER NOT NULL,
          type TEXT NOT NULL
         );
         CREATE TABLE IF NOT EXISTS exerciseInstances (
          exerciseInstanceId INTEGER PRIMARY KEY NOT NULL,
          exerciseName TEXT NOT NULL,
          workoutId INT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS exercises (
          exerciseName TEXT PRIMARY KEY NOT NULL,
          restTime TEXT,
          exerciseNotes TEXT,
          routineName TEXT
        );
        CREATE TABLE IF NOT EXISTS workouts (
          workoutId INTEGER PRIMARY KEY NOT NULL,
          startTime DATE NOT NULL,
          duration INTEGER NOT NULL,
          name TEXT NOT NULL
        );`,
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
