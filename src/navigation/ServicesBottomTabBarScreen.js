import React, {useRef, useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import OrdersScreen from '../screens/OrdersScreen';
import ServicesScreen from '../screens/ServicesScreen';
import RelocationsScreen from '../screens/RelocationsScreen';
import * as Animatable from 'react-native-animatable';
import Icon, {Icons} from '../util/Icons';
import Colors from '../util/Colors';
import i18n from '../util/i18n';

const Tabs = createBottomTabNavigator();

const TabArr = [
    {
        route: 'Services',
        label: 'Services',
        type: Icons.Ionicons,
        activeIcon: 'bicycle',
        inActiveIcon: 'bicycle-outline',
        component: ServicesScreen
    }, {
        route: 'Orders',
        label: 'Orders',
        type: Icons.Octicons,
        activeIcon: 'list-ordered',
        inActiveIcon: 'list-unordered',
        component: OrdersScreen
    }, {
        route: 'Relocations',
        label: 'Relocations',
        type: Icons.Ionicons,
        activeIcon: 'location-sharp',
        inActiveIcon: 'ios-location-outline',
        component: RelocationsScreen
    }
];

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

const ServicesBottomTabBarScreen = ({navigation, route}) => {

    return (
        <Tabs.Navigator
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
            {TabArr.map((item, index) => {
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
                        tabbarlabel: 'Home',
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

export default ServicesBottomTabBarScreen;
