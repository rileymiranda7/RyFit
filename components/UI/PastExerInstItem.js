import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons";
import { Col, Row } from "react-native-easy-grid";

export default function PastExerInstItem({ setArray, workoutName, date }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.workoutNameStyle}>{workoutName}</Text>
        <Text style={styles.workoutDateTimeStyle}>{date}</Text>
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
      {setArray.map((set, index) => {
        return (
          <View key={index} style={{maxWidth: "50%", marginVertical: 2}}>
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
                <Ionicons name="close-outline" size={25} color="#fff" />
              </Col>
              <Col style={styles.repsVal}>
                <Text style={styles.setValTextStyle}>
                  {set.reps}
                </Text>
              </Col>
            </Row>
          </View>
        );
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#4e1fbb",
    margin: 10,
    minWidth: '80%',
    padding: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "white",
  },
  workoutNameStyle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  workoutDateTimeStyle: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  exerciseTextStyle: {
    color: "white",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2
  },
  setTextStyle: {
    color: "#9576eb",
    fontSize: 16
  },
  setValTextStyle: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold"
  },
  setNumStyle: {
    color: "white",
    fontSize: 16
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
    borderRadius: 8,
  },
  xIcon: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})