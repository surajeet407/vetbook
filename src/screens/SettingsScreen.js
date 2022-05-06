import React, {useState, useRef, useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Animated,
    ScrollView,
    Image,
    Dimensions,
    ImageBackground
} from 'react-native';
import Colors from '../util/Colors';
import SectionBanner from '../reusable_elements/SectionBanner';
import Icon, {Icons} from '../util/Icons';
import * as Animatable from 'react-native-animatable';
import LandingHeader from '../reusable_elements/LandingHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../util/i18n';

const SettingsScreen = ({navigation, route}) => {
    const [status,
        setStatus] = useState(route.params.status);
    // console.log(route.params.status)
    const handleAuthButton = () => {
        console.log(status)
        if (status === 'loggedIn') {
            AsyncStorage.setItem("userStatus", 'loggedOut');
        }
        navigation.navigate('Log')
    }
    return (
        <View
            style={{
            flex: 1,
            backgroundColor: Colors.appBackground
        }}>
            <LandingHeader status={status} navigation={navigation}/>
            <View
                style={{
                marginTop: 80,
                marginBottom: 0,
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
                paddingHorizontal: 20,
                flex: 1,
                width: '100%',
                alignItems: 'flex-start'
            }}>
                <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
                    {status === "loggedIn" && (
                        <View >
                            <SectionBanner
                                fontSize={20}
                                title={i18n.firstSectionTitle}
                                borderColor={Colors.appBackground}
                                borderWidth={100}
                                titleColor={Colors.mediumDark}/>
                            <Animatable.View
                                delay={100}
                                animation={'fadeInLeft'}
                                style={{
                                marginTop: 5
                            }}>
                                <TouchableOpacity
                                    style={{
                                    paddingVertical: 8,
                                    borderColor: Colors.gray,
                                    borderBottomWidth: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                                    onPress={() => navigation.navigate("ManageAddress", {showSelection: false})}>
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Icon
                                            style={{
                                            marginRight: 10,
                                            marginTop: 5
                                        }}
                                            type={Icons.Entypo}
                                            name={'address'}
                                            size={20}
                                            color={Colors.primary}/>
                                        <Text
                                            style={{
                                            fontFamily: 'PTSerif-Bold',
                                            fontSize: 18
                                        }}>{i18n.manageAddress}</Text>
                                    </View>
                                    <Icon
                                        type={Icons.MaterialIcons}
                                        name={'keyboard-arrow-right'}
                                        size={20}
                                        color={Colors.secondary}/>

                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                    paddingVertical: 8,
                                    borderColor: Colors.gray,
                                    borderBottomWidth: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                                    onPress={() => navigation.navigate("TrackOrder")}>
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Icon
                                            style={{
                                            marginRight: 10,
                                            marginTop: 5
                                        }}
                                            type={Icons.MaterialCommunityIcons}
                                            name={'car-traction-control'}
                                            size={20}
                                            color={Colors.primary}/>
                                        <Text
                                            style={{
                                            fontFamily: 'PTSerif-Bold',
                                            fontSize: 18,
                                            marginTop: 10
                                        }}>{i18n.trackService}
                                            (1)</Text>
                                    </View>
                                    <Icon
                                        type={Icons.MaterialIcons}
                                        name={'keyboard-arrow-right'}
                                        size={20}
                                        color={Colors.secondary}/>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                    paddingVertical: 8,
                                    borderColor: Colors.gray,
                                    borderBottomWidth: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                                    onPress={() => navigation.navigate("ServicesBottomTabBar", {screen: "Orders"})}>
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Icon
                                            style={{
                                            marginRight: 10,
                                            marginTop: 5
                                        }}
                                            type={Icons.Octicons}
                                            name={'list-ordered'}
                                            size={20}
                                            color={Colors.primary}/>
                                        <Text
                                            style={{
                                            fontFamily: 'PTSerif-Bold',
                                            fontSize: 18,
                                            marginTop: 10
                                        }}>{i18n.orders}
                                            (4)</Text>
                                    </View>
                                    <Icon
                                        type={Icons.MaterialIcons}
                                        name={'keyboard-arrow-right'}
                                        size={20}
                                        color={Colors.secondary}/>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                    paddingVertical: 8,
                                    borderColor: Colors.gray,
                                    borderBottomWidth: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                                    onPress={() => navigation.navigate("ServicesBottomTabBar", {screen: "Services"})}>
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Icon
                                            style={{
                                            marginRight: 10,
                                            marginTop: 5
                                        }}
                                            type={Icons.Ionicons}
                                            name={'bicycle'}
                                            size={20}
                                            color={Colors.primary}/>
                                        <Text
                                            style={{
                                            fontFamily: 'PTSerif-Bold',
                                            fontSize: 18,
                                            marginTop: 10
                                        }}>{i18n.services}
                                            (4)</Text>
                                    </View>
                                    <Icon
                                        type={Icons.MaterialIcons}
                                        name={'keyboard-arrow-right'}
                                        size={20}
                                        color={Colors.secondary}/>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                    paddingVertical: 8,
                                    borderColor: Colors.gray,
                                    borderBottomWidth: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                                    onPress={() => navigation.navigate("ServicesBottomTabBar", {screen: "Relocations"})}>
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Icon
                                            style={{
                                            marginRight: 10,
                                            marginTop: 5
                                        }}
                                            type={Icons.Ionicons}
                                            name={'location-sharp'}
                                            size={20}
                                            color={Colors.primary}/>
                                        <Text
                                            style={{
                                            fontFamily: 'PTSerif-Bold',
                                            fontSize: 18,
                                            marginTop: 10
                                        }}>{i18n.relocations}
                                            (4)</Text>
                                    </View>
                                    <Icon
                                        type={Icons.MaterialIcons}
                                        name={'keyboard-arrow-right'}
                                        size={20}
                                        color={Colors.secondary}/>
                                </TouchableOpacity>
                            </Animatable.View>
                        </View>
                    )}

                    <View style={{
                        marginTop: 20
                    }}>
                        <SectionBanner
                            fontSize={20}
                            title='Support'
                            borderColor={Colors.appBackground}
                            borderWidth={100}
                            titleColor={Colors.mediumDark}/>
                        <Animatable.View
                            delay={100}
                            animation={'fadeInLeft'}
                            style={{
                            marginTop: 5
                        }}>
                            <TouchableOpacity
                                style={{
                                paddingVertical: 8,
                                borderColor: Colors.gray,
                                borderBottomWidth: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                                onPress={() => navigation.navigate("ContactUs")}>
                                <View
                                    style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <Icon
                                        style={{
                                        marginRight: 10,
                                        marginTop: 2
                                    }}
                                        type={Icons.MaterialIcons}
                                        name={'contact-support'}
                                        size={20}
                                        color={Colors.primary}/>
                                    <Text
                                        style={{
                                        fontFamily: 'PTSerif-Bold',
                                        fontSize: 18
                                    }}>{i18n.contactUs}</Text>
                                </View>
                                <Icon
                                    type={Icons.MaterialIcons}
                                    name={'keyboard-arrow-right'}
                                    size={20}
                                    color={Colors.secondary}/>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                paddingVertical: 8,
                                borderColor: Colors.gray,
                                borderBottomWidth: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                                onPress={() => navigation.navigate("ContactUs")}>
                                <View
                                    style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <Icon
                                        style={{
                                        marginRight: 10,
                                        marginTop: 2
                                    }}
                                        type={Icons.MaterialCommunityIcons}
                                        name={'typewriter'}
                                        size={20}
                                        color={Colors.primary}/>
                                    <Text
                                        style={{
                                        fontFamily: 'PTSerif-Bold',
                                        fontSize: 18
                                    }}>{i18n.writeToUs}</Text>
                                </View>
                                <Icon
                                    type={Icons.MaterialIcons}
                                    name={'keyboard-arrow-right'}
                                    size={20}
                                    color={Colors.secondary}/>
                            </TouchableOpacity>
                        </Animatable.View>
                    </View>
                    <View
                        style={{
                        marginTop: 20,
                        width: Dimensions
                            .get('screen')
                            .width - 40
                    }}>
                        <SectionBanner
                            fontSize={20}
                            title='Legal'
                            borderColor={Colors.appBackground}
                            borderWidth={100}
                            titleColor={Colors.mediumDark}/>
                        <Animatable.View
                            delay={100}
                            animation={'fadeInLeft'}
                            style={{
                            marginTop: 5
                        }}>
                            <TouchableOpacity
                                style={{
                                paddingVertical: 8,
                                borderColor: Colors.gray,
                                borderBottomWidth: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                                onPress={() => navigation.navigate("Terms")}>
                                <View
                                    style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <Icon
                                        style={{
                                        marginRight: 10,
                                        marginTop: 10
                                    }}
                                        type={Icons.MaterialCommunityIcons}
                                        name={'table-of-contents'}
                                        size={20}
                                        color={Colors.primary}/>
                                    <Text
                                        style={{
                                        fontFamily: 'PTSerif-Bold',
                                        fontSize: 18,
                                        marginTop: 10
                                    }}>{i18n.terms}</Text>
                                </View>
                                <Icon
                                    type={Icons.MaterialIcons}
                                    name={'keyboard-arrow-right'}
                                    size={20}
                                    color={Colors.secondary}/>
                            </TouchableOpacity>
                        </Animatable.View>
                        <Animatable.View
                            delay={100}
                            animation={'fadeInLeft'}
                            style={{
                            marginTop: 5,
                            marginBottom: 10
                        }}>
                            <TouchableOpacity
                                style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                                onPress={handleAuthButton}>
                                <View
                                    style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <Icon
                                        style={{
                                        marginRight: 10,
                                        marginTop: 10
                                    }}
                                        type={Icons.SimpleLineIcons}
                                        name={status === 'loggedIn'
                                        ? 'logout'
                                        : 'login'}
                                        size={20}
                                        color={Colors.primary}/>
                                    <Text
                                        style={{
                                        fontFamily: 'PTSerif-Bold',
                                        fontSize: 18,
                                        marginTop: 10
                                    }}>{status === 'loggedIn'
                                            ? i18n.logOut
                                            : i18n.logIn}</Text>
                                </View>
                                <Icon
                                    type={Icons.MaterialIcons}
                                    name={'keyboard-arrow-right'}
                                    size={20}
                                    color={Colors.secondary}/>
                            </TouchableOpacity>
                        </Animatable.View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({});

export default SettingsScreen;
