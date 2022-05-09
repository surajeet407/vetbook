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
   Dimensions
 } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../util/Colors';
import Button from '../reusable_elements/Button';
import Title from '../reusable_elements/Title';
import LottieView from 'lottie-react-native';
import SectionBanner from '../reusable_elements/SectionBanner';
import * as Animatable from 'react-native-animatable';
import RazorpayCheckout from 'react-native-razorpay';
import i18n from '../util/i18n';
 
 const PaymentStatusScreen = ({navigation, route}) => {
  // const [status, setStatus] = useState(route.params.status);
  const [status, setStatus] = useState(route.params.details.paymentStatus);
   return (
    <View style={{ flex: 1, backgroundColor: status === 'Success'? Colors.deepGreen:Colors.red}} >
        <View style={{position: 'absolute',
            top: 10, 
            left: '85%',
            width: 50,
            height: 50,
            zIndex: 999}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon onPress={() => status === 'Success'? navigation.navigate('HomeBottomTabBar', {screen: 'Home'}):navigation.goBack()} name={'close-circle-outline'} style={{fontSize: 45}} color={Colors.appBackground} />
        </View>
      </View>
        <View style={{ padding: 15, flex: 1, width: '100%'}}>
          
          <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
            <View style={{ alignItems: 'center', marginBottom: 60}}>
              <Animatable.View animation={'fadeIn'} style={{flexDirection: 'row', alignItems: 'center'}}>
                <LottieView style={{width: Dimensions.get("screen").height / 1.5, height: Dimensions.get("screen").height / 1.5}}  source={status === 'Success'? require('../assets/lottie/payment-successfull.json') : require('../assets/lottie/payment-failed.json')} autoPlay={true} />
              </Animatable.View>
              <View style={{width: '100%'}}>
                {status ==='Success' ?
                <View style={{alignItems: 'center'}}>
                  <Title label="Payment Successful" color={Colors.appBackground} bold={true} size={28}/>
                  
                </View>  
                :
                <View style={{alignItems: 'center'}}>
                  <Title label="Payment Failed" color={Colors.appBackground} bold={true} size={28}/>
                </View>
                }
              </View>
              {/* <Title label="Thank you for using our app, we will try to provide you the best service" color={Colors.mediumDark} bold={true} size={25}/> */}
              <View style={{marginTop: 20}}>
                {status === 'Success'? 
                <Button backgroundColor={Colors.deepGreen} iconPostionRight={true} useIcon={true} icon="long-arrow-right" title="Track Service" onPress={() => navigation.navigate("TrackOrder", {details: {...route.params.details}})}/>
                :  
                <Button backgroundColor={Colors.red} iconPostionRight={true} useIcon={true} icon="long-arrow-right" title="Try Again" onPress={() => navigation.goBack()}/>
                }
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
 