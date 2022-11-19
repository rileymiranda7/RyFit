import { StyleSheet } from "react-native";
import { Col } from "react-native-easy-grid";

import SetNumber from "../row-elements/SetNumber";
import NumberInput from "../row-elements/NumberInput";
import Previous from "../row-elements/Previous";
import CompletedButton from "../row-elements/CompletedButton";
import { useState } from "react";

export default function IncompleteRow({
  setNumber,
  lbsValue,
  repsValue,
  setIsCompleted,
  inputChangedHandler,
}) {

  return (
    <>
      <Col style={[styles.set, 
        {backgroundColor: setIsCompleted ? "green" : "black",}]}>
        <SetNumber>{setNumber}</SetNumber>
      </Col>
      <Col style={[styles.previous, 
        {backgroundColor: setIsCompleted ? "green" : "black",}]}>
        <Previous />
      </Col>
      <Col style={[styles.lbs, 
        {backgroundColor: setIsCompleted ? "green" : "black",}]}>
        <NumberInput
          textInputConfig={{
            keyboardType: "decimal-pad",
            onChangeText: inputChangedHandler.bind(this, "lbs", setNumber),
            value: lbsValue,
          }}
        />
      </Col>
      <Col style={[styles.reps, 
        {backgroundColor: setIsCompleted ? "green" : "black",}]}>
        <NumberInput
          textInputConfig={{
            keyboardType: "decimal-pad",
            onChangeText: inputChangedHandler.bind(this, "reps", setNumber),
            value: repsValue,
          }}
        />
      </Col>
      <Col style={[styles.completed, 
        {backgroundColor: setIsCompleted ? "green" : "black",}]}>
        <CompletedButton
          inputChangedHandler={inputChangedHandler.bind(
            this,
            "status",
            setNumber
          )}
          setIsCompleted={setIsCompleted}
        />
      </Col>
    </>
  );
}

const styles = StyleSheet.create({
  set: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  previous: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  lbs: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  reps: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  completed: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
