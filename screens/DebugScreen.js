import { View, Text, Button } from 'react-native'
import React from 'react'

import { 
  fetchAllExerciseInstances, 
  fetchCompletedWorkouts, 
  fetchExercises, 
  fetchRoutineExercises, 
  fetchRoutines, 
  fetchSets 
} from '../utils/database/fetchFunctions'
import * as dropFunctions from '../utils/database/dropTableFunctions';

export default function DebugScreen() {
  return (
    <View>
      <Text>Debug</Text>

      <Button 
        title="print workouts" 
        onPress={async () => {
          console.log("workouts");
          console.log(await fetchCompletedWorkouts());
        }}
      />
      <Button 
        title="print sets" 
        onPress={async () => {
          console.log("sets");
          console.log(await fetchSets());
        }}
      />
      <Button 
        title="print exerciseInstances" 
        onPress={async () => {
          console.log("exerciseInstances")
          console.log(await fetchAllExerciseInstances());
        }}
      />
      <Button 
        title="print exercises" 
        onPress={async () => {
          console.log("exercises")
          console.log(await fetchExercises());
        }}
      />
      <Button 
        title="print routines" 
        onPress={async () => {
          console.log("routines")
          console.log(await fetchRoutines());
        }}
      />
      <Button 
        title="print routineExerciseBridges" 
        onPress={async () => {
          console.log("routineExerciseBridges")
          console.log(await fetchRoutineExercises());
        }}
      />

      <Button 
        title="DROP WORKOUTS" 
        onPress={async () => {
          await dropFunctions.dropWorkouts();
        }}
        color="red"
      />
      <Button 
        title="DROP EXERCISES" 
        onPress={async () => {
          await dropFunctions.dropExercises();
        }}
        color="red"
      />
      <Button 
        title="DROP ROUTINES" 
        onPress={async () => {
          await dropFunctions.dropRoutines();
        }}
        color="red"
      />
      <Button 
        title="DROP SETS" 
        onPress={async () => {
          await dropFunctions.dropSets();
        }}
        color="red"
      />
      <Button 
        title="DROP EXERCISE INSTANCES" 
        onPress={async () => {
          await dropFunctions.dropExerciseInstances();
        }}
        color="red"
      />
      <Button 
        title="---DROP ALL TABLES---" 
        onPress={async () => {
          await dropFunctions.dropAllTables();
        }}
        color="red"
      />
    </View>
  )
}