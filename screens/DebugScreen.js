import { View, Text, StyleSheet, Button } from 'react-native'
import React from 'react'

import { fetchCompletedWorkouts, fetchSets } from '../utils/database'

export default function DebugScreen() {
  return (
    <View>
      <Text>Debug</Text>

      <Button 
        title="print workouts" 
        onPress={async () => {
          console.log(await fetchCompletedWorkouts());
        }}
      />
      <Button 
        title="print sets" 
        onPress={async () => {
          console.log(await fetchSets());
        }}
      />
      <Button title="print exerciseInstances"/>

      <Button title="drop workouts"/>
      <Button title="drop sets"/>
      <Button title="drop exerciseInstances"/>
    </View>
  )
}

const styles = StyleSheet.create({
  
})