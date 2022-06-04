import React, {useState, useRef, useEffect} from 'react';
import {
   StyleSheet,
   Text,
   View,
   Animated,
   ScrollView,
   ImageBackground,
   FlatList,
   Image
 } from 'react-native';
import Colors from '../util/Colors';
import Button from '../reusable_elements/Button';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import Toast from 'react-native-toast-message';
import Card from '../reusable_elements/Card';
import DefaltAddressComponent from '../reusable_elements/DefaltAddressComponent';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
import { RadioButton } from 'react-native-paper';
import Title from '../reusable_elements/Title';
import database from '@react-native-firebase/database';
import RazorpayCheckout from 'react-native-razorpay';
import Icon, { Icons } from '../util/Icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Label, {Orientation} from "react-native-label";
import SectionBanner from '../reusable_elements/SectionBanner';
import uuid from 'react-native-uuid';
import i18n from '../util/i18n';
import moment from 'moment';




 const ConfirmScreen = ({navigation, route}) => {
  const [status, setStatus] = useState('')
  const [phoneNo, setPhoneNo] = useState('')
  const [cartItems, setCartItems] = useState([])
  const [defaltAddress, setDefaltAddress] = useState(null)
  const [priceDetails, setPriceDetails] = useState([]);
  const [total, setTotal] = useState("");
  const [activeSections, setActiveSections] = useState([0]);
  const updateSections = (section) => {
    setActiveSections(section);
    if (priceDetails[section]) {
      setTotal(priceDetails[section].discountPrice);
    } else {
      setTotal(0);
    }
  }
  const getData = () => {
    let ref= "";
    switch (route.params.details.serviceType) {
      case 'Training':
        ref = "/trainingPrice"
        break;
      case 'Grooming':
        ref = "/groomingPrice"
        break;
      case 'Consult':
        ref = "/doctorPrice"
        break;     
      default:
        break;
    }
    database()
    .ref(ref)
    .once('value')
    .then(snapshot => {
      if(snapshot.val()) {
        setPriceDetails(snapshot.val())
        setTotal(snapshot.val()[0].discountPrice)
      }
    })
    
  }

const _updateUiBasedOnServiceType = (txnId) => {
  let type = "", anonymusPath = '', navToScreen = 'Orders', loggedInPath = '', clearCart = false, ar = [], obj = {...route.params.details}
  obj.id = uuid.v4()
  obj.orderedOn = moment().format('yyyy-MM-DD').toString()
  obj.userStatus = "loggedOut"
  obj.trackStep = "0"
  obj.txnId = txnId,
  obj.paymentStatus = "Success"
  obj.fromScreen = "Confirm"
  obj.address = defaltAddress
  if (route.params.details.serviceType === "None" ) {
    obj.mode = "inprocess"
    obj.type = 'Items';
    anonymusPath = 'anonymusOrders'
    adminPath = 'allOrders'
    clearCart = true
  }  else if(route.params.details.serviceType === "Adopt") {
    obj.mode = "inprocess"
    obj.type = 'Adopt';
    anonymusPath = 'anonymusOrders'
    adminPath = 'allOrders'
  } else {
    obj.notes = ""
    obj.mode = "ongoing"
    obj.total = total
    obj.type = 'Service';
    anonymusPath = 'anonymusServices'
    adminPath = 'allServices'
    navToScreen = "Services"
  } 
  if(status === 'loggedOut') {
    obj.userStatus = "loggedOut"
    obj.phoneNo = defaltAddress.phoneNo
    if(clearCart) { 
      AsyncStorage.setItem("cartItems", "[]")
    }
    AsyncStorage.getItem(anonymusPath).then((data) => {
      obj.userStatus = "loggedOut"
      if(data && JSON.parse(data).length > 0) {
        ar = JSON.parse(data)
        ar.push(obj)
      } else {
        ar.push(obj);
      }
      AsyncStorage.setItem(anonymusPath, JSON.stringify(ar))
    });
  } else {
    obj.phoneNo = phoneNo
    obj.userStatus = "loggedIn"
    if(clearCart) { 
      database().ref('/users/' + phoneNo + "/cartItems").set(null)
    }
  }
  database()
    .ref('/' + adminPath)
    .once("value")
    .then(snapshot => {
        if (snapshot.val() && snapshot.val().length > 0) {
          ar = snapshot.val()
          ar.push(obj)
        } else {
          ar.push(obj);
        }
        database().ref('/' + adminPath).set(ar)
        navigation.navigate("PaymentStatus", {details: obj})
    })
}

  const _initializePayment = (desc, image, name) => {
    var options = {
      description: desc,
      image: image,
      currency: 'INR',
      key: "rzp_test_EIvDuWAtnslSuW",
      amount: 100 * parseInt(total),
      name: name,
      theme: {color: Colors.primary}
    }
    RazorpayCheckout.open(options).then((data) => {
      // console.log(data);
      _updateUiBasedOnServiceType(data.razorpay_payment_id)
    }).catch((error) => {
      console.log(error.description.error.reason)
      if(error.description.error.reason === "payment_cancelled") {
        Toast.show({
          type: 'customToast',
          text1: 'Payment has been cancelled...',
          position: 'bottom',
          visibilityTime: 1500,
          bottomOffset: 120,
          props: {
              backgroundColor: Colors.error_toast_color
          }
        });
        // let obj = {...route.params.details}
        // obj.paymentStatus = "Error"
        // navigation.navigate("PaymentStatus", {details: obj})
      }
      
    });
    
  }

  const onPressMakePayment = () => {
    if(defaltAddress) {
      if (route.params.details.serviceType === "None" ) {
        _initializePayment("", "", "Item Total");
      } else if(route.params.details.serviceType === "BloodTest" || route.params.details.serviceType === "Adopt") {
        _initializePayment(route.params.details.desc, route.params.details.image, route.params.details.serviceType);
      }  else {
        if(priceDetails[activeSections]) {
          _initializePayment(route.params.details.desc, route.params.details.image, route.params.details.serviceType);
        } else {
          Toast.show({
            type: 'customToast',
            text1: 'Please select one service...',
            position: 'bottom',
            visibilityTime: 1500,
            bottomOffset: 120,
            props: {
                backgroundColor: Colors.error_toast_color
            }
          });
        }
      }
    } else {
      Toast.show({
        type: 'customToast',
        text1: 'Please add or select one address...',
        position: 'bottom',
        visibilityTime: 1500,
        bottomOffset: 120,
        props: {
            backgroundColor: Colors.error_toast_color
        }
      });
    }
  }

  const updateDefaltAddress = (address) => {
    setDefaltAddress(address)
  }

  useEffect(() => {
    AsyncStorage.getItem('userStatus').then((status) => {
      setStatus(status)
    })
    AsyncStorage
    .getItem('phoneNo')
    .then((phoneNo, msg) => {
      if(phoneNo){
        setPhoneNo(phoneNo)
      }
    })
    if (route.params.details.serviceType === "None" ) {
      setCartItems(route.params.details.cartItems);
      setTotal(route.params.details.total);
    } else if(route.params.details.serviceType === "BloodTest") {
      setTotal("299");
    } else if(route.params.details.serviceType === "Adopt") {
      setTotal(route.params.details.cost);
    } else {
      getData();
    }
  }, []);
   return (
    <View style={{ flex: 1, backgroundColor: Colors.appBackground}} >
        <GeneralHeader 
            showRigtIcon={false}
            rightIconType={Icons.MaterialIcons}
            rightIconName={'navigate-before'} 
            rightIconSize={35} 
            rightIconColor={Colors.black}
            rightIconBackgroundColor={Colors.appBackground}
            onPressRight={() => navigation.goBack()} 

            showRightSideText={true}
            rightSideText={total === 0? "":"Total: " + total + "/-"} 
            rightSideTextSize={20} 
            rightSideTextColor={Colors.secondary}

            subHeaderText="Pay total to proceed..." 
            showSubHeaderText={true} 
            subHeaderTextSize={20} 
            subHeaderTextColor={Colors.secondary}

            position={'relative'} 
            headerHeight={120}

            headerText={"Confirm"} 
            headerTextSize={25} 
            headerTextColor={Colors.primary} 
            showHeaderText={true}

            showLeftIcon={true}
            leftIconType={Icons.MaterialIcons} 
            leftIconName={'navigate-before'} 
            leftIconSize={35} 
            leftIonColor={Colors.black}
            leftIconBackgroundColor={Colors.appBackground}
            onPressLeft={() => navigation.goBack()} 
        />
        <View style={{backgroundColor: Colors.appBackground, paddingHorizontal: 20, marginBottom: route.params.details.serviceType === "None"? 200:80, flex: 1, width: '100%'}}>
          
          {route.params.details.serviceType === "None"?
            <View style={{flex: 1}}>  
              <DefaltAddressComponent selectedAddress={route.params.details.address} updateDefaltAddress={updateDefaltAddress} navigation={navigation} params={route.params.details} />
              <View style={{marginTop: 10, marginBottom: 10}}>
                <SectionBanner fontSize={20} title={"Items (" + cartItems.length + ")"} borderColor={Colors.primary} borderWidth={100} titleColor={Colors.mediumDark}/>
              </View>
              <SwipeListView
                disableLeftSwipe
                scrollEventThrottle={16}
                disableRightSwipe
                width="100%"
                showsVerticalScrollIndicator={false}
                data={cartItems}
                keyExtractor={item => item.id}
                leftOpenValue={60}
                rightOpenValue={-80}
                ItemSeparatorComponent={() => (
                  <View style={{marginBottom: 10}}/>
                )}
                renderItem={ ({item, index}) => (
                <Animatable.View delay={50 * index} animation={'slideInRight'} style={{margin: 5, paddingHorizontal: 15, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: Colors.appBackground, borderRadius: 15, elevation: 5}}>
                  <View style={{flexDirection: 'row'}}>
                    <Image source={{uri: item.image}} style={{borderRadius: 15, borderColor: Colors.appBackground, borderWidth: 5,  width: 60, height: 60}}/>
                    <View style={{marginLeft: 10, width: '70%',   justifyContent: 'center'}}>
                      <View style={{width: '90%', flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontFamily: 'Oswald-Medium', fontSize: 18, color: Colors.primary}}>{item.name}</Text>
                        <Icon type={Icons.Ionicons} style={{marginTop: 10, marginLeft: 2}} name={'close'} size={18} color={Colors.primary}/>
                        <Text style={{marginLeft: 2, fontFamily: 'Oswald-Medium', fontSize: 18, color: Colors.primary}}>{item.quantity}</Text>
                      </View>
                      <Text style={{fontFamily: 'PTSerif-Bold', fontSize: 14, color: Colors.darkGray}}>Price: {item.discountPrice} /-</Text>
                    </View>
                  </View>
                </Animatable.View>
                )}
              /> 
          </View>

          :
          <ScrollView scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}>
            <DefaltAddressComponent selectedAddress={route.params.details.address} updateDefaltAddress={updateDefaltAddress}  navigation={navigation} params={route.params.details} />
            {route.params.details.serviceType === "BloodTest" && (
            <View style={{marginTop: 20,  alignItems: 'center', height: 320, padding: 5}}>
                <Label
                  orientation={Orientation.TOP_RIGHT}
                  containerStyle={{
                      width: "100%",
                  }}
                  style={{fontSize: 18, fontFamily: 'Oswald-Regular'}}
                  title={"₹ " + total + " /- (Inc Tax)" }
                  color={Colors.primary}
                  distance={120} extent={0.1}>
                  <View style={{padding: 15, elevation: 5, width: '100%', height: 300, backgroundColor: Colors.appBackground,  borderRadius: 10, elevation: 5}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.gray}}>
                      <Animatable.Text animation={'fadeInDown'} style={{color: Colors.Bg6, fontSize: 30, fontFamily: 'Oswald-Medium'}}>{"Blood Test"}</Animatable.Text>
                    </View>
                    <View style={{marginTop: 5}}>
                      {route.params.details.petDetails.map((item, index) => 
                        <View key={index} style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Title color={Colors.darkGray} size={18} bold={true} label={item.name + ":"}/>
                          <View style={{marginLeft: 10}}>
                            <Title color={Colors.Bg6} size={18} bold={true} label={item.value}/>
                          </View>
                        </View>
                      )}
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Title color={Colors.darkGray} size={18} bold={true} label={"Date:"}/>
                          <View style={{marginLeft: 10}}>
                            <Title color={Colors.Bg6} size={18} bold={true} label={route.params.details.selectedDate}/>
                          </View>
                      </View>
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Title color={Colors.darkGray} size={18} bold={true} label={"Time"}/>
                          <View style={{marginLeft: 10}}>
                            <Title color={Colors.Bg6} size={18} bold={true} label={"Between " + route.params.details.timeSlot.startTime + " to " + route.params.details.timeSlot.endTime}/>
                          </View>
                        </View>
                    </View>
                  </View>
              </Label>
            </View>
            )}

            {route.params.details.serviceType === "Adopt" && (
             <View style={{ flex: 1, backgroundColor: Colors.appBackground, marginTop: 20, padding: 5, justifyContent: 'space-around'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Animated.Image style={{backgroundColor: route.params.details.color, width: 120, height: 120, borderRadius: 15}} source={{uri: route.params.details.image}}/>
                    <View style={{marginLeft: 10, width: '100%'}}>
                      <Animatable.Text animation={'fadeInDown'} style={{letterSpacing: 2, color: 'grey', fontSize: 40, fontFamily: 'Oswald-Medium'}}>{route.params.details.name}</Animatable.Text>
                      <Title color={Colors.darkGray} size={15} bold={true} label="Location: USA"/>
                      <View style={{width: '30%', flexDirection: 'row', alignItems: 'center'}}>
                          <Title color={Colors.darkGray} size={15} bold={true} label="Price:"/>
                          <View style={{ alignItems: 'center', marginLeft: 5, paddingHorizontal: 5, backgroundColor: Colors.primary, borderRadius: 10}}>
                              <Text style={{color: Colors.appBackground, fontSize: 12, fontFamily: 'Oswald-Medium'}}>{route.params.details.cost} /-</Text>
                          </View>
                      </View>
                    </View>
                </View>
                <FlatList
                    style={{marginTop: 20, marginBottom: 20}}
                    data={route.params.details.details}
                    scrollEnabled={true}
                    horizontal
                    pagingEnabled
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => (
                        <View style={{marginLeft: 10}}/>
                    )}
                    renderItem={({ item, index, separators  }) => (
                        <Animatable.View delay={index * 100} animation={'fadeInLeft'} key={index} style={{borderRadius: 5, backgroundColor: Colors.gray, alignItems: 'center', justifyContent:'center', width: 80, height: 80}}>
                            <Title color={Colors.primary} size={18} bold={true} label={item.key}/>
                            <Title color={Colors.darkGray} size={14} bold={true} label={item.value}/>
                        </Animatable.View>
                    )}
                    
                />
                <View style={{backgroundColor: Colors.appBackground, borderRadius: 15, elevation: 5, padding: 10}}>
                    <View style={{width: 92, borderBottomColor: Colors.primary, borderBottomWidth: 1}}>
                        <Title color={Colors.primary} size={25} bold={true} label="About Me"/>
                    </View>
                    <Title color={Colors.darkGray} size={18} bold={true} label={route.params.details.desc}/>
                </View>
            </View>
            )}


            {(route.params.details.serviceType === "Training" || route.params.details.serviceType === "Grooming" || route.params.details.serviceType === "Consult") && (
            <View style={{marginTop: 10}}>
              <Accordion
                underlayColor={Colors.appBackground}
                sections={priceDetails}
                activeSections={activeSections}
                renderHeader={(item, index, isActive, items) => 
                <View 
                  style={{borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 5, marginVertical: 5, backgroundColor: isActive ? Colors.secondary : Colors.darkOverlayColor }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[styles.headerText, {color: isActive? Colors.white:Colors.white}]}>{item.headerLeftText}</Text>
                  </View>
                  <Icon style={{right: 5}} type={Icons.AntDesign} name={isActive? 'checksquare':'checksquareo'} size={20} color={Colors.appBackground} />
                </View>
                }
                renderContent={(item, index, isActive, items) => 
                  <Animatable.View delay={100} animation="slideInLeft" style={{marginTop: 15, paddingHorizontal: 5}}>
                    <Card 
                      key={item.headerLeftText}
                      showTag={item.showTag}
                      tagText={item.tagText}
                      headerLeftText={item.headerLeftText}
                      headerRightText={item.headerRightText}
                      actualPrice={item.actualPrice}
                      discountPrice={item.discountPrice}
                      showNotes={item.showNotes}
                      notes={item.notes}
                      details={item.details}
                    />
                  </Animatable.View>
                }
                onChange={updateSections}
              />
              
            </View>
            )}
          </ScrollView>
          }
        </View>
        <Animatable.View delay={100} animation={'slideInUp'}>
          <ImageBackground blurRadius={0} source={require('../assets/images/background6.png')} style={{overflow: 'hidden', position: 'absolute', bottom: 0, width: '100%', alignItems: 'center', justifyContent: 'center', padding: 10, height: route.params.details.serviceType === "None"? 200: 80,  backgroundColor: Colors.secondary, borderTopLeftRadius: 50, elevation: 15, borderTopRightRadius: 50}}>
            <View style={{width: '90%'}}>
              {route.params.details.serviceType === "None" && (
              <View style={{marginBottom: 20}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={{fontFamily: 'Oswald-Medium', fontSize: 20, color: Colors.darkGray}}>{route.params.details.cartItems.length} Items</Text>
                  <Text style={{fontFamily: 'Oswald-Medium', fontSize: 20, color: Colors.darkGray}}>₹ {route.params.details.amount} /-</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={{fontFamily: 'Oswald-Medium', fontSize: 20, color: Colors.darkGray}}>Tax</Text>
                  <Text style={{fontFamily: 'Oswald-Medium', fontSize: 20, color: Colors.darkGray}}>₹ {route.params.details.tax} /-</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={{fontFamily: 'Oswald-SemiBold', fontSize: 22, color: Colors.white}}>Total</Text>
                  <Text style={{fontFamily: 'Oswald-SemiBold', fontSize: 22, color: Colors.white}}>₹ {route.params.details.total} /-</Text>
                </View>
              </View>
              )}
              <Button backgroundColor={Colors.primary} iconPostionRight={true} useIcon={true} icon="long-arrow-right" title="Make Payment" onPress={onPressMakePayment}/>
            </View>
          </ImageBackground>
        </Animatable.View>
    </View>
   );
 };
 
 const styles = StyleSheet.create({
  header: {
    padding: 10,
  },
  headerText: {
    fontSize: 15,
    fontFamily: 'Oswald-SemiBold',
    marginLeft: 5,
    marginBottom: 5
  },
  content: {
    padding: 20,
    backgroundColor: Colors.appBackground,
  }
 });
 
 export default ConfirmScreen;
 