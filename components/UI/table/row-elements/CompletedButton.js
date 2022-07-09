import { useState } from "react";
import { View, Text } from "react-native";

import IconButton from "../../IconButton";
import { Colors } from "../../../../constants/colors";

export default function CompletedButton({ inputChangedHandler }) {
  const [isCompleted, setIsCompleted] = useState(false);

  function onPress() {
    console.log("completed pressed");
    inputChangedHandler(!isCompleted);
    setIsCompleted(!isCompleted);
  }

  return (
    <IconButton
      icon="checkbox"
      size={28}
      color={isCompleted ? Colors.neonGreen : "white"}
      onPress={onPress}
    />
  );
}
