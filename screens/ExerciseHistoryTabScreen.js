import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useIsFocused } from '@react-navigation/native'
import { showMessage, hideMessage } from "react-native-flash-message";

export default function ExerciseHistoryTabScreen() {

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      showMessage({
        message: "Swipe down from tab bar to dismiss",
        type: "info",
        statusBarHeight: 50
      })
    }
  }, [isFocused])
  

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity
        onPressOut={() => {
          
        }}
      >
      <Text>ExerciseHistoryTabScreen</Text>

      </TouchableOpacity>
    </View>
  )
}