import React from 'react';
import {View, Text} from 'react-native';
import {BaseToast, ErrorToast} from 'react-native-toast-message';
import Colors from '../util/Colors';

const ToastConfig = {
    success: (props) => (<BaseToast
        {...props}
        text1Style={{
        fontSize: 17,
        fontFamily: 'Oswald-SemiBold'
    }}
        text2Style={{
        fontSize: 15,
        fontFamily: 'PTSerif-Regular'
    }}/>),
    error: (props) => (<ErrorToast
        {...props}
        text1Style={{
        fontSize: 17,
        fontFamily: 'Oswald-SemiBold'
    }}
        text2Style={{
        fontSize: 15,
        fontFamily: 'PTSerif-Regular'
    }}/>),
    customToast: ({text1, props}) => (
        <View
            style={{
            justifyContent: 'center',
            height: 50,
            width: '95%',
            backgroundColor: props.backgroundColor
                ? props.backgroundColor
                : Colors.primary,
            elevation: 5,
            borderRadius: 5,
            borderLeftColor: Colors.white,
            borderLeftWidth: 2,
            paddingHorizontal: 10
        }}>
            <Text
                style={{
                fontFamily: 'Oswald-SemiBold',
                color: Colors.appBackground
            }}>{text1}</Text>
        </View>
    )
};

export default ToastConfig