import { View, Text, Pressable, Modal, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";

export default function HeaderTimer({
  timerAmount,
  onTimerEnd,
  resetTimer,
  onPress,
  showActiveTimerModal,
  exitActiveTimerModal,
}) {
  const deadline = useRef((Number(timerAmount) + 1) * 1000 + Date.now());
  let interval = useRef();
  const initialDiff = deadline.current - Date.now();

  const [timeLeft, setTimeLeft] = useState({
    days: Math.floor(initialDiff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((initialDiff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((initialDiff / 1000 / 60) % 60),
    seconds:
      Math.floor((initialDiff / 1000) % 60) - 1 < 10
        ? "0" + (Math.floor((initialDiff / 1000) % 60) - 1)
        : Math.floor((initialDiff / 1000) % 60) - 1,
  });

  const startTimer = () => {
    interval = setInterval(() => {
      let difference = deadline.current - Date.now();

      let days = Math.floor(difference / (1000 * 60 * 60 * 24));
      days = days < 10 ? "0" + days : days;
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      let seconds = Math.floor((difference / 1000) % 60);
      seconds = seconds < 10 ? "0" + seconds : seconds;

      if (difference < 0) {
        clearInterval(interval.current);
        onTimerEnd(false);
      } else {
        setTimeLeft({
          days: days,
          hours: hours,
          minutes: minutes,
          seconds: seconds,
        });
      }
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(interval);
    };
  });
  useEffect(() => {
    deadline.current = (Number(timerAmount) + 1) * 1000 + Date.now();
  }, [resetTimer]);

  const headerTimer = (
    <Pressable onPress={() => onPress()}>
      <Text>
        {timeLeft.minutes > 0 ? timeLeft.minutes + ":" : "00:"}
        {timeLeft.seconds > 0 ? timeLeft.seconds : "00"}
      </Text>
    </Pressable>
  );

  const activeTimerModal = (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={() => {
          /* closeModal(); */
        }}
      >
        <View>
          <View style={styles.modalView}>
            <Text style={styles.titleText}>Active Timer Modal</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.titleText}>
                {timeLeft.minutes > 0 ? timeLeft.minutes + ":" : "00:"}
                {timeLeft.seconds > 0 ? timeLeft.seconds : "00"}
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.buttonClose,
                pressed && { opacity: 0.75 },
              ]}
              onPress={() => onTimerEnd(true)}
            >
              <Text style={styles.textStyle}>Cancel Timer</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.buttonClose,
                pressed && { opacity: 0.75 },
              ]}
              onPress={() => exitActiveTimerModal()}
            >
              <Text style={styles.textStyle}>x</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );

  return showActiveTimerModal ? activeTimerModal : headerTimer;
}

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    marginTop: "10%",
    width: "90%",
    height: "88%",
    backgroundColor: "white",
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
});
