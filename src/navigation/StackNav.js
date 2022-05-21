import React, {useEffect, useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    useColorScheme
} from 'react-native';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {CardStyleInterpolators, TransitionPresets} from '@react-navigation/stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import database, {firebase} from '@react-native-firebase/database';
import i18n from '../util/i18n';
import ServicesBottomTabBarScreen from '../navigation/ServicesBottomTabBarScreen';
import HomeBottomTabBarScreen from '../navigation/HomeBottomTabBarScreen';
import SpalshScreen from '../screens/SpalshScreen';
import LogScreen from '../screens/LogScreen';
import OTPScreen from '../screens/OTPScreen';
import AddressScreen from '../screens/AddressScreen';
import ManageAddressScreen from '../screens/ManageAddressScreen';
import NotificationScreen from '../screens/NotificationScreen';
import BloodTestScreen from '../screens/BloodTestScreen';
import PetAbuseScreen from '../screens/PetAbuseScreen';
import FillUpAbuseDetailsScreen from '../screens/FillUpAbuseDetailsScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import ItemDetailsScreen from '../screens/ItemDetailsScreen';
import CartScreen from '../screens/CartScreen';
import PetTrainingScreen from '../screens/PetTrainingScreen';
import PetGroomingScreen from '../screens/PetGroomingScreen';
import PetRelocationScreen from '../screens/PetRelocationScreen';
import RelocationDetailsScreen from '../screens/RelocationDetailsScreen';
import ConsultScreen from '../screens/ConsultScreen';
import ConfirmScreen from '../screens/ConfirmScreen';
import AdoptPetScreen from '../screens/AdoptPetScreen';
import PetDetailScreen from '../screens/PetDetailScreen';
import ContactUsScreen from '../screens/ContactUsScreen';
import TermsScreen from '../screens/TermsScreen';
import PaymentStatusScreen from '../screens/PaymentStatusScreen';
import TrackOrderScreen from '../screens/TrackOrderScreen';
import TrackServiceScreen from '../screens/TrackServiceScreen';
import ChooseTimeSlotScreen from '../screens/ChooseTimeSlotScreen';
import PescriptionsScreen from '../screens/PescriptionsScreen';
import PescriptionDetailsScreen from '../screens/PescriptionDetailsScreen';
import ItemReviewScreen from '../screens/ItemReviewScreen';
import ChatScreen from '../screens/ChatScreen';
import AccountDeletionScreen from '../screens/AccountDeletionScreen';
import CancelScreen from '../screens/CancelScreen';



const Stack = createNativeStackNavigator();
const config = {
    animation: 'spring',
    config: {
        stiffness: 100,

        damping: 100,
        mass: 1,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01
    }
};
const forFade = ({current}) => ({
    cardStyle: {
        opacity: current.progress
    }
});

const StackNav = (params) => {
    database().goOnline();
    // database().ref("/").set()
    const [status,
        setStatus] = useState(params.status)
    const scheme = useColorScheme();

    return (
        <NavigationContainer
            theme={scheme === 'dark'
            ? DarkTheme
            : DefaultTheme}>
            <Stack.Navigator
                initialRouteName={status === "loggedIn"
                ? "HomeBottomTabBar"
                : "Splash"}>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="Splash"
                    component={SpalshScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="Log"
                    component={LogScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="OTP"
                    component={OTPScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    initialParams={{
                    status: params.status
                }}
                    name="HomeBottomTabBar"
                    component={HomeBottomTabBarScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="Notifications"
                    component={NotificationScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="BloodTest"
                    component={BloodTestScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    initialParams={{
                    status: params.status
                }}
                    name="Emergency"
                    component={EmergencyScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="PetAbuse"
                    component={PetAbuseScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="FillUpAbuseDetails"
                    component={FillUpAbuseDetailsScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false,
                    gestureEnabled: true,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
                    name="ItemDetails"
                    component={ItemDetailsScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="Cart"
                    component={CartScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="PetTraining"
                    component={PetTrainingScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="PetGrooming"
                    component={PetGroomingScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="PetRelocation"
                    component={PetRelocationScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="RelocationDetails"
                    component={RelocationDetailsScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false,
                    gestureEnabled: true,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
                    name="ContactUs"
                    component={ContactUsScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false,
                    gestureEnabled: true,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
                    name="Terms"
                    component={TermsScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    initialParams={{
                    status: params.status,
                    address: params.address
                }}
                    name="Address"
                    component={AddressScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="ManageAddress"
                    component={ManageAddressScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="AdoptPet"
                    component={AdoptPetScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false,
                    gestureEnabled: true,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
                    name="PetDetail"
                    component={PetDetailScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="Consult"
                    component={ConsultScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="ChooseTimeSlot"
                    component={ChooseTimeSlotScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="Confirm"
                    component={ConfirmScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="PaymentStatus"
                    component={PaymentStatusScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    initialParams={{
                    status: params.status
                }}
                    name="ServicesBottomTabBar"
                    component={ServicesBottomTabBarScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="TrackOrder"
                    component={TrackOrderScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="TrackService"
                    component={TrackServiceScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="Pescriptions"
                    component={PescriptionsScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="PescriptionDetails"
                    component={PescriptionDetailsScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="ItemReview"
                    component={ItemReviewScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="Chat"
                    component={ChatScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="AccountDeletion"
                    component={AccountDeletionScreen}/>
                <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    name="Cancel"
                    component={CancelScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({});

export default StackNav;
