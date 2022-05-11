import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Colors from '../util/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import i18n from '../util/i18n';
import Label, {Orientation} from "react-native-label";

const Card = (props) => {
    return (
        <View
            style={{
            backgroundColor: Colors.appBackground,
            borderRadius: 25,
            elevation: 5,
            marginBottom: 10,
            marginTop: 5
        }}>
            {props.showTag && (
                <View
                    style={{
                    top: '-5%',
                    left: '8%',
                    position: 'absolute',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    padding: 8,
                    backgroundColor: Colors.primary,
                    borderRadius: 10
                }}>
                    <Text
                        style={{
                        color: Colors.appBackground,
                        fontSize: 12,
                        fontWeight: 'bold',
                        fontFamily: 'Redressed-Regular'
                    }}>{props.tagText}</Text>
                </View>
            )}
            <Label
                orientation={Orientation.TOP_RIGHT}
                containerStyle={{
                width: "100%"
            }}
                style={{
                fontSize: 15,
                fontFamily: 'Oswald-Regular',
                textDecorationLine: 'line-through'
            }}
                title={"₹ " + props.actualPrice + " /-"}
                color={Colors.primary}
                distance={50}
                extent={0}>
                <View
                    style={{
                    padding: 10,
                    marginTop: 10,
                    marginBottom: 10
                }}>

                    <View
                        style={{
                        marginBottom: 10,
                        borderBottomColor: Colors.gray,
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: 5
                    }}>
                        <Text
                            style={{
                            color: Colors.secondary,
                            fontSize: 18,
                            fontWeight: 'bold',
                            fontFamily: 'Redressed-Regular'
                        }}>{props.headerRightText + " " + props.discountPrice + " /- (Inc Tax)"}</Text>
                    </View>
                    <View
                        style={{
                        justifyContent: 'space-between'
                    }}>
                        {props
                            .details
                            .map((text, index) => <View
                                key={index}
                                style={{
                                flexDirection: 'row',
                                marginVertical: 5,
                                alignItems: 'center'
                            }}>
                                <Icon
                                    style={{
                                    padding: 3,
                                    backgroundColor: 'grey',
                                    borderRadius: 20
                                }}
                                    name={'check'}
                                    color={Colors.appBackground}
                                    size={15}/>
                                <Text
                                    style={{
                                    marginLeft: 5,
                                    fontSize: 16,
                                    color: 'grey',
                                    fontFamily: 'PTSerif-Bold'
                                }}>{text}</Text>
                            </View>)}
                        {props.showNotes && (
                            <View
                                style={{
                                marginTop: 5
                            }}>
                                {props
                                    .notes
                                    .map((text, index) => <Text
                                        key={index}
                                        style={{
                                        fontSize: 16,
                                        color: '#e7592a',
                                        fontFamily: 'PTSerif-BoldItalic'
                                    }}>{text}</Text>)}
                            </View>
                        )}
                    </View>
                </View>
            </Label>
        </View>
    );
};

const styles = StyleSheet.create({});

export default Card;
