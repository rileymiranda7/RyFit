import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import InsetShadow from "react-native-inset-shadow";

import { Exercise } from "../../models/exercise";
import IconButton from "../IconButton";
import { createWorkout } from "../../utils/database/insertFunctions";
import { Colors } from "../../constants/colors";

export default function RoutineItem({ routineName, exercises }) {
  let exerciseList;

  const navigation = useNavigation();

  function shouldBeginRoutine(routineName) {
    Alert.alert(
      `Begin ${routineName} ?`,
      "Start workout with this exercise routine?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Start",
          onPress: async () => {
            const workoutId = await createWorkout(routineName);
            navigation.navigate("ActiveWorkout", {
              routineName: routineName,
              workoutId: workoutId
            });
          },
        },
      ]
    );
  }

  let renderList;
  if (exercises.length === 0) {
    renderList = (
      <Text style={styles.exerciseTextStyle}>
        no exercises yet...
      </Text>
    );
  } else if (exercises.length > 4) {
    let shortenedList = exercises.slice(0, 4);
    shortenedList.push(new Exercise("..."));
    exerciseList = shortenedList;
    renderList = exerciseList.map((exercise, index) => {
      return (
        <Text style={styles.exerciseTextStyle} key={index}>
          {
            exercise.name.length > 20 ? 
              exercise.name.substring(0,15) + "...": 
              exercise.name
          }
        </Text>
      );
    });
  } else {
    exerciseList = exercises;
    renderList = exerciseList.map((exercise, index) => {
      return (
        <Text style={styles.exerciseTextStyle} key={index}>
          {
            exercise.name.length > 20 ? 
              exercise.name.substring(0,15) + "...": 
              exercise.name
          }
        </Text>
      );
    });
  }



  return (
    <Pressable
      style={({ pressed }) => [pressed && styles.pressed, styles.container]}
      onPress={() => {
        shouldBeginRoutine(routineName);
      }}
    >
      <InsetShadow
        shadowRadius={5}
        shadowColor="#5405ff"
        left={false}
        bottom={false}
        containerStyle={{
          borderRadius: 10
        }}
        shadowOpacity={1}
      >
        <InsetShadow
          shadowRadius={5}
          shadowColor="#28037d"
          right={false}
          top={false}
          containerStyle={{
            borderRadius: 10
          }}
          shadowOpacity={1}
        >
          <View style={{
            margin: 2,
            borderRadius: 5
            }}>
            <View style={styles.headerContainer}>
              <Text 
                style={styles.routineNameStyle}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {routineName}
              </Text>
              <View style={styles.buttonContainer}>
                <IconButton
                  icon="ellipsis-horizontal-circle-outline"
                  size={35}
                  color="white"
                  onPress={() => {
                    navigation.navigate("RoutineModal", {
                      routineName: routineName,
                    });
                  }}
                />
              </View>
            </View>
            <View style={{paddingBottom: 5}}>
              {renderList}
            </View>
          </View>
        </InsetShadow>
      </InsetShadow>
    </Pressable>
  );
}
//#3503a6 #4705e0
const styles = StyleSheet.create({
  container: {
    margin: 2,
    minWidth: "49%",
    maxWidth: "49%",
    borderRadius: 5,
  },
  routineNameStyle: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    maxWidth: "60%",
    textAlign: "left",
    padding: 5
  },
  exerciseTextStyle: {
    color: "white",
    paddingHorizontal: 5
  },
  buttonContainer: {
    paddingTop: 5,
    paddingRight: 5
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pressed: {
    opacity: 0.75,
  },
});
