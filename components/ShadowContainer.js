import { View, Text } from 'react-native'
import React from 'react'
import InsetShadow from 'react-native-inset-shadow'

export default function ShadowContainer({ 
  children, 
  lightShadowColor, 
  darkShadowColor,
  margin 
}) {
  return (
    <InsetShadow
        shadowRadius={5}
        shadowColor={lightShadowColor}
        left={false}
        bottom={false}
        containerStyle={{
          borderRadius: 10
        }}
        shadowOpacity={1}
      >
        <InsetShadow
          shadowRadius={5}
          shadowColor={darkShadowColor}
          right={false}
          top={false}
          containerStyle={{
            borderRadius: 10
          }}
          shadowOpacity={1}
        >
          <View style={{
            margin: margin,
            borderRadius: 5
            }}
          >
            {children}
          </View>
        </InsetShadow>
      </InsetShadow>
  )
}