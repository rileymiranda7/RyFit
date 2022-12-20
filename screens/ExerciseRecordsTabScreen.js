import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from '@react-navigation/native';
import { fetchExerciseRecords } from '../utils/database';

export default function ExerciseRecordsTabScreen({ exer, workoutId}) {

  const [loadedRecords, setLoadedRecords] = useState();

  const loadRecords = async () => {
    const records = await fetchExerciseRecords(exer.name);
    console.log("here"),
    console.log(records)
    setLoadedRecords(records[0]);
  }

  const isFocused = useIsFocused();
  useEffect(() => {
    (async () => {
      if (isFocused) {
        loadRecords();
      }
    })();
  }, [isFocused]);

  let renderThis

  if (loadedRecords !== undefined) {
    renderThis = (
        <View style={styles.recordsContainer}>
          <View style={styles.recordRowLabel}>
            <Ionicons name="medal-outline" color={"#FF4747"} size={26} />
            <Text style={styles.recordsLabelTextStyle}>Max Weight: </Text>
          </View>
          <View style={styles.recordRowVal}>
            <Text style={styles.maxWeightTextStyle}>{loadedRecords.maxWeight} lbs</Text>
            <Text style={styles.dateTextStyle}>on 03/12/22</Text>
          </View>
          <View style={styles.recordRowLabel}>
            <Ionicons name="medal-outline" color={"#00FFFF"} size={26} />
            <Text style={styles.recordsLabelTextStyle}>Max Reps: </Text>
          </View>
          <View style={styles.recordRowVal}>
            <Text style={styles.maxRepsTextStyle}>{loadedRecords.maxReps} reps</Text>
            <Text style={styles.dateTextStyle}>on 03/12/22</Text>
          </View>
          <View style={styles.recordRowLabel}>
            <Ionicons name="medal-outline" color={"#00FF00"} size={26} />
            <Text style={styles.recordsLabelTextStyle}>Max Volume: </Text>
          </View>
          <View style={styles.recordRowVal}>
            <Text style={styles.maxVolumeTextStyle}>{loadedRecords.maxVolume} lbs</Text>
            <Text style={styles.dateTextStyle}>on 03/12/22</Text>
          </View>
        </View>
    );
  } else {
    renderThis = (
      <Text style={styles.exerciseNameTextStyle}>loading...</Text>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.exerciseNameTextStyle}>{exer.name}</Text>
      {renderThis}
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
  recordsContainer: {
    minWidth: "98%",
    marginTop: 10
  },
  recordRowLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  recordRowVal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  exerciseNameTextStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
    marginVertical: 5,
  },
  recordsLabelTextStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "left",
    fontSize: 18,
    marginVertical: 10,
    marginHorizontal: 2
  },
  dateTextStyle: {
    color: "white",
    textAlign: "left",
    fontSize: 15,
    marginVertical: 10,
    marginHorizontal: 2
  },
  maxWeightTextStyle: {
    color: "#FF4747",
    fontWeight: "bold",
    textAlign: "left",
    fontSize: 18,
    marginVertical: 10,
    marginHorizontal: 2
  },
  maxRepsTextStyle: {
    color: "#00FFFF",
    fontWeight: "bold",
    textAlign: "left",
    fontSize: 18,
    marginVertical: 10,
    marginHorizontal: 2
  },
  maxVolumeTextStyle: {
    color: "#00FF00",
    fontWeight: "bold",
    textAlign: "left",
    fontSize: 18,
    marginVertical: 10,
    marginHorizontal: 2
  },
})