import { View, Text } from "react-native";
import React from "react";

import IconButton from "./IconButton";

export default function BackButton({ onPress, size, color }) {
  return (
    <IconButton
      icon="arrow-back-circle-outline"
      onPress={onPress}
      size={size}
      color={color}
    />
  );
}
