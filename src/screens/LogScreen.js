import React, {useEffect, useRef, useState} from 'react';
import {
    StyleSheet,
    View,
    KeyboardAvoidingView,
    TextInput,
    ImageBackground,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import Constants from '../util/Constants';
import Colors from '../util/Colors';
import Button from '../reusable_elements/Button';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import Title from '../reusable_elements/Title';
import RNBounceable from "@freakycoder/react-native-bounceable";
import {ActivityIndicator} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import i18n from '../util/i18n';

const LogScreen = ({navigation, route}) => {
    const [logScreenData,
        setLogScreenData] = useState({})
    const [number,
        setNumber] = useState('');
    const [activityIndicator,
        setActivityIndicator] = useState(false);

    const signInWithPhoneNumber = () => {
        if (number.length === 10) {
            setActivityIndicator(true)
            const LOGIN_URL = "https://2factor.in/API/V1/" + Constants.APKI_KEY_2FACTOR + "/SMS/+91" + number + "/AUTOGEN";
            Keyboard.dismiss();
            axios
                .get(LOGIN_URL)
                .then(function (response) {
                    setActivityIndicator(false)
                    navigation.navigate('OTP', {
                        number: number,
                        sessionId: response.data.Details
                    })
                })
                .catch(function (error) {
                    Toast.show({type: 'error', text1: 'We are facing issue to send OTP...'});
                });
        } else {
            Toast.show({type: 'error', text1: 'Please enter a valid mobile no...'});
        }
    }
    // const signInWithPhoneNumber = async () => {   const confirmation = await
    // auth().signInWithPhoneNumber(number);   navigation.navigate('OTP', {number:
    // '+91' + number, sessionId: confirmation}) }
    const getData = () => {
        database()
            .ref('/logScreenData')
            .on('value', snapshot => {
                if (snapshot.val()) {
                    setLogScreenData(snapshot.val())
                }
            })

    }
    useEffect(() => {
        getData();
    }, []);
    return (
        <KeyboardAvoidingView behavior='height' style={{
            flex: 1
        }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <LinearGradient
                    start={{
                    x: 0.0,
                    y: 0.25
                }}
                    end={{
                    x: 0.5,
                    y: 1.0
                }}
                    colors={[Colors.primary, '#000']}
                    style={{
                    flex: 1
                }}>
                    <View style={styles.logUp}>
                        <Animatable.Image
                            animation={'zoomIn'}
                            style={{
                            flex: 1,
                            aspectRatio: 1
                        }}
                            source={{
                            uri: logScreenData.mainImage
                        }}/>
                        <RNBounceable
                            onPress={() => navigation.navigate('HomeBottomTabBar', {
                            screen: 'Home',
                            status: "loggedOut"
                        })}
                            style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: 55,
                            position: 'absolute',
                            top: 15,
                            left: '80%'
                        }}>
                            <Title label={'Skip'} color={Colors.appBackground} size={15}/>
                            <View
                                style={{
                                marginTop: 5
                            }}>
                                <Icon name={'long-arrow-right'} color={Colors.appBackground} size={20}/>
                            </View>
                        </RNBounceable >
                    </View>
                    <Animatable.View animation={'slideInUp'} style={[styles.logDown]}>
                        <ImageBackground
                            blurRadius={2}
                            source={require('../assets/images/background7.png')}
                            style={{
                            borderTopLeftRadius: 40,
                            borderTopRightRadius: 40,
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%'
                        }}>
                            <Animatable.Image
                                animation={'slideInDown'}
                                style={[styles.logoImage]}
                                source={{
                                uri: logScreenData.logoImage
                            }}/>
                            <View
                                style={{
                                width: '100%',
                                top: '-20%',
                                alignItems: 'center'
                            }}>
                                <View
                                    style={{
                                    width: '80%',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    margin: 30
                                }}>
                                    <TextInput
                                        editable={false}
                                        value={'+91'}
                                        textAlign={'center'}
                                        maxLength={10}
                                        style={[
                                        styles.input, {
                                            width: '20%',
                                            borderColor: Colors.darkGray,
                                            backgroundColor: Colors.gray,
                                            borderWidth: 1
                                        }
                                    ]}/>
                                    <TextInput
                                        value={number}
                                        onChangeText={text => setNumber(text)}
                                        autoFocus={true}
                                        caretHidden={true}
                                        placeholderTextColor={Colors.primary}
                                        maxLength={10}
                                        keyboardType="numeric"
                                        placeholder="Enter Mobile No"
                                        style={[
                                        styles.input, {
                                            width: '80%'
                                        }
                                    ]}/>
                                    <ActivityIndicator
                                        style={{
                                        left: -30
                                    }}
                                        animating={activityIndicator}
                                        color={Colors.black800}/>
                                </View>
                                <View
                                    style={{
                                    width: '50%'
                                }}>
                                    <Button
                                        onPress={signInWithPhoneNumber}
                                        backgroundColor={Colors.primary}
                                        iconPostionRight={true}
                                        useIcon={true}
                                        title="Send Code"
                                        icon="long-arrow-right"/>
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
    logoImage: {
        position: 'relative',
        top: "-25%",
        width: 150,
        height: 150,
        borderRadius: 100,
        borderColor: Colors.primary,
        borderWidth: 10
    },
    logUp: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomRightRadius: 40
    },
    logDown: {
        flex: 1.5,
        backgroundColor: Colors.appBackground,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [
            {
                scaleX: 2
            }
        ]
    },
    input: {
        padding: 10,
        fontSize: 20,
        letterSpacing: 1,
        fontFamily: 'PTSerif-Regular',
        backgroundColor: Colors.appBackground,
        elevation: 5
    }
});
export default LogScreen;
