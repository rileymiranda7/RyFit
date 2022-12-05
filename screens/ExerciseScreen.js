import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'

export default function ExerciseScreen() {

  const navigation = useNavigation();
  const route = useRoute();
  const { exerciseName } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>{exerciseName}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    minWidth: "100%",
    backgroundColor: "black",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
    marginVertical: 5,
  },
})