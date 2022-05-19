import React from 'react';
import {
   StyleSheet,
   View,
   ScrollView,
   FlatList,
   ImageBackground,
   Dimensions
 } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../util/Colors';
import Button from '../reusable_elements/Button';
import Title from '../reusable_elements/Title';
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';
import i18n from '../util/i18n';
 
 const PaymentStatusScreen = ({navigation, route}) => {
   return (
    <View style={{ flex: 1, backgroundColor: Colors.green3}} >
        <View style={{position: 'absolute',
            top: 10, 
            left: '85%',
            width: 50,
            height: 50,
            zIndex: 999}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon onPress={() => navigation.navigate('HomeBottomTabBar', {screen: 'Home', status: route.params.details.userStatus})} name={'close-circle-outline'} style={{fontSize: 45}} color={Colors.appBackground} />
        </View>
      </View>
        <View style={{ padding: 15, flex: 1, width: '100%'}}>
          
          <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
            <View style={{ alignItems: 'center', marginBottom: 60}}>
              <Animatable.View animation={'fadeIn'} style={{flexDirection: 'row', alignItems: 'center'}}>
                <LottieView style={{width: Dimensions.get("screen").height / 1.5, height: Dimensions.get("screen").height / 1.5}}  source={require('../assets/lottie/payment-successfull.json')} autoPlay={true} />
              </Animatable.View>
              <View style={{width: '100%'}}>
                <View style={{alignItems: 'center'}}>
                  {(route.params.details.serviceType === 'None' || route.params.details.serviceType === 'Adopt') && (
                    <Title label="Order placed" color={Colors.appBackground} bold={true} size={28}/>
                  )}
                  {(route.params.details.serviceType === "Training" || route.params.details.serviceType === "Grooming" || route.params.details.serviceType === "Consult") && (
                    <Title label="Service booked" color={Colors.appBackground} bold={true} size={28}/>
                  )}
                </View> 
              </View>
              {/* <Title label="Thank you for using our app, we will try to provide you the best service" color={Colors.mediumDark} bold={true} size={25}/> */}
              <View style={{marginTop: 20}}>
                <View>
                  {(route.params.details.serviceType === 'None' || route.params.details.serviceType === 'Adopt') && (
                    <Button backgroundColor={Colors.lightRed} iconPostionRight={true} useIcon={true} icon="long-arrow-right" title="Track Order" onPress={() => navigation.navigate("TrackOrder", {details: {...route.params.details}})}/>
                  )}
                  {(route.params.details.serviceType === "Training" || route.params.details.serviceType === "Grooming" || route.params.details.serviceType === "Consult") && (
                    <Button backgroundColor={Colors.lightRed} iconPostionRight={true} useIcon={true} icon="long-arrow-right" title="Track Service" onPress={() => navigation.navigate("TrackOrder", {details: {...route.params.details}})}/>
                  )}
                </View>
              </View>
            </View>   
          </ScrollView>
        </View>
    </View>
   );
 };
 
 const styles = StyleSheet.create({
 
 });
 
 export default PaymentStatusScreen;
 