import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Colors from '../util/Colors';
import RNBounceable from "@freakycoder/react-native-bounceable";
import * as Animatable from 'react-native-animatable';
import Icon from '../util/Icons';
import {Badge} from 'react-native-paper';
import i18n from '../util/i18n';

const GeneralHeader = (props) => {
    return (
        <View
            style={{
            position: props.position,
            top: 20,
            left: "5%",
            right: "5%",
            width: "90%",
            height: props.headerHeight,
            zIndex: 999
        }}>
            <View
                style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
            }}>
                <View
                    style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    {props.showLeftIcon && (
                        <Animatable.View animation={'fadeInLeft'}>
                            <RNBounceable
                                style={{
                                width: 40,
                                height: 40,
                                backgroundColor: props.leftIconBackgroundColor,
                                borderWidth: 1,
                                borderRadius: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                                elevation: 5,
                                marginRight: 10
                            }}
                                onPress={props.onPressLeft}>
                                <Icon
                                    type={props.leftIconType}
                                    name={props.leftIconName}
                                    size={props.leftIconSize}
                                    color={props.leftIonColor}/>
                            </RNBounceable>
                        </Animatable.View>
                    )}
                    {props.showHeaderText && (
                        <Animatable.Text
                            animation={'fadeInRight'}
                            style={{
                            color: props.headerTextColor,
                            fontSize: props.headerTextSize,
                            fontFamily: 'Oswald-Medium'
                        }}>{props.headerText}</Animatable.Text>
                    )}
                </View>
                {props.showRigtIcon && (
                    <Animatable.View animation={'fadeInRight'}>
                        <RNBounceable
                            style={{
                            height: props.rightIconHeight? props.rightIconHeight:40,
                            width: props.rightIconWidth? props.rightIconWidth:40,
                            backgroundColor: props.rightIconBackgroundColor,
                            borderRadius: props.rightIconBorderRadius? props.rightIconBorderRadius:10,
                            alignItems: 'center',
                            justifyContent: 'center',
                            elevation: 5
                        }}
                            onPress={props.onPressRight}>
                            <Icon
                                type={props.rightIconType}
                                name={props.rightIconName}
                                size={props.rightIconSize}
                                color={props.rightIconColor}/>
                        </RNBounceable>
                        {props.showBadgeOverRightIcon && (
                            <RNBounceable
                                onPress={props.onPressRight}
                                style={{
                                position: 'absolute',
                                top: -10,
                                left: 32,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Badge
                                    style={{
                                    backgroundColor: props.badgeBackgroundColor,
                                    borderWidth: 1,
                                    borderColor: props.badgeBorderColor,
                                    color: props.badgeColor,
                                    fontFamily: 'Redressed-Regular'
                                }}
                                    size={props.badgeSize}>{props.badgeText}</Badge>
                            </RNBounceable>
                        )}
                    </Animatable.View>
                )}
                {props.showRightSideText && (
                    <View style={{}}>
                        <Animatable.Text
                            animation={'fadeInLeft'}
                            style={{
                            color: props.rightSideTextColor,
                            fontSize: props.rightSideTextSize,
                            fontFamily: 'Oswald-Medium'
                        }}>{props.rightSideText}</Animatable.Text>
                    </View>
                )}

            </View>
            {props.showSubHeaderText && (
                <View
                    style={{
                    borderBottomColor: Colors.darkGray,
                    borderBottomWidth: 1,
                    padding: 10
                }}>
                    <Animatable.Text
                        animation={'fadeInLeft'}
                        style={{
                        color: props.subHeaderTextColor,
                        fontSize: props.subHeaderTextSize,
                        fontFamily: 'Redressed-Regular'
                    }}>{props.subHeaderText}</Animatable.Text>
                </View>
            )}
        </View>

    );
};

const styles = StyleSheet.create({});

export default GeneralHeader;
