import React from 'react';
import {StyleSheet, View} from 'react-native';
import Title from '../reusable_elements/Title';
import {TouchableRipple} from 'react-native-paper';
import Colors from '../util/Colors';
import i18n from '../util/i18n';

const TrackComponent = (props) => {
    return (
        <View
            style={{
            position: 'absolute',
            bottom: 0,
            zIndex: 9999,
            marginTop: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            alignItems: 'center'
        }}>
            <View
                style={{
                width: '100%',
                marginTop: 5,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                backgroundColor: Colors.green2,
                padding: 8,
                marginBottom: 10,
                borderRadius: 20,
                borderColor: Colors.darkGray,
                elevation: 15,
                borderWidth: 1
            }}>
                <Title
                    label={i18n.onGoingServiceOrderText}
                    size={15}
                    color={Colors.appBackground}/>
                <TouchableRipple
                    style={{
                    width: 60,
                    backgroundColor: Colors.lightRed,
                    elevation: 5,
                    borderRadius: 15,
                    alignItems: 'center'
                }}
                    onPress={props.onPress}
                    rippleColor="rgba(0, 0, 0, .32)">
                    <Title label={i18n.onGoingServiceOrderButtonText} color='#fff' size={15}/>
                </TouchableRipple>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({});

export default TrackComponent;
