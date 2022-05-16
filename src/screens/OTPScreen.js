import React, {useEffect, useRef, useState} from 'react';
 import {
   StyleSheet,
   Text,
   View,
   KeyboardAvoidingView,
   ImageBackground,
   Dimensions,
   TextInput,
   Keyboard,
   TouchableWithoutFeedback
 } from 'react-native';
 import Constants from '../util/Constants';
 import Colors from '../util/Colors';
 import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
 import Title from '../reusable_elements/Title';
 import * as Animatable from 'react-native-animatable';
 import RNBounceable from "@freakycoder/react-native-bounceable";
 import Icon from 'react-native-vector-icons/Ionicons';
 import Toast from 'react-native-toast-message';
 import Button from '../reusable_elements/Button';
 import LinearGradient from 'react-native-linear-gradient';
 import AsyncStorage from '@react-native-async-storage/async-storage';
 import axios from 'axios';
 import auth from '@react-native-firebase/auth';
 import database from '@react-native-firebase/database';
 import messaging from '@react-native-firebase/messaging';
 import { CommonActions } from '@react-navigation/native';
 import i18n from '../util/i18n';
 
 const OTPScreen = ({navigation, route}) => {
  const [otpScreenData, setOtpScreenData] = useState({})
  const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');
  const [code3, setCode3] = useState('');
  const [code4, setCode4] = useState('');
  const [code5, setCode5] = useState('');
  const [code6, setCode6] = useState('');
  const input1 = useRef(null);
  const input2 = useRef(null);
  const input3 = useRef(null);
  const input4 = useRef(null);
  const input5 = useRef(null);
  const input6 = useRef(null);
  const number = route.params.number;
  const [sessionId, setSessionId] = useState(route.params.sessionId);
  const [timerVisible, setTimerVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
        input1.current.focus();
      }, 500);
  }, []);

  // const verifyCode = async () => {
  //   Keyboard.dismiss();
  //   let number = code1 + code2 + code3 + code4 + code5 + code6;
  //   try {
  //     await sessionId.confirm(number);
  //     navigation.navigate('Home');
  //   } catch (error) {
  //     console.log('Invalid code.');
  //   }
     
  // }

  const verifyCode = () => {
    Keyboard.dismiss();
    let code = code1 + code2 + code3 + code4 + code5 + code6;
    const VERYFY_URL = "https://2factor.in/API/V1/" + Constants.APKI_KEY_2FACTOR + "/SMS/VERIFY/" + sessionId + "/" + code
    axios.get(VERYFY_URL)
    .then(function (response) {
      AsyncStorage.setItem('userStatus', 'loggedIn')
      database().ref('/users/' + number).once("value").then((data) => {
        if(data) {
          database().ref('/users/' + number).update({active: true})
        } else {
          messaging()
          .getToken()
          .then(token => {
            database().ref('/users/' + number).set({active: true, canDeleteAccount: false, token: token})
          });
          
        }
      })
      
      AsyncStorage.setItem('phoneNo', number)
      navigation.dispatch(
        CommonActions.navigate({
          name: 'HomeBottomTabBar',
          screen: 'Home',
          params: {status: "loggedIn"}
        })
      );
    })
    .catch(function (error) {
        AsyncStorage.setItem('userStatus', 'loggedOut')
        AsyncStorage.removeItem('phoneNo')
        clearInputs();
        Toast.show({
          type: 'error',
          text1: 'Please enter correct OTP',
        });
    });  
  }

  const clearInputs = () => {
    setCode1('');
    setCode2('');
    setCode3('');
    setCode4('');
    setCode5('');
    setCode6('');
  }

  const onRequestOTP = () => {
    setTimerVisible(true);
    clearInputs();
    input1.current.focus();
    const LOGIN_URL = "https://2factor.in/API/V1/" + Constants.APKI_KEY_2FACTOR + "/SMS/+91" + number + "/AUTOGEN/";
    Keyboard.dismiss();
    axios.get(LOGIN_URL)
      .then(function (response) {
        setSessionId(response.data.Details);
      })
      .catch(function (error) {
          Toast.show({
            type: 'error',
            text1: 'We are facing issue to send OTP...',
          });
      });
  }

  const onComplete = () => {
    setTimerVisible(false);
    Keyboard.dismiss();
    clearInputs();
    
  }
  const getData = () => {
    database()
    .ref('/otpScreenData')
    .on('value', snapshot => {
      if(snapshot.val()) {
        setOtpScreenData(snapshot.val())
      }
    })
    
  }
  useEffect(() => {
    getData();
  }, []);
   return (
    <KeyboardAvoidingView behavior='height' style={{ flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <LinearGradient start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}} colors={['#459333', Colors.primary]} style={{ flex: 1 }}>
            <View style={styles.logUp}>
              <Animatable.Image style={styles.screenImage} animation={'bounceInDown'} source={{uri: otpScreenData.mainImage}}/>
              <Animatable.View animation={'fadeInUp'} style={{alignItems: 'center'}}>
                <Title size={35} bold={true} color={Colors.appBackground} label="OTP Verification"/>
                <View style={{marginTop: 10}}>
                  <Title size={25} bold={true} color="#c4c4c4" label="We have sent the code verification..."/>
                </View>
              </Animatable.View>
              
              <RNBounceable onPress={() => navigation.navigate('Log')} style={{ width: 45, position: 'absolute', top: 25, left: '95%'}}>
                  <Icon name={'close-circle-outline'} style={{fontSize: 45}} color={"#fff"}/>
              </RNBounceable >
            </View>
            <Animatable.View animation={'slideInUp'} style={[styles.logDown]}>
              <ImageBackground blurRadius={2} source={require('../assets/images/background6.png')} style={{borderTopLeftRadius: 40,
                borderTopRightRadius: 40, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'space-evenly'}}>
                <View style={{justifyContent: 'space-evenly', width: '100%', alignItems: 'center'}}>
                    {timerVisible ?
                    <View style={{alignItems: 'center' }}>
                      <View style={{width: '60%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                        <Text style={styles.text}>Verify OTP</Text>
                        <View style={{marginTop: 10}}>
                          <CountdownCircleTimer
                            size={40}
                            strokeWidth={6}
                            isPlaying
                            duration={30}
                            colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                            colorsTime={[30, 20, 10, 0]}
                            onComplete={onComplete}
                            >
                            {({ remainingTime }) => <Text style={{color: Colors.mediumDark, fontSize: 15, fontWeight: 'bold'}}>{remainingTime}</Text>}
                          </CountdownCircleTimer>
                        </View>
                      </View>
                    </View>
                    :
                    <RNBounceable onPress={onRequestOTP}>
                      <Text style={styles.noOTPText}>Didn't get OTP? Request again</Text>
                    </RNBounceable>
                    }
                    <View style={{width: '90%', justifyContent: 'space-evenly', flexDirection: 'row', margin: 30}}>
                        <TextInput ref={input1} onChangeText={text => {
                            setCode1(text)
                            if(text.length > 0){
                              input2.current.focus();
                            }
                          }} keyboardType='numeric' value={code1} textAlign={'center'} maxLength={1} style={styles.input} />
                        <TextInput ref={input2} onChangeText={text => {
                            setCode2(text)
                            if(text.length > 0){
                              input3.current.focus();
                            } else {
                              input1.current.focus();
                            }
                          }} keyboardType='numeric' value={code2} textAlign={'center'} maxLength={1} style={styles.input} />
                        <TextInput ref={input3} onChangeText={text => {
                            setCode3(text)
                            if(text.length > 0){
                              input4.current.focus();
                            } else {
                              input2.current.focus();
                            }
                          }} keyboardType='numeric' value={code3} textAlign={'center'} maxLength={1} style={styles.input} />
                        <TextInput ref={input4} onChangeText={text => {
                            setCode4(text)
                            if(text.length > 0){
                              input5.current.focus();
                            } else {
                              input3.current.focus();
                            }
                          }} keyboardType='numeric' value={code4} textAlign={'center'} maxLength={1} style={styles.input} />
                        <TextInput ref={input5} onChangeText={text => {
                            setCode5(text)
                            if(text.length > 0){
                              input6.current.focus();
                            } else {
                              input4.current.focus();
                            }
                          }} keyboardType='numeric' value={code5} textAlign={'center'} maxLength={1} style={styles.input} />
                        <TextInput ref={input6} onChangeText={text => {
                            setCode6(text)
                            if(text.length > 0){
                              Keyboard.dismiss();
                            } else {
                              input5.current.focus();
                            }
                          }} keyboardType='numeric' value={code6} textAlign={'center'} maxLength={1} style={styles.input} />
                    </View>
                    <View style={{}}>
                      <Button onPress={verifyCode} backgroundColor={'green'} iconPostionRight={true} useIcon={true} title="Verify" icon="long-arrow-right"/>
                    </View>
                  </View>
              </ImageBackground>
            </Animatable.View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
   );
 };
 
 const styles = StyleSheet.create({
  screenImage: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height / 4,
  },
   logUp: {
    flex: 2,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-evenly'
   },
   logDown: {
    flex: 1.5,
    backgroundColor: Colors.appBackground,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    justifyContent: 'center',
    alignItems: 'center'
   },
  otpInput: {
    height: 30,
    borderWidth: 2,
    elevation: 2,
    borderColor: Colors.gray,
    width: '15%',
    color: Colors.appBackground,
    fontSize: 20,
    fontFamily: 'PTSerif-Regular',
    borderRadius: 50
  },
  text: {
    fontSize: 30,
    fontFamily: 'Oswald-SemiBold',
    color: Colors.mediumDark,
    marginLeft: 8,
    marginTop: 8
  },
  timerText: {
    fontSize: 20,
    fontFamily: 'PTSerif-Regular',
    color: Colors.primary,
    backgroundColor: Colors.mediumDark,
    padding: 10,
    borderRadius: 25
  },
  noOTPText: {
    fontSize: 20,
    elevation: 5,
    fontFamily: 'Redressed-Regular',
    color: Colors.primary,
    backgroundColor: Colors.appBackground,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  codeInputFieldStyle: {
    borderWidth: 0,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 5,
    color: Colors.primary,
    fontFamily: 'Oswald-Bold',
    fontSize: 20
  },
  input: {
    elevation: 5, 
    width: 50, 
    borderColor: Colors.gray, 
    backgroundColor: Colors.appBackground, 
    borderWidth: 1
  },
  codeInputHighlightStyle: {
    borderColor: Colors.mediumDark,
  }
 });
 
 export default OTPScreen;
 