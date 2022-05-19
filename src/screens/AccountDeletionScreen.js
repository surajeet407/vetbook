import React, {useEffect, useRef, useState} from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Animated,
    Text,
    KeyboardAvoidingView,
    ImageBackground,
    Keyboard
} from 'react-native';

import Colors from '../util/Colors';
import Button from '../reusable_elements/Button';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';
import Icon, {Icons} from '../util/Icons';
import database from '@react-native-firebase/database';
import i18n from '../util/i18n';
import { TextInput } from 'react-native-paper';
import Title from '../reusable_elements/Title';
import moment from 'moment';

const AccountDeletionScreen = ({navigation, route}) => {
    const [accountDeletionInitiated,
        setAccountDeletionInitiated] = useState(false)
    const [reason,
        setReason] = useState("");


    const handleAccountDeletion = () => {
        if(accountDeletionInitiated) {
            database()
            .ref('/accountDeletionRequest')
            .once("value")
            .then(snapshot => {
                if(snapshot.val()) {
                    let ar = []
                    for(let i = 0; i < snapshot.val().length; i++) {
                        if(snapshot.val()[i].phoneNo !== route.params.phoneNo) {
                            ar.push(snapshot.val()[i])
                        }
                    }
                    database()
                        .ref('/accountDeletionRequest').set(ar).then(() => {
                            navigation.goBack()
                            Toast.show({
                                type: 'customToast',
                                text1: "We mostly welcome you again, be with us...",
                                position: 'bottom',
                                delay: 1500,
                                visibilityTime: 1500,
                                bottomOffset: 80,
                                props: {
                                    backgroundColor: Colors.green3
                                }
                            });
                        })
                } 
            })
        } else {
            Keyboard.dismiss()
            let text = ""
            if (reason === "") {
                text = "Please enter reason for deletion";
            } 
    
            if (reason !== "") {
                database()
                .ref('/accountDeletionRequest')
                .once("value")
                .then(snapshot => {
                    let ar = [], obj = {
                        reason: reason,
                        phoneNo: route.params.phoneNo,
                        date: moment().format('yyyy-MM-DD').toString(),
                    }
                    if(snapshot.val()) {
                        ar = snapshot.val()
                    } else {
                        ar.push(obj)
                    }
                    database()
                        .ref('/accountDeletionRequest/').set(ar).then(() => {
                            navigation.goBack()
                            Toast.show({
                                type: 'customToast',
                                text1: "Account deletion request has been submitted successfully",
                                position: 'bottom',
                                visibilityTime: 1500,
                                delay: 1500,
                                bottomOffset: 80,
                                props: {
                                    backgroundColor: Colors.error_toast_color
                                }
                            });
                        })
                })
                
            } else {
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
    }
    useEffect(() => {
        database()
            .ref('/accountDeletionRequest')
            .once("value")
            .then(snapshot => {
                if(snapshot.val()) {
                    for(let i = 0; i < snapshot.val().length; i++) {
                        if(snapshot.val()[i].phoneNo === route.params.phoneNo) {
                            setAccountDeletionInitiated(true)
                            break;
                        }
                    }
                } else {
                    setAccountDeletionInitiated(false)
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
                subHeaderText="Raise a request for account deletion..."
                showSubHeaderText={true}
                subHeaderTextSize={20}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={100}
                headerText={'Account Deletion'}
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
                paddingHorizontal: 10,
                flex: 1,
                marginTop: 20,
                width: '100%'
            }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{
                        padding: 10
                    }}>
                        {!accountDeletionInitiated?
                        <View>
                            <Title fontFamily={'PTSerif-BoldItalic'} label={"Can you please share to us what is not working? we are fixing bugs as soon as we spot them.If something sliped through our fingers we'd be so gratefull to be aware of it and fix it..."} size={16} color={Colors.darkGray}/> 
                            <TextInput  theme={{
                                colors: {
                                    placeholder: Colors.dark,
                                    text: "#504f40"
                                },
                                fonts: {
                                    regular: {
                                        fontFamily: 'Redressed-Regular'
                                    }
                                }
                            }} mode={'outlined'} style={{
                                marginTop: 20,
                                backgroundColor: Colors.appBackground,
                                fontSize: 20,
                                fontFamily: 'Oswald-Medium',
                                elevation: 2
                            }} outlineColor={Colors.primary}  multiline={true}
                            numberOfLines={10}
                            activeOutlineColor={Colors.primary} label={'Enter Reason...'} 
                            onChangeText={(val) => setReason(val)} value={reason}/>
                        </View>
                        :
                        <View>
                            <Title fontFamily={'PTSerif-BoldItalic'} label={"You have alredy initiated for account deletion..."} size={16} color={Colors.darkGray}/> 
                        </View>
                        }
                        
                    </View>
                </ScrollView>
            </View>
            <Animatable.View delay={100} animation={'slideInUp'}>
                <ImageBackground
                    blurRadius={0}
                    source={require('../assets/images/background6.png')}
                    style={{
                    overflow: 'hidden',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                    height: 80,
                    backgroundColor: Colors.primary,
                    borderTopLeftRadius: 50,
                    elevation: 15,
                    borderTopRightRadius: 50
                }}>
                    <View style={{
                        width: '90%'
                    }}>
                        <Button
                            onPress={handleAccountDeletion}
                            backgroundColor={accountDeletionInitiated? Colors.error_toast_color:Colors.green3}
                            iconPostionRight={true}
                            useIcon={true}
                            icon='long-arrow-right'
                            title={accountDeletionInitiated? "Cancel":"Submit"}/>
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

export default AccountDeletionScreen;
