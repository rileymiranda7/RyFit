import { StyleSheet } from "react-native";
import { Col } from "react-native-easy-grid";

import SetNumber from "../row-elements/SetNumber";
import NumberInput from "../row-elements/NumberInput";
import Previous from "../row-elements/Previous";
import CompletedButton from "../row-elements/CompletedButton";
import { useRef, useState } from "react";
import { Colors } from "../../../constants/colors";

export default function IncompleteRow({
  setNumber,
  setIsCompleted,
  inputChangedHandler,
  isWarmupSet,
  type,
  previous
}) {

  const [lbsInputFocused, setLbsInputFocused] = useState(false);
  const [repsInputFocused, setRepsInputFocused] = useState(false);

  const repsInputRef = useRef();

  return (
    <>
      <Col style={[styles.set, 
        {backgroundColor: 
          isWarmupSet && setIsCompleted ? Colors.orange2 
          : setIsCompleted ? "green" : "black",}]}>
        <SetNumber
          inputChangedHandler={inputChangedHandler.bind(
            this,
            "setType",
            setNumber
          )}
          isWarmupSet={isWarmupSet}
          type={type}
        >{setNumber}</SetNumber>
      </Col>
      <Col style={[styles.previous, 
        {backgroundColor: 
          isWarmupSet && setIsCompleted ? Colors.orange2 
          : setIsCompleted ? "green" : "black",}]}>
        <Previous previous={previous} />
      </Col>
      <Col 
        style={[
          styles.lbs, 
          {backgroundColor: 
            isWarmupSet && setIsCompleted ? Colors.orange2 
            : setIsCompleted ? "green" : "black",}]}>
        <NumberInput
          textInputConfig={{
            keyboardType: "decimal-pad",
            onChangeText: inputChangedHandler.bind(this, "lbs", setNumber),
            contextMenuHidden: true,
            keyboardAppearance: 'dark',
            returnKeyType: "done",
            onSubmitEditing: () => repsInputRef.current.focus(),
            blurOnSubmit: false,
            maxLength: 6,
            selectTextOnFocus: true,
            onFocus: () => {
              setLbsInputFocused(!lbsInputFocused);
            },
            onBlur: () => {
              setLbsInputFocused(!lbsInputFocused);
            },
          }}
          isFocused={lbsInputFocused}
        />
      </Col>
      <Col 
        style={[styles.reps, 
          {backgroundColor: 
            isWarmupSet && setIsCompleted ? Colors.orange2 
            : setIsCompleted ? "green" : "black",}]}>
        <NumberInput
          textInputConfig={{
            keyboardType: "number-pad",
            onChangeText: inputChangedHandler.bind(this, "reps", setNumber),
            contextMenuHidden: true,
            keyboardAppearance: 'dark',
            returnKeyType: "done",
            onSubmitEditing: inputChangedHandler.bind(
              this, "status", setNumber, ""),
            blurOnSubmit: false,
            maxLength: 5,
            selectTextOnFocus: true,
            onFocus: () => {
              setRepsInputFocused(!repsInputFocused);
            },
            onBlur: () => {
              setRepsInputFocused(!repsInputFocused);
            },
            ref: repsInputRef
          }}
          isFocused={repsInputFocused}
        />
      </Col>
      <Col style={[styles.completed, 
        {backgroundColor: 
          isWarmupSet && setIsCompleted ? Colors.orange2 
          : setIsCompleted ? "green" : "black",}]}>
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
