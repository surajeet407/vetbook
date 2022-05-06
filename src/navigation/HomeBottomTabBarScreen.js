import React, {useRef, useState, useEffect} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    BackHandler,
    Dimensions
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import {CardStyleInterpolators, TransitionPresets} from '@react-navigation/stack';
import PetStoreScreen from '../screens/PetStoreScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SettingsScreen from '../screens/SettingsScreen';
import * as Animatable from 'react-native-animatable';
import Icon, {Icons} from '../util/Icons';
import Colors from '../util/Colors';
import i18n from '../util/i18n';

const Tabs = createBottomTabNavigator();

const TabButton = (props) => {
    const {item, onPress, accessibilityState} = props;
    const focused = accessibilityState.selected;
    const viewRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        if (focused) {
            textRef
                .current
                .animate({
                    0: {
                        scale: .5
                    },
                    1: {
                        scale: 1
                    }
                })
            viewRef
                .current
                .animate({
                    0: {
                        scale: .5,
                        rotate: '0deg'
                    },
                    1: {
                        scale: 1.5,
                        rotate: '360deg'
                    }
                });
        } else {
            viewRef
                .current
                .animate({
                    0: {
                        scale: 1.5,
                        rotate: '360deg'
                    },
                    1: {
                        scale: 1,
                        rotate: '0deg'
                    }
                });
        }
    }, [focused])

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={1} style={styles.container}>
            <Animatable.View ref={viewRef} duration={1000} style={styles.container}>
                <Icon
                    type={item.type}
                    name={focused
                    ? item.activeIcon
                    : item.inActiveIcon}
                    color={focused
                    ? Colors.primary
                    : Colors.gray}/>
            </Animatable.View>
            {focused && (
                <Animatable.Text ref={textRef} style={styles.text}>
                    {item.label}</Animatable.Text>
            )}
        </TouchableOpacity>
    )
}

const HomeBottomTabBarScreen = ({navigation, route}) => {
    // console.log(route.params.status)
    let status = route.params.status,
        tabArr = [
            {
                route: 'Home',
                label: 'Home',
                type: Icons.Ionicons,
                activeIcon: 'home',
                inActiveIcon: 'home-outline',
                component: HomeScreen
            }, {
                route: 'PetStore',
                label: 'Pet Store',
                type: Icons.MaterialCommunityIcons,
                activeIcon: 'shopping',
                inActiveIcon: 'shopping-outline',
                component: PetStoreScreen
            }, {
                route: 'Settings',
                label: 'Settings',
                type: Icons.Ionicons,
                activeIcon: 'settings',
                inActiveIcon: 'settings-outline',
                component: SettingsScreen
            }
        ];
    const backAction = () => {
        BackHandler.exitApp()
    };

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);
    }, [])
    return (
        <Tabs.Navigator
            initialRouteName='Home'
            screenOptions={{
            swipeEnabled: true,
            tabBarShowLabel: true,
            headerShown: false,
            tabBarStyle: {
                height: 65,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                backgroundColor: Colors.secondary
            }
        }}>
            {tabArr.map((item, index) => {
                return (
                    <Tabs.Screen
                        initialParams={{
                        status: route.params.status
                    }}
                        key={index}
                        name={item.route}
                        component={item.component}
                        options={{
                        tabBarShowLabel: true,
                        tabBarButton: (props) => <TabButton {...props} item={item}/>
                    }}></Tabs.Screen>
                )
            })}
        </Tabs.Navigator>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 12,
        textAlign: 'center',
        color: Colors.appBackground,
        marginBottom: 5
    }
});

export default HomeBottomTabBarScreen;
