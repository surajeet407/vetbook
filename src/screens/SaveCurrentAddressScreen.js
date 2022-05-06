import React, {useEffect, useState, useRef} from 'react';
 import {
   StyleSheet,
   Text,
   View,
   TextInput,
   Animated,
   TouchableOpacity,
   KeyboardAvoidingView,
   ImageBackground,
   ScrollView,
   Keyboard
 } from 'react-native';
 import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'; 
 import Geolocation from '@react-native-community/geolocation';
 import Colors from '../util/Colors';
 import Button from '../reusable_elements/Button';
 import Geocoder from 'react-native-geocoding';
 import Icon, { Icons } from '../util/Icons';
 import LottieView from 'lottie-react-native';
 import FormElement from '../reusable_elements/FormElement';
 import SectionBanner from '../reusable_elements/SectionBanner';
 import * as Animatable from 'react-native-animatable';
 import RNBounceable from "@freakycoder/react-native-bounceable";
 import Toast from 'react-native-toast-message';
 import GeneralHeader from '../reusable_elements/GeneralHeader';
 import AsyncStorage from '@react-native-async-storage/async-storage';
 import i18n from '../util/i18n';
 
 const AddressScreen = ({navigation, route}) => {
  const [status, setStatus] = useState('')
   const tags = ['Home', 'Work', 'Other'];
  const [address, setAddress] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [floor, setFloor] = useState("");
  const [nearby, setNearby] = useState("");
  const [tag, setTag] = useState("");
  
  const [region, setRegion] = useState({
    latitude: 22.357908900473035,
    longitude: 87.6132639683783,
    latitudeDelta: 0.0032349810554670455,
    longitudeDelta: 0.0025001540780067444
  });
    
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    useEffect(() => {
    //   Geolocation.getCurrentPosition(
    //    position => {
    //      console.log(position.coords.latitude);
    //      console.log(position.coords.longitude);
    //     const initialPosition = JSON.stringify(position);
    //     setRegion({
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.longitude,
    //       latitudeDelta: 0.025,
    //       longitudeDelta: 0.025
    //     })
    //     // Geocoder.init("AIzaSyDczxLM-oDcArN8gNEn_tvckoyw_qO9YNQ", {language : "en"});
    //     // Geocoder.from(position.coords.latitude, position.coords.longitude)
    //     //   .then(json => {
    //     //   var addressComponent = json.results[0].address_components[0];
    //     //     console.log(addressComponent);
    //     //   })
    //     //   .catch(error => console.warn(error));
    //   },
    //   error => Alert.alert('Error', JSON.stringify(error)),
    //   {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    // );
    AsyncStorage.getItem('userStatus', (error, result) => {
      setStatus(result)
    })
   }, []);

   const onPressTag = (index) => {
    setTag(tags[index]);
  }
  const onPressSaveAddress = () => {
      let text = ""
        if(address === "") {
          text = "Please enter complete address";
        } else if(floor === "") {
          text = "Please enter floor/ appartment";
        } else if(nearby === "") {
          text = "Please enter nearby"
        } else if(tag === "") {
          text = "Please select tag";
        } 
        
        if(address !== "" && floor !== "" && nearby !== "" && tag !== ""){
          if (route.params.from === 'Home') {
            navigation.navigate("HomeBottomTabBar", {screen: "Home"});
          } else {
            navigation.navigate("Confirm");
          }
        } else {
          Keyboard.dismiss();
          Toast.show({
            type: 'customToast',
            text1: text,
            position: 'top',
            visibilityTime: 1500,
            topOffset: 15,
            props: {
                backgroundColor: Colors.error_toast_color
            }
          });
        }
    
  }

   return (
    <KeyboardAvoidingView behavior='height' style={{flex: 1, backgroundColor: Colors.appBackground}}>
          <GeneralHeader 
              showRigtIcon={false}
              rightIconType={Icons.MaterialIcons}
              rightIconName={'navigate-before'} 
              rightIconSize={45} 
              rightIconColor={Colors.black}
              rightIconBackgroundColor={Colors.appBackground}
              onPressRight={() => navigation.goBack()} 

              subHeaderText="A Quick brown fox jumps over the lazy dog... A Quick brown fox jumps over the lazy dog..." 
              showSubHeaderText={false} 
              subHeaderTextSize={20} 
              subHeaderTextColor={Colors.secondary}

              position={'relative'} 
              headerHeight={60}

              headerText={"Save Address"} 
              headerTextSize={25} 
              headerTextColor={Colors.primary} 
              showHeaderText={true}

              showLeftIcon={true}
              leftIconType={Icons.MaterialIcons} 
              leftIconName={'navigate-before'} 
              leftIconSize={45} 
              leftIonColor={Colors.black}
              leftIconBackgroundColor={Colors.appBackground}
              onPressLeft={() => navigation.goBack()} 
          />
          <View style={[{
            flex: 1,
            overflow: 'hidden',
            backgroundColor: Colors.lightOverlayColor,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            padding: 20,
            }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <View style={{marginTop: 20, marginBottom: 10}}>
                        <SectionBanner fontSize={20} title='Enter Address Details' borderColor={Colors.primary} borderWidth={100} titleColor={Colors.mediumDark}/>
                    </View>
                    <FormElement onChangeText={(val) => setAddress(val)} inputValue={address} showLabel={false} title='Complete Address' type='input' labelColor={Colors.secondary} keyboardType='default' maxLength={10}/>
                    <FormElement onChangeText={(val) => setFloor(val)} inputValue={floor} showLabel={false} title='Floor /Apartment' type='input' labelColor={Colors.secondary} keyboardType='default' maxLength={10}/>
                    <FormElement onChangeText={(val) => setNearby(val)} inputValue={nearby} showLabel={false} title='Nearby' type='input' labelColor={Colors.secondary} keyboardType='default' maxLength={10}/>
                    <FormElement onPressToken={onPressTag} tokens={tags}  showLabel={true} title='Select Tag' type='token' labelColor={Colors.secondary}/>
                    {status === "loggedOut" && (
                      <FormElement onChangeText={(val) => setPhoneNo(val)} inputValue={phoneNo} showLabel={false} title='Phone No' type='input' labelColor={Colors.secondary} keyboardType='default' maxLength={10}/>
                    )}
                </View>
            </ScrollView>
        </View>
        <ImageBackground blurRadius={0} source={require('../assets/images/background6.png')} style={{overflow: 'hidden', position: 'absolute', bottom: 0, width: '100%', alignItems: 'center', justifyContent: 'center', padding: 10, height: 100,  backgroundColor: Colors.secondary, borderTopLeftRadius: 50, elevation: 15, borderTopRightRadius: 50}}>
          <Animatable.View delay={100} animation={'slideInUp'} style={{width: '90%'}}>
            <Button backgroundColor={Colors.primary} iconPostionRight={true} useIcon={true} icon="long-arrow-right" title="Save Address" onPress={onPressSaveAddress}/>
          </Animatable.View>
        </ImageBackground>
    </KeyboardAvoidingView>
  );
 };
 
 const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    borderRadius: 50,
    width: '100%',
    height: '100%',
  },
  addressContainer: {
    flex: 1.1,
    backgroundColor: Colors.dark,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    marginTop: 10,
    height: 50,
    borderWidth: 1,
    padding: 10,
    width: '100%',
    color: Colors.primary,
    fontSize: 20,
    fontFamily: 'PTSerif-Regular'
  },
  headerText: {
    fontSize: 25,
    color: 'white',
    textShadowColor: "grey",
    fontFamily: 'Oswald-Medium'
  },
 });
 
 export default AddressScreen;
 