import React, {useState, useRef, useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Animated,
    ScrollView,
    FlatList,
    ImageBackground,
    Dimensions,
    Linking
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../util/Colors';
import Title from '../reusable_elements/Title';
import * as Animatable from 'react-native-animatable';
import i18n from '../util/i18n';
import {TouchableRipple} from 'react-native-paper';
import Icon, {Icons} from '../util/Icons';
import Svg, {Path} from 'react-native-svg';

const ContactUsScreen = ({navigation}) => {

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
                <Title label='Contact Us' size={40} color={'#fff'}/>
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
            <View
                style={{
                flex: 1,
                width: '100%',
                overflow: 'hidden'
            }}>
                <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
                    <View
                        style={{
                        paddingHorizontal: 20,
                        marginTop: 20
                    }}>
                        <Animatable.View
                            animation={'fadeInLeft'}
                            delay={100}
                            style={{
                            marginTop: 50
                        }}>
                            <Title label='City' size={20} color={Colors.secondary}/>
                            <Title label='Kolkata' size={16} color={Colors.darkGray}/>
                        </Animatable.View>
                        <Animatable.View
                            animation={'fadeInLeft'}
                            delay={200}
                            style={{
                            marginTop: 20
                        }}>
                            <Title label='Address' size={20} color={Colors.secondary}/>
                            <Title
                                label='106, Chaklalpur, Radhamohanpur, Debra, West Bengal - 721160'
                                size={16}
                                color={Colors.darkGray}/>
                        </Animatable.View>
                        <Animatable.View
                            animation={'fadeInLeft'}
                            delay={300}
                            style={{
                            marginTop: 20
                        }}>
                            <Title label='Phone' size={20} color={Colors.secondary}/>
                            <TouchableRipple onPress={() => Linking.openURL('tel:7550841824')}>
                                <Title label='+91 7550841824' size={16} color={Colors.darkGray}/>
                            </TouchableRipple>
                        </Animatable.View>
                        <Animatable.View
                            animation={'fadeInLeft'}
                            delay={400}
                            style={{
                            marginTop: 20
                        }}>
                            <Title label='Email' size={20} color={Colors.secondary}/>
                            <Title label='care@vetbook.com' size={16} color={Colors.darkGray}/>
                        </Animatable.View>
                        <Animatable.View
                            animation={'fadeInLeft'}
                            delay={500}
                            style={{
                            marginTop: 20
                        }}>
                            <Title label='Social' size={20} color={Colors.secondary}/>
                            <View
                                style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 10
                            }}>
                                <Icon
                                    type={Icons.FontAwesome}
                                    name={'facebook-official'}
                                    color={Colors.skyBlue}
                                    size={45}/>
                                <Icon
                                    style={{
                                    marginLeft: 20
                                }}
                                    type={Icons.FontAwesome}
                                    name={'twitter-square'}
                                    color={Colors.accent}
                                    size={45}/>
                                <Icon
                                    style={{
                                    marginLeft: 20
                                }}
                                    type={Icons.FontAwesome}
                                    name={'whatsapp'}
                                    color={Colors.green3}
                                    size={45}/>
                            </View>
                        </Animatable.View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    linearGradient: {
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
        marginTop: 10,
        width: 50
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

export default ContactUsScreen;
