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
    Dimensions
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Colors from '../util/Colors';
import Button from '../reusable_elements/Button';
import Icon, {Icons} from '../util/Icons';
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';
import RNBounceable from "@freakycoder/react-native-bounceable";
import GeneralHeader from '../reusable_elements/GeneralHeader';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import FormElement from '../reusable_elements/FormElement';
import AsyncStorage from '@react-native-async-storage/async-storage';
 import database from '@react-native-firebase/database';
 import uuid from 'react-native-uuid';
import i18n from '../util/i18n';

const AddressScreen = ({navigation, route}) => {
    const [status, setStatus] = useState('')
    const [address, setAddress] = useState("");
    const [showMap,
        setShowMap] = useState(true);
    const [checked, setChecked] = useState("true");
    const defaultOptions = ["true", "false"]
    const tags = ['Home', 'Work', 'Other'];
    const [phoneNo, setPhoneNo] = useState("");
    const [floor, setFloor] = useState("");
    const [nearby, setNearby] = useState("");
    const [tag, setTag] = useState("");
    const [name, setName] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [region,
        setRegion] = useState(null);
    
    const _getAddress = (lat, lan) => {
        // let positionStackApi = "http://api.positionstack.com/v1/reverse?access_key=1e7810be054a872c3ed9c3b694644" +
        // "7c7&query=22.357908900473035,87.6132639683783"
        let url = "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + lat + "&longitude=" + lan + "&localityLanguage=en"
        axios
        .get(url)
        .then(function (response) {
            // setAddress(response.data.data[0].label)
            let address = ""
            for(let i = response.data.localityInfo.administrative.length - 1; i >= 0; i--) {
                address = address + response.data.localityInfo.administrative[i].name + ", "
            }
            setAddress(address)
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
    }
    const onPressTag = (index) => {
        setTag(tags[index]);
      }
      const onPressDefault = (index) => {
        setChecked((defaultOptions[index]));
      }
      
      const onPressSaveAddress = () => {
          let text = ""
            if(address === "") {
              text = "Please enter complete address";
            } else if(floor === "") {
              text = "Please enter floor / appartment";
            } else if(nearby === "") {
              text = "Please enter nearby"
            } else if(tag === "") {
              text = "Please select tag";
            } else if(name === "") {
              text = "Please enter name";
            } else if(pinCode === "") {
              text = "Please enter pin code";
            }  else if(checked === "") {
              text = "Please select default";
            }
            
            if(address !== "" && floor !== "" && nearby !== "" && tag !== ""  && name !== "" && pinCode !== ""){
              if (status === 'loggedOut') {
                if(phoneNo === "") {
                  Keyboard.dismiss();
                  Toast.show({
                    type: 'customToast',
                    text1: "Please enter phone no",
                    position: 'top',
                    visibilityTime: 1500,
                    topOffset: 15,
                    props: {
                        backgroundColor: Colors.error_toast_color
                    }
                  });
                } else {
                  
                  AsyncStorage
                  .getItem('anonymusAddresses')
                  .then((data) => {
                      let obj = {
                        ...region, 
                        id: uuid.v4(),
                        tag: tag,
                        default: checked === "true"?true:false ,
                        address: address,
                        floor: floor,
                        nearby: nearby,
                        name: name,
                        pinCode: pinCode,
                        phoneNo: phoneNo
                      }, ar = [];
                      if (data && JSON.parse(data).length > 0) {
                        let actData = JSON.parse(data)
                        if(checked === "true") {
                          for(var i = 0; i < actData.length; i++) {
                            actData[i].default = false
                          }
                        }
                        ar = actData
                        ar.push(obj)
                      } else {
                        ar.push(obj)
                      }
                      AsyncStorage
                      .setItem('anonymusAddresses', JSON.stringify(ar))
    
                      
                      Toast.show({
                        type: 'customToast',
                        text1: "Address saved...",
                        position: 'top',
                        visibilityTime: 1500,
                        topOffset: 15,
                        props: {
                              backgroundColor: Colors.green2
                        }
                        
                    });
                    navigation.goBack()
                  });
                }
                
            } else {
                AsyncStorage
                    .getItem('phoneNo')
                    .then((phoneNo, msg) => {
                        if (phoneNo) {
                            database()
                                .ref('/users/' + phoneNo + "/addresses")
                                .once('value')
                                .then(snapshot => {
                                    let data = {
                                      ...region, 
                                      id: uuid.v4(),
                                      tag: tag,
                                      default: checked === "true"? true:false,
                                      address: address,
                                      floor: floor,
                                      nearby: nearby,
                                      name: name,
                                      pinCode: pinCode
    
                                    }, ar = [];
                                    if (snapshot.val()) {
                                        let actData = snapshot.val()
                                        if(checked === "true") {
                                          for(var i = 0; i < actData.length; i++) {
                                            actData[i].default = false
                                          }
                                        }
                                        ar = actData;
                                        ar.push(data)
                                    } else {
                                      ar.push(data)
                                    }
                                    // console.log(data)
                                    database()
                                        .ref('/users/' + phoneNo + "/addresses").set(ar)
                                    Toast.show({
                                        type: 'customToast',
                                        text1: "Address saved...",
                                        position: 'top',
                                        visibilityTime: 1500,
                                        topOffset: 15,
                                        props: {
                                              backgroundColor: Colors.green2
                                        }
                                        
                                    });
                                    navigation.goBack()
                                })
                        }
                    })
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

    useEffect(() => {    
        // Geocoder.init("AIzaSyBBPGbYThYVRWkyWMt8-N5Y_wjtMFcEmRQ", {language : "en"});
        //     Geocoder.from(22.357908900473035, 87.6132639683783)
        //     .then(json => {
        //         var addressComponent = json.results[0].address_components[0];       
        //         console.log(addressComponent);
        //     })
        //     .catch(error => console.warn(error));   
        AsyncStorage.getItem('userStatus', (error, result) => {
            setStatus(result)
        })
        Geolocation.getCurrentPosition((position) => {      
            const initialPosition = JSON.stringify(position);       
            setRegion({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.0032349810554670455,
                longitudeDelta: 0.0025001540780067444
            })   
            // console.log(position.coords.latitude, position.coords.longitude)
            _getAddress(position.coords.latitude, position.coords.longitude)
               
        },    
        error => console.log('Error',
            JSON.stringify(error)),     
        {enableHighAccuracy: true, timeout: 200000, maximumAge: 10000},   );  
    }, []);

    const onRegionChange = (region) => {
        // console.log(region)
        setRegion(region)
        _getAddress(region.latitude, region.longitude)
    }

    const onPressGoToSaveAddress = () => {
        setShowMap(false)
    }

    return (
        <KeyboardAvoidingView behavior='height' style={{
            flex: 1,
            backgroundColor: Colors.appBackground
        }}>
            <View style={styles.container}>
                <GeneralHeader
                    showRigtIcon={showMap? false:true}
                    rightIconType={Icons.MaterialIcons}
                    rightIconName={'close'} 
                    rightIconSize={20} 
                    rightIconWidth={30}
                    rightIconHeight={30}
                    rightIconBorderRadius={20}
                    rightIconColor={Colors.white}
                    rightIconBackgroundColor={Colors.error_toast_color}
                    onPressRight={() => setShowMap(true)} 
                    subHeaderText=""
                    showSubHeaderText={false}
                    subHeaderTextSize={20}
                    subHeaderTextColor={Colors.secondary}
                    position={showMap? 'absolute':'relative'}
                    headerHeight={60}
                    headerText={showMap? "Address":"Save Address"}
                    headerTextSize={25}
                    headerTextColor={Colors.primary}
                    showHeaderText={true}
                    showLeftIcon={showMap? true: false}
                    leftIconType={Icons.MaterialIcons}
                    leftIconName={'navigate-before'}
                    leftIconSize={35}
                    leftIonColor={Colors.black}
                    leftIconBackgroundColor={Colors.appBackground}
                    onPressLeft={() => navigation.goBack()}/>
                
                    {showMap?
                    <View
                        style={{
                        height: Dimensions.get("screen").height / 1.5
                    }}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        region={region}
                        onRegionChange={(region) => onRegionChange(region)}></MapView>
                        <View
                            style={{
                            position: 'absolute',
                            top: '50%',
                            left: '40%'
                        }}>
                            <LottieView
                                style={{
                                width: 80,
                                height: 80
                            }}
                                source={require('../assets/lottie/marker.json')}
                                autoPlay={true}
                                loop/>
                        </View>
                    </View>
                    :
                    <View style={[{
                        overflow: 'hidden',
                        backgroundColor: Colors.lightOverlayColor,
                        borderTopLeftRadius: 40,
                        borderTopRightRadius: 40,
                        padding: 20,
                        marginBottom: 80
                        }]}>
                        <ScrollView showsVerticalScrollIndicator={false} scrollEventThrottle={16}>
                            <View> 
                                <FormElement inputEditable={false} onChangeText={(val) => setAddress(val)} inputValue={address} showLabel={false} title='Complete Address' type='input' labelColor={Colors.secondary} keyboardType='default' maxLength={100} multiline={true} numberOfLines={3}/>
                                <FormElement onChangeText={(val) => setFloor(val)} inputValue={floor} showLabel={false} title='Floor /Apartment' type='input' labelColor={Colors.secondary} keyboardType='default' maxLength={100}/>
                                <FormElement onChangeText={(val) => setNearby(val)} inputValue={nearby} showLabel={false} title='Nearby' type='input' labelColor={Colors.secondary} keyboardType='default' maxLength={100}/>
                                <FormElement onChangeText={(val) => setName(val)} inputValue={name} showLabel={false} title='Name' type='input' labelColor={Colors.secondary} keyboardType='default' maxLength={100}/>
                                <FormElement onChangeText={(val) => setPinCode(val)} inputValue={pinCode} showLabel={false} title='PIN Code' type='input' labelColor={Colors.secondary} keyboardType='numeric' maxLength={6}/>
                                {status === "loggedOut" && (
                                <FormElement onChangeText={(val) => setPhoneNo(val)} inputValue={phoneNo} showLabel={false} title='Phone No' type='input' labelColor={Colors.secondary} keyboardType='numeric' maxLength={10}/>
                                )}
                                <FormElement onPressToken={onPressTag} tokens={tags}  showLabel={true} title='Select Tag' type='token' labelColor={Colors.secondary}/>
                                <FormElement defaultSelection={0} onPressToken={onPressDefault} tokens={defaultOptions}  showLabel={true} title='Make it as default' type='token' labelColor={Colors.secondary}/>
                            </View>
                        </ScrollView>
                    </View>
                    }
                    
                {showMap?
                <ImageBackground
                    blurRadius={5}
                    source={require('../assets/images/background6.png')}
                    style={{
                    overflow: 'hidden',
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                    height: Dimensions.get("screen").height / 3,
                    backgroundColor: Colors.secondary,
                    borderTopLeftRadius: 50,
                    elevation: 15,
                    borderTopRightRadius: 50
                }}>
                    <View
                        style={{
                        width: "90%",
                        justifyContent: 'space-around',
                        alignItems: 'flex-start'
                    }}>
                        <Text style={styles.headerText}>Select Your Location</Text>
                        <Text style={styles.input}>{address}</Text>
                    </View>
                    <Animatable.View
                        delay={100}
                        animation={'slideInUp'}
                        style={{
                        marginTop: 20
                    }}>
                        <Button
                            backgroundColor={Colors.primary}
                            iconPostionRight={true}
                            useIcon={true}
                            icon="question"
                            title="Confirm Location"
                            onPress={onPressGoToSaveAddress}/>
                    </Animatable.View>
                </ImageBackground>
                :
                <ImageBackground blurRadius={0} source={require('../assets/images/background6.png')} style={{overflow: 'hidden', position: 'absolute', bottom: 0, width: '100%', alignItems: 'center', justifyContent: 'center', padding: 10, height: 80,  backgroundColor: Colors.secondary, borderTopLeftRadius: 50, elevation: 15, borderTopRightRadius: 50}}>
                    <Animatable.View delay={100} animation={'slideInUp'} style={{width: '90%'}}>
                        <Button backgroundColor={Colors.primary} iconPostionRight={true} useIcon={true} icon="long-arrow-right" title="Save Address" onPress={onPressSaveAddress}/>
                    </Animatable.View>
                </ImageBackground>
                }
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        flex: 2.5,
        width: '100%',
        height: '100%'
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
        borderColor: Colors.darkGray,
        borderRadius: 10,
        height: 80,
        padding: 10,
        width: '100%',
        color: Colors.darkGray,
        fontSize: 18,
        fontFamily: 'PTSerif-BoldItalic'
    },
    headerText: {
        fontSize: 25,
        color: Colors.white,
        textShadowColor: Colors.white,
        fontFamily: 'Oswald-Medium'
    }
});

export default AddressScreen;
