import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import Colors from '../util/Colors';
import Title from './Title';
import * as Animatable from 'react-native-animatable';
import Label, {Orientation} from "react-native-label";
import Icon, {Icons} from '../util/Icons';
import i18n from '../util/i18n';

const StoreItems = (props) => {
    return (
        <Animatable.View
            delay={100 * props.index}
            animation={props.animationStyle}
            key={props.index}
            style={{
            backgroundColor: Colors.white,
            elevation: 8,
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
                title={"₹ " + props.discountPrice + " /-"}
                color={Colors.secondary}
                distance={50}
                extent={0.1}>
                <TouchableOpacity
                    onPress={props.navToDetail}
                    style={{
                    borderRadius: 15,
                }}>
                    <Image
                        style={{
                        width: props.width,
                        height: 120
                    }}
                        source={{
                        uri: props.image
                    }}/>
                </TouchableOpacity>
                <View style={{alignItems: 'center', justifyContent: 'center', padding: 5}}>
                    <View style={{flexDirection: 'row'}}>
                        <Title label={props.name} size={15} color={Colors.primary}/>
                        <Icon name={'arrowright'} type={Icons.AntDesign} color={Colors.primary} size={20} style={{marginLeft: 5, marginTop: 5}}/>
                    </View>
                    {/* <Title label={"₹ " + props.actualPrice + " /- ( " + ((parseInt(props.actualPrice) - parseInt(props.discountPrice)) / 100).toFixed(1) + " % off)"} size={12} color={Colors.darkGray}/> */}
                </View>
            </Label>
        </Animatable.View>
    );
};

const styles = StyleSheet.create({});

export default StoreItems;
