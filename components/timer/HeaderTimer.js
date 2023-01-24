import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { Audio } from 'expo-av';

import IconButton from "../IconButton";
import RunningTimer from "./RunningTimer";
import SetTimerModal from "../modals/SetTimerModal";

export default function HeaderTimer({ 
  restTimerAmount, 
  rndm,
  sendTimerNotif
}) {
  const [timerIsRunning, setTimerIsRunning] = useState(false);
  const [showSetTimerModal, setShowSetTimerModal] = useState(false);
  const [timerAmount, setTimerAmount] = useState("5");
  const [useRestTime, setUseRestTime] = useState(false);
  const [initialRender, setInitialRender] = useState(true);
  const [sound, setSound] = useState();

  const toggleShowSetTimer = () => {
    setShowSetTimerModal(!showSetTimerModal);
  };

  const handleOnTimerAmountSet = (amount) => {
    if (amount > 10) {
      alert("Timer cannot be over 10 minutes!",
      {userInterfaceStyle: "dark"});
    } else if (amount <= 0) {
      alert("Timer cannot be 0 minutes!",
      {userInterfaceStyle: "dark"});
    } else {
      setTimerAmount(Number(amount));
      setShowSetTimerModal(false);
      setTimerIsRunning(true);
    }
  };

  const handleOnRestTimeSet = () => {
      setShowSetTimerModal(false);
      setTimerIsRunning(true);

  };

  /* async function playSound() {
    const { sound } = await Audio.Sound.createAsync( require('../../assets/bellAlert.wav')
    );
    setSound(sound);
    await sound.playAsync();
  } */

  const onTimerEnd = (wasCanceled) => {
    if (useRestTime) {
      setUseRestTime(false);
    }
    setTimerIsRunning(false);
    setShowSetTimerModal(false);
    if (!wasCanceled) {
      //playSound();
      /* alert("Time for next set!",
      {userInterfaceStyle: "dark"}); */
      sendTimerNotif();
    }
  };

  useEffect(() => {
    if (initialRender) {
      setInitialRender(false);
    } else {
      setUseRestTime(true);
      handleOnRestTimeSet(restTimerAmount);
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
        restTime={restTimerAmount}
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
