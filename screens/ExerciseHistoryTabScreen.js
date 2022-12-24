import { View, Text, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'
import { showMessage, hideMessage } from "react-native-flash-message";

import { 
  fetchAllSetsFromAllExerciseInstances, 
  fetchExerciseInstanceNotes, 
  fetchExerciseNotes } from '../utils/database/fetchFunctions';
import PastExerInstItem from '../components/ListItems/PastExerInstItem';

export default function ExerciseHistoryTabScreen({ exer, workoutId }) {

  const [loadedPastInstances, setLoadedPastInstances] = useState();
  /* 
  [
    {
      setArray: [ {reps, setNumber, weight}],
      instNotes: "",
      dateShort: "",
      workoutName: "",
    }, ... 
  ]
  */
  const [loadedExerciseNotes, setLoadedExerciseNotes] = useState();

  const isFocused = useIsFocused();

  const loadData = async () => {
    // set exercise notes
    const exerNotes = await fetchExerciseNotes(exer.name);
    setLoadedExerciseNotes(exerNotes[0].exerciseNotes);

    // set set data
    const pastInstancesSets = await fetchAllSetsFromAllExerciseInstances(
      exer.name, workoutId);
    if (pastInstancesSets?.length < 1) {
      setLoadedPastInstances([]);
      return;
    }

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
    
    // get inst notes
    const exerInstNotes = await fetchExerciseInstanceNotes(
      exer.name, workoutId);

    // create inst array
    let instArr = [];
    let i = 0;
    for (let setArr of setsGrouped) {
      instArr.push({
        setArray: setArr,
        instNotes: exerInstNotes[i].exerInstNotes,
        dateShort: setArr[0].dateShort,
        workoutName: setArr[0].name,
      });
      i++;
    }
    
    
    setLoadedPastInstances(instArr);
  }


  useEffect(() => {
    if (isFocused) {
      showMessage({
        message: "Swipe down from tab bar to dismiss",
        type: "info",
        statusBarHeight: 50
      });
      loadData()
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
              setArray={inst?.item?.setArray}
              workoutName={inst?.item?.workoutName}
              date={inst?.item?.dateShort}
              notes={inst?.item?.instNotes}
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

  let renderExerciseNotes;
  if (loadedExerciseNotes && loadedExerciseNotes !== "") {
    renderExerciseNotes = (
      <View style={{ borderRadius: 8, backgroundColor: "#9e76c3", marginBottom: 2 }}>
        <Text style={styles.exerNotesStyle}>{loadedExerciseNotes}</Text>
      </View>
    );
  } else {
    renderExerciseNotes = (<View></View>)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>{exer.name}</Text>
      {renderExerciseNotes}
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
  exerNotesStyle: {
    color: "white",
    fontSize: 15,
    textAlign: "left",
    padding: 5,
  },
})