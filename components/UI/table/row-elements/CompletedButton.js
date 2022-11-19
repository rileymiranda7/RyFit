import { useState } from "react";
import { View, Text } from "react-native";

import IconButton from "../../IconButton";
import { Colors } from "../../../../constants/colors";

export default function CompletedButton({ inputChangedHandler, setIsCompleted }) {
  
  function onPress() {
    inputChangedHandler("rndm str for enteredValue cuz we don't need it");
  }

  return (
    <IconButton
      icon="checkbox"
      size={28}
      color={setIsCompleted ? Colors.neonGreen : "white"}
      onPress={onPress}
    />
  );
}
