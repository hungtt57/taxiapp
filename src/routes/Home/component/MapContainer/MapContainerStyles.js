import {StyleSheet,Dimensions} from "react-native";

var { width, height } = Dimensions.get('window');
const styles = {
  container : {
      flex : 1,
  },
    map : {
     width : width,
        height:height
    }
};
export default styles;