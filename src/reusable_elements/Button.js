import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../util/Colors';
import LottieView from 'lottie-react-native';
import RNBounceable from "@freakycoder/react-native-bounceable";
import i18n from '../util/i18n';

const Button = (props) => {
    return (

        <RNBounceable
            style={[
            styles.buttonContainerWrapper, {
                backgroundColor: props.backgroundColor
                    ? props.backgroundColor
                    : Colors.primary
            }
        ]}
            onPress={props.onPress}>
            <View style={{
                flexDirection: 'row'
            }}>
                {props.iconPostionRight && (
                    <Text
                        style={[
                        styles.buttonTextLeft, {
                            color: props.textColor
                                ? props.textColor
                                : Colors.appBackground
                        }
                    ]}>{props.title
                            ? props
                                .title
                                .toUpperCase()
                            : null}</Text>
                )}
                {props.useLottie && (<LottieView
                    style={{
                    width: 40,
                    height: 40
                }}
                    source={require('../assets/lottie/swipe-right.json')}
                    autoPlay={true}
                    loop/>)}
                {props.useIcon && (<Icon
                    name={props.icon}
                    size={25}
                    color={props.iconColor
                    ? props.iconColor
                    : Colors.appBackground}/>)}
                {props.iconPostionLeft && (
                    <Text
                        style={[
                        styles.buttonTextRight, {
                            color: props.textColor
                                ? props.textColor
                                : Colors.appBackground
                        }
                    ]}>{props
                            .title
                            .toUpperCase()}</Text>
                )}
            </View>
        </RNBounceable>
    );
};

const styles = StyleSheet.create({
    buttonContainerWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row",
        elevation: 8,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    buttonTextLeft: {
        fontSize: 15,
        marginRight: 10,
        alignSelf: "center",
        textTransform: "uppercase",
        fontFamily: 'PTSerif-Bold'
    },
    buttonTextRight: {
        fontSize: 15,
        marginLeft: 10,
        alignSelf: "center",
        textTransform: "uppercase",
        fontFamily: 'PTSerif-Bold'
    }
});

export default Button;
