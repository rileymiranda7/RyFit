import * as SQLite from "expo-sqlite";

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
      INSERT INTO exercises VALUES('Chest Fly', '2:00', null, 'Push A');
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
          console.log("Past Workouts:");
          console.log(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function fetchRoutines() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM exercises;`,
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
          console.log("Exercises: ");
          console.log(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}
