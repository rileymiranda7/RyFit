import { View, Text, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useIsFocused } from '@react-navigation/native'
import { showMessage, hideMessage } from "react-native-flash-message";

import {Picker} from '@react-native-picker/picker';
import { fetchAllSetsFromAllExerciseInstances } from '../utils/database';
import PastExerInstItem from '../components/UI/PastExerInstItem';

export default function ExerciseHistoryTabScreen({ exer, workoutId }) {

  const [loadedPastInstances, setLoadedPastInstances] = useState()

  const isFocused = useIsFocused();

  const loadPastExerInstances = async () => {
    const pastInstancesSets = await fetchAllSetsFromAllExerciseInstances(
      exer.name, workoutId);
    console.log("pastInstancesSets");
    console.log(pastInstancesSets);
    
    // sets are already in order, just need to group by workout
    let setsGrouped = [];
    let currentGroupOfSets = [];
    let currentWktId = pastInstancesSets[0]?.workoutId;
    for (let set of pastInstancesSets) {
      if (set.workoutId === currentWktId) {
        currentGroupOfSets.push(set);
      } else {
        setsGrouped.push(currentGroupOfSets);
        currentGroupOfSets = [set];
        currentWktId = set.workoutId;
      }
    }
    // push last group of sets
    setsGrouped.push(currentGroupOfSets);

    console.log("setsGrouped")
    console.log(setsGrouped)
    setLoadedPastInstances(setsGrouped);
  }


  useEffect(() => {
    if (isFocused) {
      showMessage({
        message: "Swipe down from tab bar to dismiss",
        type: "info",
        statusBarHeight: 50
      });
      loadPastExerInstances()
    }
  }, [isFocused])

  let renderPastInstances;
  if (loadedPastInstances !== undefined && loadedPastInstances.length > 0) {
    renderPastInstances = (
      <FlatList
        data={loadedPastInstances}
        renderItem={(inst) => {
          return (
            <PastExerInstItem 
              setArray={inst?.item}
              workoutName={inst?.item[0]?.name}
              date={inst?.item[0]?.dateShort}
            />
          )
        }}
        keyExtractor={(i, index) => index}
      />
    )
  } else {
    renderPastInstances = (
      <Text style={styles.noPastInstancesTextStyle}>
        No past workouts with this exercise found
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>
      ExerciseHistoryTabScreen - {exer.name}
      </Text>
      {renderPastInstances}
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
  noPastInstancesTextStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 15,
    marginVertical: 5,
  },
})