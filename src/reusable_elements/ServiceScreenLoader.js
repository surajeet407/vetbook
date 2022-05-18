import React from 'react';
import {StyleSheet, View} from 'react-native';
import Colors from '../util/Colors';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const ServiceScreenLoader = ({navigation, route}) => {

    return (

        <SkeletonPlaceholder >
            {[1, 2, 3, 4].map((item, index) => <View
                key={index}
                style={{
                borderColor: Colors.darkGray,
                borderWidth: 1,
                padding: 10,
                marginTop: 10
            }}>
                <View
                    style={{
                    flexDirection: "row",
                    justifyContent: 'space-between',
                    alignItems: "center",
                    width: '100%'
                }}>
                    <View
                        style={{
                        width: 120,
                        height: 10,
                        borderRadius: 4
                    }}/>
                    <View
                        style={{
                        marginTop: 6,
                        width: 80,
                        height: 20,
                        borderRadius: 4
                    }}/>
                </View>
                <View
                    style={{
                    width: '100%',
                    marginTop: 10
                }}>
                    <View
                        style={{
                        width: 200,
                        height: 10,
                        borderRadius: 4
                    }}/>
                    <View
                        style={{
                        width: 220,
                        height: 10,
                        borderRadius: 4,
                        marginTop: 5
                    }}/>
                    <View
                        style={{
                        width: 180,
                        height: 10,
                        borderRadius: 4,
                        marginTop: 5
                    }}/>
                    <View
                        style={{
                        width: 300,
                        height: 10,
                        borderRadius: 4,
                        marginTop: 5
                    }}/>
                </View>
                <View
                    style={{
                    marginTop: 10,
                    flexDirection: "row",
                    justifyContent: 'space-between',
                    alignItems: "center",
                    width: '100%'
                }}>
                    <View
                        style={{
                        width: 60,
                        height: 20,
                        borderRadius: 4
                    }}/>
                    <View
                        style={{
                        marginTop: 6,
                        width: 80,
                        height: 40,
                        borderRadius: 4
                    }}/>
                </View>
            </View>)}
        </SkeletonPlaceholder>

    );
};

const styles = StyleSheet.create({});

export default ServiceScreenLoader;
