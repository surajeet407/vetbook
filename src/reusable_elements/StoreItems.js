import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import Colors from '../util/Colors';
import Title from './Title';
import * as Animatable from 'react-native-animatable';
import Label, {Orientation} from "react-native-label";
import i18n from '../util/i18n';

const StoreItems = (props) => {
    return (
        <Animatable.View
            delay={100 * props.index}
            animation={props.animationStyle}
            key={props.index}
            style={{
            alignItems: 'center',
            justifyContent: 'space-evenly',
            margin: 10
        }}>
            <Label
                orientation={Orientation.TOP_RIGHT}
                containerStyle={{
                width: "100%"
            }}
                style={{
                fontSize: 15,
                fontFamily: 'Oswald-Regular'
            }}
                title={"₹ " + props.price + " /-"}
                color={Colors.secondary}
                distance={50}
                extent={0.1}>
                <TouchableOpacity
                    onPress={props.navToDetail}
                    style={{
                    elevation: 5,
                    borderRadius: 15
                }}>
                    <Image
                        style={{
                        width: props.width,
                        height: 150,
                        borderRadius: 15
                    }}
                        source={{
                        uri: props.image
                    }}/>
                </TouchableOpacity>
                <Title label={props.name} size={15} color={Colors.primary}/>
            </Label>
        </Animatable.View>
    );
};

const styles = StyleSheet.create({});

export default StoreItems;
