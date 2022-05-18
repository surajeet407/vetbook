import React, {useEffect, useRef, useState, useMemo, useCallback} from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity, KeyboardAvoidingView, ImageBackground} from 'react-native';
import Colors from '../util/Colors';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import Icon, {Icons} from '../util/Icons';
import { TextInput } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import RadioGroup from 'react-native-radio-buttons-group';
import database, {firebase} from '@react-native-firebase/database';
import Button from '../reusable_elements/Button';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../util/i18n';
import Title from '../reusable_elements/Title';


const CancelScreen = ({navigation, route}) => {
    console.log(route.params)
    const [selectedText, setSelectedText] = useState("")
    const [additinalComments, setAdditinalComments] = useState("")

    const radioButtonPress = (data) => {
        for(let i = 0; i < data.length; i++) {
            if(data[i].selected) {
                setSelectedText(data[i].value)
                break;
            }
        }
        
    }
    const onPressCancel = () => {
        if(selectedText === "") {
            Toast.show({
                type: 'customToast',
                text1: "Please select reason for cancellation...",
                position: 'bottom',
                visibilityTime: 1500,
                bottomOffset: 100,
                props: {
                    backgroundColor: Colors.error_toast_color
                }
            });
        } else {
            let dbPath, anonymousPath;
            if(route.params.type === "service") {
                dbPath = "services"
                anonymousPath = "anonymusServices"
            } else if(route.params.type === "order") {
                dbPath = "orders"
                anonymousPath = "anonymusOrders"
            } else {
                dbPath = "relocations"
                anonymousPath = "anonymusRelocations"
            }

            if (route.params.item.userStatus === 'loggedIn') {
                database()
                .ref("/users/" + route.params.item.phoneNo + "/" + dbPath)
                .once('value')
                .then(snapshot => {
                    let path;
                    snapshot
                        .val()
                        .forEach((dbItem, index) => {
                            if (dbItem.id === route.params.item.id) {
                                path = index;
                            }
                        })
                    database()
                        .ref("/users/" + route.params.item.phoneNo + "/" + dbPath + "/" + path)
                        .update({mode: 'cancelled', reasonForCancellation: selectedText, additinalCommentForCancellation: additinalComments}).then(() => {
                            onPressBack()
                            Toast.show({
                                type: 'customToast',
                                text1: "This " + route.params.type + " has been cancelled...",
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
                AsyncStorage
                    .getItem(anonymousPath)
                    .then((data) => {
                        if (data && JSON.parse(data).length > 0) {
                            let path,
                            mainData = JSON.parse(data);
                            mainData.forEach((dbItem, index) => {
                                if (dbItem.id === route.params.item.id) {
                                    path = index
                                }
                            })
                            mainData[path].mode = 'cancelled'
                            mainData[path].reasonForCancellation = selectedText
                            mainData[path].additinalCommentForCancellation = additinalComments
                            AsyncStorage.setItem(anonymousPath, JSON.stringify(mainData)).then(() => {
                                onPressBack()
                                Toast.show({
                                    type: 'customToast',
                                    text1: "This Service has been cancelled...",
                                    position: 'bottom',
                                    visibilityTime: 1500,
                                    delay: 1500,
                                    bottomOffset: 80,
                                    props: {
                                        backgroundColor: Colors.error_toast_color
                                    }
                                });
                            }) 
                        }
                    });
            }
        
        }
    }
    
    const onPressBack = () => {
        if(route.params.type === "service") {
            navigation.navigate("ServicesBottomTabBar", {screen: "Service", status: route.params.item.userStatus})
        } else if(route.params.type === "order") {
            navigation.navigate("ServicesBottomTabBar", {screen: "Orders", status: route.params.item.userStatus})
        } else {
            navigation.navigate("ServicesBottomTabBar", {screen: "Relocations", status: route.params.item.userStatus})
        }
    }
    useEffect(() => {
    }, []);
    return (
        <KeyboardAvoidingView
            behavior='height'
            style={{
            flex: 1,
            backgroundColor: Colors.appBackground
        }}>
            <GeneralHeader
                showRigtIcon={true}
                rightIconType={Icons.MaterialIcons}
                rightIconName={'close'} 
                rightIconSize={20} 
                rightIconWidth={30}
                rightIconHeight={30}
                rightIconBorderRadius={20}
                rightIconColor={Colors.white}
                rightIconBackgroundColor={Colors.error_toast_color}
                onPressRight={onPressBack}
                subHeaderText=""
                showSubHeaderText={false}
                subHeaderTextSize={20}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={80}
                headerText={"Cancel " + route.params.type}
                headerTextSize={25}
                headerTextColor={Colors.primary}
                showHeaderText={true}
                showLeftIcon={false}
                leftIconType={Icons.MaterialIcons}
                leftIconName={'navigate-before'}
                leftIconSize={35}
                leftIonColor={Colors.black}
                leftIconBackgroundColor={Colors.appBackground}
                onPressLeft={() => navigation.goBack()}/>

            <View
                style={{
                backgroundColor: Colors.appBackground,
                paddingHorizontal: 20,
                flex: 1,
                marginBottom: 80
            }}>
                <ScrollView showsVerticalScrollIndicator={false} scrollEventThrottle={16}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{}}>
                            <Title fontFamily={'PTSerif-BoldItalic'} label={"*"} size={18} color={Colors.red}/>
                        </View>
                        <View style={{marginLeft: 5}}>
                            <Title fontFamily={'PTSerif-BoldItalic'} label={"Select reason for cancellation:"} size={18} color={Colors.secondary}/> 
                        </View>
                    </View>
                    <RadioGroup
                        onPress={radioButtonPress}
                        containerStyle={{
                        marginTop: 10,
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start'
                    }}
                        radioButtons={route.params.data}/>
                    <View style={{marginTop: 20}}>
                        <Title fontFamily={'PTSerif-BoldItalic'} label={"Additinal comments:"} size={18} color={Colors.secondary}/> 
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
                                marginTop: 5,
                                backgroundColor: Colors.appBackground,
                                fontSize: 20,
                                fontFamily: 'Oswald-Medium',
                                elevation: 2
                            }} outlineColor={Colors.primary}  multiline={true}
                            numberOfLines={10}
                            activeOutlineColor={Colors.primary} label={'Enter comments here...'} 
                            onChangeText={(val) => setAdditinalComments(val)} value={additinalComments}/>
                    </View>
                </ScrollView>
            </View>
            <ImageBackground blurRadius={0} source={require('../assets/images/background6.png')} style={{overflow: 'hidden', position: 'absolute', bottom: 0, width: '100%', alignItems: 'center', justifyContent: 'center', padding: 10, height: 80,  backgroundColor: Colors.secondary, borderTopLeftRadius: 50, elevation: 15, borderTopRightRadius: 50}}>
                    <Animatable.View delay={100} animation={'slideInUp'} style={{width: '90%'}}>
                        <Button backgroundColor={Colors.red} iconPostionRight={true} useIcon={true} icon="long-arrow-right" title="Cancel" onPress={onPressCancel}/>
                    </Animatable.View>
            </ImageBackground>
            
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    
});

export default CancelScreen;