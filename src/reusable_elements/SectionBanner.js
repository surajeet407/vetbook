import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Colors from '../util/Colors';
import LinearGradient from 'react-native-linear-gradient';
import i18n from '../util/i18n';

const SectionBanner = (props) => {
    return (
        <LinearGradient
            start={{
            x: 0.0,
            y: 0.25
        }}
            end={{
            x: 0.5,
            y: 1.0
        }}
            style={{
            width: '100%',
            borderRadius: 10
        }}
            colors={[Colors.secondary, Colors.darkGray]}>
            <View
                style={{
                alignItems: 'center',
                paddingHorizontal: 10,
                paddingVertical: 5,
                width: '100%',
                borderRadius: 10
            }}>
                <Text
                    style={{
                    fontFamily: 'PTSerif-Bold',
                    fontSize: props.fontSize,
                    color: props.titleColor
                }}>{props.title}</Text>
                <View
                    style={{
                    borderColor: props.borderColor
                        ? props.borderColor
                        : Colors.primary,
                    borderBottomWidth: 2,
                    width: props.borderWidth,
                    marginTop: 5
                }}></View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({});

export default SectionBanner;
