import * as SQLite from "expo-sqlite";
const database = SQLite.openDatabase("RyFit.db");

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
      `INSERT INTO routines (routineName, dateCreated) 
      VALUES (?, DATETIME('now'));`,
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


export function insertExercise(e) {
const promise = new Promise((resolve, reject) => {
  database.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO exercises (
        exerciseName, restTime, exerciseNotes, maxWeight, maxWeightDate,
        maxReps, maxRepsDate, maxVolume, maxVolumeDate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [e.name, e.restTime, e.notes, e.maxWeight, e.maxWeightDate, e.maxReps,
        e.maxRepsDate, e.maxVolume, e.maxVolumeDate],
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
      [
        exerciseInstance.name, 
        exerciseInstance.workoutId, 
        exerciseInstance.numberInWorkout
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
        workoutId,
        isWeightRecord,
        isRepsRecord,
        isVolumeRecord,
        previous
        ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        set.setNumber,
        set.weight,
        set.reps,
        set.type,
        set.status,
        set.exerciseName,
        set.workoutId,
        set.isWeightRecord,
        set.isRepsRecord,
        set.isVolumeRecord,
        set.previous
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