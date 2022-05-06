import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, View, ScrollView, ImageBackground, Dimensions} from 'react-native';
import Icon, {Icons} from '../util/Icons';
import Colors from '../util/Colors';
import Title from '../reusable_elements/Title';
import * as Animatable from 'react-native-animatable';
import i18n from '../util/i18n';
import Svg, {Path} from 'react-native-svg';

const TermsScreen = ({navigation}) => {

    return (
        <View
            style={{
            flex: 1,
            backgroundColor: Colors.appBackground,
            width: '100%'
        }}>
            <View
                style={{
                position: 'absolute',
                width: Dimensions
                    .get('window')
                    .width
            }}>
                <View
                    style={{
                    backgroundColor: Colors.primary,
                    height: 80
                }}>
                    <Svg
                        height="100%"
                        width="100%"
                        viewBox="0 0 1440 220"
                        style={{
                        position: 'absolute',
                        top: 60
                    }}>
                        <Path
                            strokeWidth={1}
                            str
                            fill={Colors.primary}
                            d="M0,256L80,218.7C160,181,320,107,480,112C640,117,800,203,960,202.7C1120,203,1280,117,1360,74.7L1440,32L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"/>
                    </Svg>
                </View>
            </View>
            <ImageBackground
                source={require('../assets/images/background6.png')}
                style={{
                paddingHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                height: 100
            }}>
                <Title label='Terms' size={40} color={'#fff'}/>
                <Icon
                    type={Icons.Ionicons}
                    onPress={() => navigation.navigate('Settings')}
                    name={'close-circle-outline'}
                    style={{
                    fontSize: 45,
                    marginTop: 20
                }}
                    color={"#fff"}/>
            </ImageBackground>
            <ImageBackground
                source={require('../assets/images/background4.png')}
                style={{
                flex: 1,
                width: '100%'
            }}>
                <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
                    <View
                        style={{
                        paddingHorizontal: 20,
                        marginBottom: 10
                    }}>
                        <Animatable.View
                            animation={'slideInLeft'}
                            delay={100}
                            style={{
                            marginTop: 80,
                            elevation: 5,
                            padding: 20,
                            backgroundColor: '#fff',
                            borderRadius: 15
                        }}>
                            <Title label='About The VETBOOK' color={Colors.secondary} size={25}/>
                            <View
                                style={{
                                marginTop: 5
                            }}>
                                <Title
                                    label='Founded in 2022, VetBook is the India’s largest network of 5-star pet care service providers.'
                                    color='grey'
                                    size={15}/>
                            </View>
                        </Animatable.View>
                        <Animatable.View
                            animation={'slideInUp'}
                            delay={200}
                            style={{
                            marginTop: 20,
                            padding: 20,
                            elevation: 5,
                            backgroundColor: '#fff',
                            borderRadius: 15
                        }}>
                            <Title
                                label='Whether you need in-home pet grooming, pet training, or vet on call, ThePetNest connects pet parents with pet care heroes who’ll treat their pet like family.
                    We understand your pet is family. And you can trust us to keep your pet happy, healthy, and sweet as ever.
                    But it’s not just about pet love. ThePetNest is also committed to making pet care safe, easy, and affordable so that everyone can experience the unconditional love of a pet. Whatever you and your furr babies are into, we’re into it too. And we’ve got your back. Anytime. Anywhere.
                    ThePetNest donates a portion of every service to Pet NGO’s & Rescue shelters through this program. We also provide meals to shelter dogs in India.'
                                color='grey'
                                size={15}/>
                        </Animatable.View>
                    </View>
                </ScrollView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
        marginTop: 10
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent'
    }
});

export default TermsScreen;
