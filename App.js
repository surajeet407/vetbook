import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  StatusBar,
  LogBox,
  Alert,
  ToastAndroid
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { MenuProvider } from 'react-native-popup-menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackNav from './src/navigation/StackNav';
import Toast from 'react-native-toast-message';
import ToastConfig from './src/util/ToastConfig';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [status, setStatus] = useState('')
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      // console.log('Authorization status:', authStatus);
    }
  }
  const checkToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      //  console.log(fcmToken);
    } 
   }

  useEffect(() => {
    NetInfo.fetch().then(state => {
      if(!state.isConnected) {
        Toast.show({
          type: 'customToast',
          text1: "You are not connected with internet",
          position: 'top',
          visibilityTime: 1500,
          topOffset: 15,
          props: {
              backgroundColor: Colors.error_toast_color
          }
      });
      }
    });
    requestUserPermission()
    checkToken();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
      ToastAndroid.showWithGravityAndOffset(
        "hfhgfdgfdhfhj",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    });
    AsyncStorage.getItem('userStatus', (error, result) => {
      setStatus(result)
    })
    return unsubscribe;
  }, []);
  StatusBar.setHidden(true,true);
  LogBox.ignoreLogs([
    "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
    "Non-serializable values were found in the navigation state"
  ]);
  return (
    <SafeAreaProvider>
      <StatusBar hidden={true} />
      <StackNav status={status}/>
      <Toast config={ToastConfig}/>
    </SafeAreaProvider>
      
  );
};

const styles = StyleSheet.create({
  
});

export default App;
