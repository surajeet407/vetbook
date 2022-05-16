import React, {useEffect, useRef, useState, useMemo} from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import Colors from '../util/Colors';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import Icon, {Icons} from '../util/Icons';
import PagerView from 'react-native-pager-view';
import * as Animatable from 'react-native-animatable';
import {TextInput} from 'react-native-paper';
import RNBounceable from "@freakycoder/react-native-bounceable";
import database, {firebase} from '@react-native-firebase/database';
import Button from '../reusable_elements/Button';
import {SlidingBorder} from 'react-native-animated-pagination-dots';
import i18n from '../util/i18n';


const ChatScreen = ({navigation}) => {
    const [message, setMessage] = useState("")

    const onPressSend = () => {
        setMessage("")
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
                showRigtIcon={false}
                rightIconType={Icons.MaterialIcons}
                rightIconName={'navigate-before'}
                rightIconSize={45}
                rightIconColor={Colors.black}
                rightIconBackgroundColor={Colors.appBackground}
                onPressRight={() => navigation.goBack()}
                subHeaderText=""
                showSubHeaderText={false}
                subHeaderTextSize={20}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={80}
                headerText={"Help Me"}
                headerTextSize={25}
                headerTextColor={Colors.primary}
                showHeaderText={true}
                showLeftIcon={true}
                leftIconType={Icons.MaterialIcons}
                leftIconName={'navigate-before'}
                leftIconSize={45}
                leftIonColor={Colors.black}
                leftIconBackgroundColor={Colors.appBackground}
                onPressLeft={() => navigation.goBack()}/>

            <View
                style={{
                backgroundColor: Colors.appBackground,
                paddingHorizontal: 20,
                flex: 1,
                width: '100%'
            }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    
                </ScrollView>
            </View>
            <Animatable.View delay={100} animation={'slideInUp'}>
                <View
                    style={{
                    overflow: 'hidden',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 50,
                    backgroundColor: Colors.white,
                    elevation: 15,
                }}>
                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <View style={{width: '85%'}}>
                            <TextInput theme={{
                                colors: {
                                    placeholder: Colors.dark,
                                    text: "#504f40"
                                },
                                fonts: {
                                    regular: {
                                        fontFamily: 'Redressed-Regular'
                                    }
                                } 
                            }} value={message} onChangeText={(val) => setMessage(val)}/>
                        </View>
                        <TouchableOpacity onPress={onPressSend} style={{width: '15%', height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.green3}}>
                            <Icon type={Icons.Feather} name='send' color={Colors.white} size={20}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animatable.View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    
});

export default ChatScreen;