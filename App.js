import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  StatusBar,
  LogBox,
  Alert,

  ToastAndroid
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { MenuProvider } from 'react-native-popup-menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackNav from './src/navigation/StackNav';
import Toast from 'react-native-toast-message';
import ToastConfig from './src/util/ToastConfig';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const App = () => {
  const [status, setStatus] = useState('')
  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {   
          // console.log(position.coords.latitude);
          // console.log(position.coords.longitude);  
          let positionStackApi = "http://api.positionstack.com/v1/reverse?access_key=1e7810be054a872c3ed9c3b694644" +
          "7c7&query=22.357908900473035,87.6132639683783"
          let url = "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + position.coords.latitude + "&longitude=" + position.coords.longitude + "&localityLanguage=en"
          axios
          .get(url)
          .then(function (response) {
              // setAddress(response.data.data[0].label)
              let address = ""
              for(let i = response.data.localityInfo.administrative.length - 1; i >= 0; i--) {
                  address = address + response.data.localityInfo.administrative[i].name + ", "
              }
              let obj = {
                lat: position.coords.latitude,
                lan: position.coords.longitude,
                address: address
              }
              let distanceApi = "https://api.mapbox.com/directions/v5/mapbox/driving/88.3971928649,22.6085591476;" + position.coords.longitude + "," + position.coords.latitude + "?annotations=maxspeed&overview=full&geometries=geojson&access_token=pk.eyJ1Ijoic3VyYWplZXQ0MDciLCJhIjoiY2wydWF3YmNmMDA5bTNkbGJhYW13cW01ciJ9.OY-t9No4-FB74KMdzLZ3iw"
              
              axios
              .get(distanceApi)
              .then(function (response) {
                  if(response.data.routes[0].distance > 25000){
                    obj.serviceAvailable = false
                  } else {
                    obj.serviceAvailable = true
                  } 
                  AsyncStorage.setItem("homeAddress", JSON.stringify(obj))
              })
          })
          .catch(function (error) {
              // console.log(error)
              Toast.show({
                  type: 'customToast',
                  text1: "Unable to get your current location...",
                  position: 'top',
                  visibilityTime: 1500,
                  topOffset: 20,
                  props: {
                      backgroundColor: Colors.error_toast_color
                  }
              });
          });
      },
      error => console.log('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    ); 

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // console.log(remoteMessage);
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
  LogBox.ignoreAllLogs();
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
