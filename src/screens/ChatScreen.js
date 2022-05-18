import React, {useEffect, useRef, useState, useMemo, useCallback} from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import Colors from '../util/Colors';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import Icon, {Icons} from '../util/Icons';
import { GiftedChat } from 'react-native-gifted-chat'
import * as Animatable from 'react-native-animatable';
import {TextInput} from 'react-native-paper';
import database, {firebase} from '@react-native-firebase/database';
import Button from '../reusable_elements/Button';
import i18n from '../util/i18n';


const ChatScreen = ({navigation}) => {
    const [messages, setMessages] = useState([
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        }
      ])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])

    useEffect(() => {
    }, []);
    return (
        <View
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
                subHeaderText=""
                showSubHeaderText={false}
                subHeaderTextSize={20}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={80}
                headerText={"Chat With Us"}
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
                paddingHorizontal: 20,
                flex: 1,
                width: '100%'
            }}>
                <GiftedChat
                    isTyping={true}
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: 1,
                    }}
                    />
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    
});

export default ChatScreen;