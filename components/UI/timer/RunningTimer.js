import { View, Text, StyleSheet, Pressable, Modal } from "react-native";
import React, { useState, useEffect, useCallback, useRef } from "react";
import useCountDown from "react-countdown-hook";
import IconButton from "../IconButton";
import { add } from "react-native-reanimated";

// 1 hour
const initialTime = 1 * 60 * 60 * 1000; // initial time in milliseconds
const interval = 1000; // interval to change remaining time amount, defaults to 1000

export default function RunningTimer({ timeInMinutes }) {
  const initialRender = useRef(true);

  const [showActiveTimerModal, setShowActiveTimerModal] = useState(false);

  const [timeLeft, { start, pause, resume, reset }] = useCountDown(
    initialTime,
    interval
  );

  const [minDigit1, setMinDigit1] = useState(timeInMinutes < 10 ? 0 : 1);
  const [minDigit2, setMinDigit2] = useState(
    timeInMinutes < 10 ? timeInMinutes : 0
  );
  const [secDigit1, setSecDigit1] = useState(0);
  const [secDigit2, setSecDigit2] = useState(0);

  const [deficit, setDeficit] = useState((60 - timeInMinutes) * 60 * 1000);

  // returns when updated timer should end at
  // start with 59 minute deficit between real timer
  // and user timer
  const getTimeLeft = () => {
    return timeLeft - deficit;
  };

  // start the timer during the first render
  useEffect(() => {
    if (timeInMinutes < 10) {
      setMinDigit2(timeInMinutes);
    } else {
      setMinDigit1(1);
    }
    start();
  }, []);

  useEffect(() => {
    // greater than or equal to a minute
    if (getTimeLeft() >= 60 * 1000) {
      // greater than or equal to 10 minutes
      if (getTimeLeft() >= 600 * 1000) {
        setMinDigit1(1);
        setMinDigit2(0);
        // between 1 and 10 minutes
      } else {
        setMinDigit1(0);
        setMinDigit2(Math.floor((getTimeLeft() / 60000) % 60));
      }
      // less than a minute
    } else {
      setMinDigit1(0);
      setMinDigit2(0);
    }
    // if equal to any whole minute number
    if (Math.floor((getTimeLeft() / 10000) % 60) === 60) {
      setSecDigit1(0);
      setSecDigit2(0);
    } else {
      setSecDigit1(Math.floor(((getTimeLeft() / 1000) % 60) / 10));
      setSecDigit2(Math.floor((getTimeLeft() / 1000) % 10));
    }
  }, [timeLeft]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    } else if (
      (minDigit1 * 10 + minDigit2) * 60 + secDigit1 * 10 + secDigit2 <= 0 &&
      !initialRender.current
    ) {
      reset();
      //alert("Time for Next Set!");
    }
  }, [minDigit1, minDigit2, secDigit1, secDigit2]);

  const sub10 = () => {
    // timer under a minute
    if (getTimeLeft() < 60 * 1000) {
      // under 10 seconds
      if (secDigit1 === 0) {
        setSecDigit2(0);
        // over 10 seconds
      } else {
        setSecDigit1(secDigit1 - 1);
      }
      // equal to or over a minute
    } else {
      // if at least 1 minute and less than 10 seconds
      if (secDigit1 === 0) {
        setSecDigit1(5);
        setMinDigit2(minDigit2 - 1);
      } else {
        setSecDigit1(secDigit1 - 1);
      }
    }
    setDeficit(deficit + 10000);
  };

  const add10 = () => {
    // when between 50-59 seconds
    if (getTimeLeft() + 10 * 1000 >= 10 * 60 * 1000) {
      alert("Max timer limit reached: 10 minutes");
      return;
    }
    if (secDigit1 === 5) {
      setMinDigit2(minDigit2 + 1);
      setSecDigit1(0);
    } else {
      setSecDigit1(secDigit1 + 1);
    }
    setDeficit(deficit - 10000);
  };

  const restart = useCallback(() => {
    // you can start existing timer with an arbitrary value
    // if new value is not passed timer will start with initial value
    const newTime = 42 * 1000;
    start(newTime);
  }, []);

  const pauseTimer = () => {
    pause();
    return getTimeLeft();
  };

  let renderThis;

  if (showActiveTimerModal) {
    renderThis = (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showActiveTimerModal}
          onRequestClose={() => {
            //closeModal();
          }}
        >
          <View>
            <View style={styles.modalView}>
              <Text style={styles.titleText}>Active Timer Modal</Text>
              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>
                  {minDigit1}
                  {minDigit2}:{secDigit1}
                  {secDigit2}
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
                onPress={() => setShowActiveTimerModal(!showActiveTimerModal)}
              >
                <Text style={styles.textStyle}>x</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    );
  } else {
    renderThis = (
      <View style={styles.container}>
        <IconButton
          onPress={() => sub10()}
          icon={"remove-circle-outline"}
          color="white"
          size={35}
        />
        <Pressable
          onPress={() => {
            setShowActiveTimerModal(!showActiveTimerModal);
          }}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Text style={styles.timerText}>
            {minDigit1}
            {minDigit2}:{secDigit1}
            {secDigit2}
          </Text>
        </Pressable>
        <IconButton
          onPress={() => add10()}
          icon={"add-circle-outline"}
          color="white"
          size={35}
        />
      </View>
    );
  }

  return renderThis;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#6704c3",
    marginBottom: 7,
    marginHorizontal: 0,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 6,
  },
  outerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: 22,
    color: "white",
  },
  pressed: {
    opacity: 0.75,
  },
  modalView: {
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
  titleText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
    backgroundColor: "#2196F3",
    margin: 10,
    padding: 4,
  },
  timerContainer: {
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
});
