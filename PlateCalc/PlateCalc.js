import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  Switch,
} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

import FortyFive from "./plates/FortyFive";
import ThirtyFive from "./plates/ThirtyFive";
import TwentyFive from "./plates/TwentyFive";
import Ten from "./plates/Ten";
import Five from "./plates/Five";
import TwoPointFive from "./plates/TwoPointFive";
import getNumPlates from "./helper/GetNumPlates";

export default function PlateCalc() {
  const [enteredWeight, setEnteredWeight] = useState(0);
  const [barbellMode, setBarbellMode] = useState(true);
  const [useThirtyFives, setUseThirtyFives] = useState(false);
  const [fortyFiveArr, setFortyFiveArr] = useState([]);
  const [thirtyFiveArr, setThirtyFiveArr] = useState([]);
  const [twentyFiveArr, setTwentyFiveArr] = useState([]);
  const [tenArr, setTenArr] = useState([]);
  const [fiveArr, setFiveArr] = useState([]);
  const [twoPointFiveArr, setTwoPointFiveArr] = useState([]);
  const [inputIsFocused, setInputIsFocused] = useState(false);

  useEffect(() => {
    setFortyFiveArr([]);
    setThirtyFiveArr([]);
    setTwentyFiveArr([]);
    setTenArr([]);
    setFiveArr([]);
    setTwoPointFiveArr([]);
    const {
      numFortyFives,
      numThirtyFives,
      numTwentyFives,
      numTens,
      numFives,
      numTwoPointFives,
    } = getNumPlates(enteredWeight, useThirtyFives, barbellMode);
    let tempFfArr = [];
    for (let i = 0; i < numFortyFives; i++) {
      tempFfArr.push(1);
    }
    setFortyFiveArr([...tempFfArr]);

    let tempThfArr = [];
    for (let i = 0; i < numThirtyFives; i++) {
      tempThfArr.push(1);
    }
    setThirtyFiveArr([...tempThfArr]);

    let tempTfArr = [];
    for (let i = 0; i < numTwentyFives; i++) {
      tempTfArr.push(1);
    }
    setTwentyFiveArr([...tempTfArr]);

    let tempTArr = [];
    for (let i = 0; i < numTens; i++) {
      tempTArr.push(1);
    }
    setTenArr([...tempTArr]);

    let tempFArr = [];
    for (let i = 0; i < numFives; i++) {
      tempFArr.push(1);
    }
    setFiveArr([...tempFArr]);

    let tempTpfArr = [];
    for (let i = 0; i < numTwoPointFives; i++) {
      tempTpfArr.push(1);
    }
    setTwoPointFiveArr([...tempTpfArr]);
  }, [enteredWeight, barbellMode, useThirtyFives]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="barbell-outline" color="white" size={40} />
            <Text style={{ color: "white", fontSize: 25, marginVertical: "5%" }}>
              {" Riley's Plate Calculator"}
            </Text>
          </View>
          <SafeAreaView style={styles.weightsContainer}>
            {fortyFiveArr.map((_, index) => {
              return <FortyFive key={index} />;
            })}
            {useThirtyFives &&
              thirtyFiveArr.map((_, index) => {
                return <ThirtyFive key={index} />;
              })}
            {twentyFiveArr.map((_, index) => {
              return <TwentyFive key={index} />;
            })}
            {tenArr.map((_, index) => {
              return <Ten key={index} />;
            })}
            {fiveArr.map((_, index) => {
              return <Five key={index} />;
            })}
            {twoPointFiveArr.map((_, index) => {
              return <TwoPointFive key={index} />;
            })}
          </SafeAreaView>
          <View style={styles.inputContainer}>
            <View style={{ flex: 1 }}>
              <View style={styles.inputRow}>
                <Text
                  style={{ color: "white", fontSize: 20, paddingHorizontal: 5 }}
                >
                  Barbell Mode:{" "}
                </Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={barbellMode ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => setBarbellMode(!barbellMode)}
                  value={barbellMode}
                />
              </View>
              <View style={styles.inputRow}>
                <Text
                  style={{ color: "white", fontSize: 20, paddingHorizontal: 5 }}
                >
                  35 lbs plates:{" "}
                </Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={useThirtyFives ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => setUseThirtyFives(!useThirtyFives)}
                  value={useThirtyFives}
                />
              </View>
              <Text style={{ color: "white", fontSize: 13, textAlign: "center" }}>
                {barbellMode ? "*Max weight 1000 lbs" : "*Max weight 500 lbs"}
              </Text>
            </View>
            <View style={{
              flexDirection: "row", 
              minWidth: "42%",
              maxWidth: "42%", 
              justifyContent: "center",
              padding: 10
              }}
            >
              <TextInput
                style={[styles.input, inputIsFocused && {
                  borderWidth: 2,
                  borderColor: "white",
                }]}
                keyboardType="decimal-pad"
                onChangeText={setEnteredWeight}
                placeholder="ex. 135"
                contextMenuHidden={true}
                keyboardAppearance='dark'
                maxLength={6}
                selectTextOnFocus={true}
                onFocus={() => {
                  setInputIsFocused(!inputIsFocused);
                }}
                onBlur={() => {
                  setInputIsFocused(!inputIsFocused);
                }}
              />
              <Text style={{ color: "white", fontSize: 20, padding: 5 }}>
                lbs
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flex: 5,
    flexDirection: "row",
  },
  input: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: "gray",
    textAlign: "center",
    fontSize: 25,
    
    maxHeight: "10%",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  weightsContainer: {
    flex: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
