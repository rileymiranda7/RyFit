import { View, Text } from "react-native";
import React, { useEffect, useRef, useState } from "react";

export default function HeaderTimer({ timerAmount, onTimerEnd }) {
  const deadline = useRef((timerAmount + 1) * 1000 + Date.now());
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
        console.log("inside if diff");
        clearInterval(interval.current);
        onTimerEnd();
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
  return (
    <View>
      <Text>
        {timeLeft.minutes > 0 ? timeLeft.minutes + ":" : "00:"}
        {timeLeft.seconds > 0 ? timeLeft.seconds : "00"}
      </Text>
    </View>
  );
}
