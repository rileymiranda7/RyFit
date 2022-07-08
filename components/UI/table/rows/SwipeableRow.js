import { View, Text, Button } from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";
import { Swipeable } from "react-native-gesture-handler";

import IncompleteRow from "./IncompleteRow";

export default function SwipeableRow({ set, onPress }) {
  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <Button title="delete" onPress={onPress.bind(this, set.setNumber)} />
    );
  };
  const renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return <Button title="leftbutton" />;
  };

  return <View></View>;
}
