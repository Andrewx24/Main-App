import { ToastAndroid } from "react-native";
export const showToast = (msg) => {
  ToastAndroid.show(msg, ToastAndroid.LONG, 300);
};
//This function accesses the android toast feature and allows you to pass some information to users e.g errors
//TODO: Switch to react-native-root-siblings so toast is cross compatible