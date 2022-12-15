import { View, Text, StyleSheet, Button } from 'react-native'
import React from 'react'

import { fetchAllExerciseInstances, fetchCompletedWorkouts, fetchExercises, fetchRoutines, fetchSets } from '../utils/database'

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

      <Button title="drop workouts"/>
      <Button title="drop sets"/>
      <Button title="drop exerciseInstances"/>
    </View>
  )
}

const styles = StyleSheet.create({
  
})