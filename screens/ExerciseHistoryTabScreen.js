import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useIsFocused } from '@react-navigation/native'
import { showMessage, hideMessage } from "react-native-flash-message";

import {Picker} from '@react-native-picker/picker';

export default function ExerciseHistoryTabScreen() {

  const isFocused = useIsFocused();

  const [selectedRestTimeAmount, setSelectedRestTimeAmount] = useState();

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

      <Picker
          selectedValue={selectedRestTimeAmount}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedRestTimeAmount(itemValue)
          }>
          <Picker.Item label="0:10" value="00:10" />
          <Picker.Item label="0:20" value="00:20" />
        </Picker>

      </TouchableOpacity>
    </View>
  )
}