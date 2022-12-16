import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import { Col, Row } from "react-native-easy-grid";

import { fetchSetsFromExerciseInstance } from '../../utils/database';

export default function PastExerciseItem({ 
  workoutId, 
  exerciseName,
  exerNotes,
  exerInstNotes
}) {

  const [loadedSets, setLoadedSets] = useState();

  const isFocused = useIsFocused();

  const loadSets = async () => {
    const sets = 
      await fetchSetsFromExerciseInstance(exerciseName, workoutId);
    setLoadedSets(sets);
  };

  useEffect(() => {
    if (isFocused) {
      loadSets();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.exerciseTitleStyle}>{exerciseName}</Text>
      <View style={{ flexDirection: "row", marginLeft: "1%", alignItems: "center",
        padding: 5}}>
        <Ionicons name="document-text-outline" color={"#fff"} size={20} />
        <Text style={{color: "white", fontSize: 16,}}>Exercise Notes</Text>
      </View>
      <View style={styles.notesContainer}>
        <View style={{ borderRadius: 8, backgroundColor: "#9e76c3", marginBottom: 2 }}>
          <Text style={styles.exerNotesStyle}>{exerNotes}</Text>
        </View>
        <View style={{ borderRadius: 8, backgroundColor: "#835eeb" }}>
          <Text style={styles.exerInstNotesStyle}>{exerInstNotes}</Text>
        </View>
      </View>
      <View style={{maxWidth: "50%"}}>
        <Row>
          <Col style={{ flex: 1}}>
          </Col>
          <Col style={styles.lbs}>
            <Text style={styles.setTextStyle} >
              {"lbs"}
            </Text>
          </Col>
          <Col style={styles.xIcon}>
          </Col>
          <Col style={styles.reps}>
            <Text style={styles.setTextStyle} >
              {"reps"}
            </Text>
          </Col>
        </Row>
      </View>
      {loadedSets !== undefined && loadedSets.length > 0 && 
      (loadedSets.map((set, index) => {
        return (
          <View key={index} style={{maxWidth: "50%", marginBottom: 2}}>
            <Row>
              <Col style={styles.set}>
                <Text style={styles.setNumStyle} >
                  {set.setNumber}
                </Text>
              </Col>
              <Col style={styles.lbsVal}>
                <Text style={styles.setValTextStyle} >
                  {set.weight}
                </Text>
              </Col>
              <Col style={styles.xIcon}>
                <Ionicons name="close-outline" size={28} color="#fff" />
              </Col>
              <Col style={styles.repsVal}>
                <Text style={styles.setValTextStyle}>
                  {set.reps}
                </Text>
              </Col>
            </Row>
          </View>
        );
      }))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 4,
    paddingHorizontal: 5,
  },
  workoutNameStyle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  workoutDateTimeStyle: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
  notesContainer: {
    marginLeft: "4%",
    marginBottom: 5,
  },
  exerNotesStyle: {
    color: "white",
    fontSize: 15,
    textAlign: "left",
    padding: 5,
  },
  exerInstNotesStyle: {
    color: "white",
    fontSize: 15,
    textAlign: "left",
    padding: 5
  },
  exerciseTitleStyle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 2
  },
  setTextStyle: {
    color: "#9576eb",
    fontSize: 18,
    textAlign: "center",
  },
  setValTextStyle: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold"
  },
  setNumStyle: {
    color: "white",
    fontSize: 16
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 0,
  },
  pressed: {
    opacity: 0.75,
  },
  lbsVal: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  lbs: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  repsVal: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  reps: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  set: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 8
  },
  xIcon: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})