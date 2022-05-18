import React, {useEffect, useRef, useState} from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    ScrollView,
    Animated,
    Text,
    KeyboardAvoidingView,
    ImageBackground,
    Keyboard
} from 'react-native';

import Colors from '../util/Colors';
import FormElement from '../reusable_elements/FormElement';
import Button from '../reusable_elements/Button';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import Toast from 'react-native-toast-message';
import Title from '../reusable_elements/Title';
import SectionBanner from '../reusable_elements/SectionBanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DefaltAddressComponent from '../reusable_elements/DefaltAddressComponent';
import database from '@react-native-firebase/database';
import uuid from 'react-native-uuid';
import * as Animatable from 'react-native-animatable';
import Icon, {Icons} from '../util/Icons';
import i18n from '../util/i18n';

const RelocationDetailsScreen = ({navigation, route}) => {
    // console.log(route.params.details)
    const [defaltAddress, setDefaltAddress] = useState(null)
    const [status,
        setStatus] = useState("")
    const [address1,
        setAddress1] = useState("");
    const [address2,
        setAddress2] = useState("");
    const [city,
        setCity] = useState("");
    const [state,
        setState] = useState("");
    const [zip,
        setZip] = useState("");
    const [phoneNumber,
        setPhoneNumber] = useState("")

    const saveRelocationDetails = () => {
        let ar = [],
            obj = {
                ...route.params.details,
                currentLocation: defaltAddress,
                dropLocation: {
                    address1: address1,
                    address2: address2,
                    city: city,
                    state: state,
                    zip: zip,
                    phoneNumber: phoneNumber
                }
            }
        obj.id = uuid.v4()
        obj.userStatus = "loggedOut"
        obj.type = 'Relocation'
        obj.mode = "ongoing"
        AsyncStorage
            .getItem('userStatus')
            .then((status) => {
                if (status === 'loggedOut') {
                    AsyncStorage
                        .getItem("anonymusRelocations")
                        .then((data) => {
                            obj.userStatus = "loggedOut"
                            if (data && JSON.parse(data).length > 0) {
                                ar = JSON.parse(data)
                                ar.push(obj)
                                AsyncStorage.setItem("anonymusRelocations", JSON.stringify(ar))
                            } else {
                                ar.push(obj);
                                AsyncStorage.setItem("anonymusRelocations", JSON.stringify(ar))
                            }
                        });
                } else {
                    AsyncStorage
                        .getItem('phoneNo')
                        .then((phoneNo, msg) => {
                            if (phoneNo) {
                                database()
                                    .ref('/users/' + phoneNo + "/relocations")
                                    .once("value")
                                    .then(snapshot => {
                                        obj.userStatus = "loggedIn"
                                        obj.phoneNo = phoneNo
                                        if (snapshot.val() && snapshot.val().length > 0) {
                                            ar = snapshot.val()
                                            ar.push(obj)
                                            database()
                                                .ref('/users/' + phoneNo + "/relocations")
                                                .set(ar)
                                        } else {
                                            ar.push(obj);
                                            database()
                                                .ref('/users/' + phoneNo + "/relocations")
                                                .set(ar)
                                        }
                                    })
                            }
                        })
                }
            });
    }

    const onPressSubmit = () => {
        let text = ""
        if (address1 === "") {
            text = "Please enter address1";
        } else if (address2 === "") {
            text = "Please enter address2";
        } else if (city === "") {
            text = "Please enter city";
        } else if (state === "") {
            text = "Please enter state";
        } else if (zip === "") {
            text = "Please enter postal code";
        } else if (phoneNumber === "") {
            text = "Please enter phone no";
        }
        if (address1 !== "" && address2 !== "" && city !== "" && state !== "" && zip !== "" && phoneNumber !== "") {
            Toast.show({
                type: 'customToast',
                text1: 'Submitted Successfully...',
                position: 'bottom',
                visibilityTime: 1500,
                bottomOffset: 80,
                props: {
                    backgroundColor: '#4a8f4b'
                }
            });
            navigation.navigate('Home')
            saveRelocationDetails()
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
    const updateDefaltAddress = (address) => {
        setDefaltAddress(address)
    }
    useEffect(() => {
        AsyncStorage.getItem("userStatus").then((status) => {
            if(status) {
                setStatus(status)
            }
        })
    })
    return (
        <KeyboardAvoidingView
            behavior='height'
            style={{
            flex: 1,
            backgroundColor: Colors.appBackground
        }}>
            <GeneralHeader
                showRigtIcon={false}
                rightIconType={Icons.MaterialIcons}
                rightIconName={'navigate-before'}
                rightIconSize={35}
                rightIconColor={Colors.black}
                rightIconBackgroundColor={Colors.appBackground}
                onPressRight={() => navigation.goBack()}
                subHeaderText="Add required details for relocation..."
                showSubHeaderText={true}
                subHeaderTextSize={20}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={120}
                headerText={"Details"}
                headerTextSize={25}
                headerTextColor={Colors.primary}
                showHeaderText={true}
                showLeftIcon={true}
                leftIconType={Icons.MaterialIcons}
                leftIconName={'navigate-before'}
                leftIconSize={35}
                leftIonColor={Colors.black}
                leftIconBackgroundColor={Colors.appBackground}
                onPressLeft={() => navigation.goBack()}/>
            <View
                style={{
                backgroundColor: Colors.appBackground,
                marginBottom: 80,
                paddingHorizontal: 20,
                marginTop: 10,
                flex: 1,
                width: '100%'
            }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View>
                        <DefaltAddressComponent selectedAddress={route.params.details.address} updateDefaltAddress={updateDefaltAddress} navigation={navigation} params={route.params.details} />

                        <View style={{marginTop: 20}}>
                            <SectionBanner
                                title='Drop Location'
                                borderWidth={80} 
                                fontSize={16}
                                borderColor={Colors.white}
                                titleColor={Colors.white}/>
                        </View>
                        <View
                            style={{
                            marginTop: 10
                        }}>
                            <FormElement
                                onChangeText={(val) => setAddress1(val)}
                                inputValue={address1}
                                showLabel={false}
                                title='Address 1'
                                type='input'
                                labelColor={Colors.primary}
                                keyboardType='default'
                                maxLength={50}/>
                            <FormElement
                                onChangeText={(val) => setAddress2(val)}
                                inputValue={address2}
                                showLabel={false}
                                title='Address 2'
                                type='input'
                                labelColor={Colors.primary}
                                keyboardType='default'
                                maxLength={50}/>
                            <View
                                style={{
                                width: '100%',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <View
                                    style={{
                                    width: '49%'
                                }}>
                                    <FormElement
                                        onChangeText={(val) => setCity(val)}
                                        inputValue={city}
                                        showLabel={false}
                                        title='City'
                                        type='input'
                                        labelColor={Colors.primary}
                                        keyboardType='default'
                                        maxLength={20}/>
                                </View>
                                <View
                                    style={{
                                    width: '49%'
                                }}>
                                    <FormElement
                                        onChangeText={(val) => setState(val)}
                                        inputValue={state}
                                        showLabel={false}
                                        title='State'
                                        type='input'
                                        labelColor={Colors.primary}
                                        keyboardType='default'
                                        maxLength={20}/>
                                </View>
                            </View>
                            <FormElement
                                onChangeText={(val) => setZip(val)}
                                inputValue={zip}
                                showLabel={false}
                                title='PIN'
                                type='input'
                                labelColor={Colors.primary}
                                keyboardType='numeric'
                                maxLength={6}/>
                            <FormElement
                                onChangeText={(val) => setPhoneNumber(val)}
                                inputValue={phoneNumber}
                                showLabel={false}
                                title='Phone Number'
                                type='input'
                                labelColor={Colors.primary}
                                keyboardType='numeric'
                                maxLength={10}/>
                        </View>
                    </View>
                </ScrollView>
            </View>
            <Animatable.View delay={100} animation={'slideInUp'}>
                <ImageBackground
                    blurRadius={0}
                    source={require('../assets/images/background6.png')}
                    style={{
                    overflow: 'hidden',
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                    height: 80,
                    backgroundColor: Colors.secondary,
                    borderTopLeftRadius: 50,
                    elevation: 15,
                    borderTopRightRadius: 50
                }}>
                    <View style={{
                        width: '90%'
                    }}>
                        <Button
                            onPress={onPressSubmit}
                            backgroundColor={Colors.primary}
                            iconPostionRight={true}
                            useIcon={true}
                            icon='long-arrow-right'
                            title="Submit"/>
                    </View>
                </ImageBackground>
            </Animatable.View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    input: {
        paddingVertical: 15,
        width: '100%',
        color: Colors.mediumDark,
        fontSize: 20
    },
    containerStyle: {
        backgroundColor: 'white',
        width: '90%',
        left: '5%',
        marginTop: 10,
        height: '90%',
        borderRadius: 20
    }
});

export default RelocationDetailsScreen;
