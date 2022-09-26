import { View, Text } from "react-native";
import React from "react";

import IconButton from "./IconButton";

export default function CloseButton({ onPress, size, color }) {
  return (
    <IconButton
      icon="close-circle"
      onPress={onPress}
      size={size}
      color={color}
    />
  );
}
