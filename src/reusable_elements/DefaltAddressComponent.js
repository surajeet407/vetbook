import React from 'react';
import {StyleSheet, View} from 'react-native';
import Colors from '../util/Colors';
import Button from '../reusable_elements/Button';
import * as Animatable from 'react-native-animatable';
import Title from '../reusable_elements/Title';
import i18n from '../util/i18n';

const DefaltAddressComponent = (props) => {
    return (
        <Animatable.View
            delay={100}
            animation={'slideInDown'}
            style={{
            marginTop: 20
        }}>
            <View
                style={{
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Title color={Colors.mediumDark} size={18} bold={true} label="Surajeet Hazari"/>
                <View
                    style={{
                    backgroundColor: Colors.primary,
                    marginLeft: 10,
                    borderRadius: 10,
                    padding: 5
                }}>
                    <Title color={Colors.appBackground} size={10} bold={true} label="Home"/>
                </View>
            </View>
            <Title
                color={Colors.darkGray}
                size={16}
                bold={false}
                label="106, Chaklalpur, Radhamohanpur, West Mindnapore, 721160"/>
            <View
                style={{
                width: '100%',
                marginTop: 10,
                padding: 5
            }}>
                <Button
                    iconColor={Colors.darkGray}
                    textColor={Colors.primary}
                    backgroundColor={Colors.appBackground}
                    iconPostionLeft={true}
                    useIcon={true}
                    icon="plus"
                    title="Change / Add address"
                    onPress={props.onPressAddAddress}/>
            </View>
        </Animatable.View>
    );
};

const styles = StyleSheet.create({});

export default DefaltAddressComponent;