import { View, Text, Pressable, Modal, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";

import IconButton from "../IconButton";
import RunningTimer from "./RunningTimer";
import SetTimerModal from "../modals/SetTimerModal";
import { render } from "react-dom";

export default function HeaderTimer(
  {
    /* timerAmount,
  onTimerEnd,
  resetTimer,
  onPress,
  showActiveTimerModal,
  exitActiveTimerModal, */
  }
) {
  const [timerIsRunning, setTimerIsRunning] = useState(false);
  const [showSetTimerModal, setShowSetTimerModal] = useState(false);
  const [timerAmount, setTimerAmount] = useState("5");

  const toggleShowSetTimer = () => {
    setShowSetTimerModal(!showSetTimerModal);
  };

  const handleOnTimerAmountSet = (timerAmount) => {
    setTimerAmount(Number(timerAmount));
    setShowSetTimerModal(!showSetTimerModal);
    setTimerIsRunning(!timerIsRunning);
  };

  let renderThis;

  if (showSetTimerModal) {
    renderThis = (
      <SetTimerModal
        modalVisible={showSetTimerModal}
        closeModal={toggleShowSetTimer}
        handleOnTimerAmountSet={handleOnTimerAmountSet}
      />
    );
  } else if (timerIsRunning) {
    renderThis = (
      <RunningTimer
        timeInMinutes={timerAmount}
        onTimerEnd={() => {}}
        resetTimer={() => {}}
      />
    );
  } else {
    renderThis = (
      <IconButton
        onPress={() => setShowSetTimerModal(true)}
        icon={"timer-outline"}
        color="white"
        size={30}
      />
    );
  }

  return renderThis;
}

const styles = StyleSheet.create({
  /* modalView: {
    margin: 20,
    marginTop: "10%",
    width: "90%",
    height: "88%",
    backgroundColor: "#3e04c3",
    borderRadius: 20,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputContainer: {
    backgroundColor: "#2196F3",
    minWidth: "80%",
    height: "8%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 20,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  titleText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
    backgroundColor: "#2196F3",
    margin: 10,
    padding: 4,
  },
  input: {
    fontSize: 25,
    backgroundColor: "#b8bbbe",
    padding: 4,
    minWidth: "78%",
    minHeight: "7%",
  },
  headerTimerStyle: {
    margin: 5,
  },
  headerTimerText: {
    fontSize: 20,
    color: "white",
  }, */
});
