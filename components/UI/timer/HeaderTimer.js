import { View, Text, Pressable, Modal, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Audio } from 'expo-av';

import IconButton from "../IconButton";
import RunningTimer from "./RunningTimer";
import SetTimerModal from "../modals/SetTimerModal";

export default function HeaderTimer({ restTimerAmount, rndm }) {
  const [timerIsRunning, setTimerIsRunning] = useState(false);
  const [showSetTimerModal, setShowSetTimerModal] = useState(false);
  const [timerAmount, setTimerAmount] = useState("5");
  const [restTime, setRestTime] = useState(3);
  const [useRestTime, setUseRestTime] = useState(false);
  const [initialRender, setInitialRender] = useState(true);
  const [sound, setSound] = useState();

  const toggleShowSetTimer = () => {
    setShowSetTimerModal(!showSetTimerModal);
  };

  const handleOnTimerAmountSet = (amount) => {
    if (amount > 10) {
      alert("Timer cannot be over 10 minutes!");
    } else if (amount <= 0) {
      alert("Timer cannot be 0 minutes!");
    } else {
      setTimerAmount(Number(amount));
      setShowSetTimerModal(false);
      setTimerIsRunning(true);
    }
  };

  const handleOnRestTimeSet = (amount) => {
    if (Number(amount) > 10) {
      alert("Timer cannot be over 10 minutes!");
    } else if (Number(amount) <= 0) {
      alert("Timer cannot be 0 minutes!");
    } else {
      setRestTime(Number(amount));
      setShowSetTimerModal(false);
      setTimerIsRunning(true);
    }
  };

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync( require('../../../assets/bellAlert.wav')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  const onTimerEnd = (wasCanceled) => {
    if (useRestTime) {
      setUseRestTime(false);
    }
    setTimerIsRunning(false);
    setShowSetTimerModal(false);
    if (!wasCanceled) {
      playSound();
      alert("Time for next set!");
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    if (initialRender) {
      setInitialRender(false);
    } else {
      setUseRestTime(true);
      if (Number(restTimerAmount) > 0) {
        setRestTime(Number(restTimerAmount));
        handleOnRestTimeSet(restTimerAmount);
      }
    }
  }, [rndm]);

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
        onTimerEnd={onTimerEnd}
        rndm={rndm}
        restTime={restTime}
        useRestTime={useRestTime}
      />
    );
  } else {
    renderThis = (
      <View style={{ margin: 7 }}>
        <IconButton
          onPress={() => setShowSetTimerModal(true)}
          icon={"timer-outline"}
          color="white"
          size={30}
        />
      </View>
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
