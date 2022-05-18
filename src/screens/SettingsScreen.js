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
import database from '@react-native-firebase/database';
import i18n from '../util/i18n';

const SettingsScreen = ({navigation, route}) => {
    const [deleteInd,
        setDeleteInd] = useState(false)
    const [phoneNo,
        setPhoneNo] = useState("")
    const [homeAddress,
        setHomeAddress] = useState("")
    const [status,
        setStatus] = useState(route.params.status);

    const handleAuthButton = () => {
        if (status === 'loggedIn') {
            database()
                .ref('/users/' + phoneNo)
                .update({active: false})
            AsyncStorage.removeItem('phoneNo')
            AsyncStorage.setItem("userStatus", 'loggedOut');
        }
        navigation.navigate('Log')
    }
    const handleAccountDeletion = () => {
        if(deleteInd) {
            database()
                .ref('/accountDeletionRequest')
                .once("value")
                .then(snapshot => {
                    if(snapshot.val()) {
                        let delAr = []
                        for(let i = 0; i < snapshot.val().length; i++) {
                            if(snapshot.val()[i].phoneNo !== phoneNo) {
                                delAr.push(snapshot.val()[i])
                            }
                        }
                        database()
                            .ref('/accountDeletionRequest').set(delAr)
                    }
            })
            database()
            .ref('/users/' + phoneNo).remove().then(() => {
                AsyncStorage.removeItem('phoneNo')
                AsyncStorage.setItem("userStatus", 'loggedOut');
                navigation.navigate('Log')
                Toast.show({
                    type: 'customToast',
                    text1: "Your account has been deleted successfully...",
                    position: 'top',
                    visibilityTime: 1500,
                    topOffset: 80,
                    delay: 1500,
                    props: {
                        backgroundColor: Colors.green2
                    }
                  });
            })
        } else {
            navigation.navigate("AccountDeletion", {phoneNo: phoneNo})
        }
        
    }
    const getDeletionRequest = (number) => {
        database()
        .ref('/users/' + phoneNo)
        .on("value", snapshot => {
            if(snapshot.val().canDeleteAccount) {
                setDeleteInd(true)
            } else {
                setDeleteInd(false)
            }
        })
    }
    useEffect(() => {
        AsyncStorage
            .getItem("homeAddress")
            .then((homeAddress, msg) => {
                setHomeAddress(JSON.parse(homeAddress))
            })
        AsyncStorage
            .getItem('phoneNo')
            .then((number, msg) => {
                if (number) {
                    setPhoneNo(number)
                    getDeletionRequest(number)
                }
            })
    }, [])
    return (
        <View
            style={{
            flex: 1,
            backgroundColor: Colors.appBackground
        }}>
            <LandingHeader
                homeAddress={homeAddress}
                status={status}
                navigation={navigation}/>
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

                    <View >
                        <SectionBanner
                            title={i18n.firstSectionTitle}
                            borderWidth={80}
                            fontSize={16}
                            borderColor={Colors.white}
                            titleColor={Colors.white}/>
                        <Animatable.View
                            delay={100}
                            animation={'fadeInLeft'}
                            style={{
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
                                onPress={() => navigation.navigate("Pescriptions", {status: status})}>
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
                                        type={Icons.AntDesign}
                                        name={'filetext1'}
                                        size={20}
                                        color={Colors.primary}/>
                                    <Text
                                        style={{
                                        fontFamily: 'PTSerif-Bold',
                                        fontSize: 16,
                                        marginTop: 10
                                    }}>{i18n.uploadedPescription}</Text>
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
                                onPress={() => navigation.navigate("ManageAddress", {
                                showSelection: false,
                                status: status
                            })}>
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
                                        type={Icons.Entypo}
                                        name={'address'}
                                        size={20}
                                        color={Colors.primary}/>
                                    <Text
                                        style={{
                                        fontFamily: 'PTSerif-Bold',
                                        fontSize: 16
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
                                onPress={() => navigation.navigate("ServicesBottomTabBar", {screen: "Orders"})}>
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
                                        type={Icons.Octicons}
                                        name={'list-ordered'}
                                        size={20}
                                        color={Colors.primary}/>
                                    <Text
                                        style={{
                                        fontFamily: 'PTSerif-Bold',
                                        fontSize: 16,
                                        marginTop: 10
                                    }}>{i18n.orders}</Text>
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
                                        marginTop: 10
                                    }}
                                        type={Icons.Ionicons}
                                        name={'bicycle'}
                                        size={20}
                                        color={Colors.primary}/>
                                    <Text
                                        style={{
                                        fontFamily: 'PTSerif-Bold',
                                        fontSize: 16,
                                        marginTop: 10
                                    }}>{i18n.services}</Text>
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
                                        marginTop: 10
                                    }}
                                        type={Icons.Ionicons}
                                        name={'location-sharp'}
                                        size={20}
                                        color={Colors.primary}/>
                                    <Text
                                        style={{
                                        fontFamily: 'PTSerif-Bold',
                                        fontSize: 16,
                                        marginTop: 10
                                    }}>{i18n.relocations}</Text>
                                </View>
                                <Icon
                                    type={Icons.MaterialIcons}
                                    name={'keyboard-arrow-right'}
                                    size={20}
                                    color={Colors.secondary}/>
                            </TouchableOpacity>
                        </Animatable.View>
                    </View>

                    <View style={{
                        marginTop: 20
                    }}>
                        <SectionBanner
                            title={i18n.secondSectionTitle}
                            borderWidth={80}
                            fontSize={16}
                            borderColor={Colors.white}
                            titleColor={Colors.white}/>
                        <Animatable.View
                            delay={100}
                            animation={'fadeInLeft'}
                            style={{
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
                                        fontSize: 16,
                                        marginTop: 10,
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
                                onPress={() => navigation.navigate("Chat")}>
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
                                        type={Icons.Entypo}
                                        name={'chat'}
                                        size={20}
                                        color={Colors.primary}/>
                                    <Text
                                        style={{
                                        fontFamily: 'PTSerif-Bold',
                                        fontSize: 16,
                                        marginTop: 10,
                                    }}>{i18n.chatWithUs}</Text>
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
                            title={i18n.thirdSectionTitle}
                            borderWidth={50}
                            fontSize={16}
                            borderColor={Colors.white}
                            titleColor={Colors.white}/>
                        <Animatable.View
                            delay={100}
                            animation={'fadeInLeft'}
                            style={{
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
                                        fontSize: 16,
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
                                paddingVertical: 8,
                                borderColor: Colors.gray,
                                borderBottomWidth: 1,
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
                                        fontSize: 16,
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
                            {status === 'loggedIn' && (
                                <TouchableOpacity
                                style={{
                                    paddingVertical: 8,
                                    borderColor: Colors.gray,
                                    borderBottomWidth: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                            }}
                                onPress={handleAccountDeletion}>
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
                                        type={Icons.AntDesign}
                                        name={deleteInd
                                        ? 'delete'
                                        : 'deleteuser'}
                                        size={20}
                                        color={Colors.primary}/>
                                    <Text
                                        style={{
                                        fontFamily: 'PTSerif-Bold',
                                        fontSize: 16,
                                        marginTop: 10
                                    }}>{deleteInd
                                            ? 'Delete'
                                            : "Request for account deletion"}</Text>
                                </View>
                                <Icon
                                    type={Icons.MaterialIcons}
                                    name={'keyboard-arrow-right'}
                                    size={20}
                                    color={Colors.secondary}/>
                            </TouchableOpacity>
                            )}
                        </Animatable.View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({});

export default SettingsScreen;
