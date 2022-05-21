import React, {useState, useRef, useEffect} from 'react';
 import {
   StyleSheet,
   Text,
   View,
   Image,
   TouchableOpacity,
   Dimensions,
   ImageBackground,
   ScrollView,
   Animated,
   RefreshControl
 } from 'react-native';
import { useTheme, useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Colors from '../util/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-paper';
import Title from '../reusable_elements/Title';
import HomeScreenLoader from '../reusable_elements/HomeScreenLoader';
import LandingHeader from '../reusable_elements/LandingHeader';
import TrackComponent from '../reusable_elements/TrackComponent';
import { TouchableRipple } from 'react-native-paper';
import Swiper from 'react-native-swiper'
import * as Animatable from 'react-native-animatable';
import SectionBanner from '../reusable_elements/SectionBanner';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNMasonryScroll from "react-native-masonry-scrollview";
import RNBounceable from '@freakycoder/react-native-bounceable';
import LinearGradient from 'react-native-linear-gradient';
import i18n from '../util/i18n';
import LottieView from 'lottie-react-native';
import NetInfo from "@react-native-community/netinfo";

 
 const HomeScreen = ({navigation, route}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [isConnectedToNet, setIsConnectedToNet] = useState(true)
  const isFocused = useIsFocused();
  const [homeAddress, setHomeAddress] = useState({})
  const [vetServiceCount, setVetServiceCount] = useState(0)
  const [groomingServiceCount, setGroomingServiceCount] = useState(0)
  const [trainingServiceCount, setTrainingServiceCount] = useState(0)
  const [trackDetails, setTrackDetails] = useState(null)
  const [status, setStatus] = useState(route.params.status);
  const [showTrackComponent, setShowTrackComponent] = useState(false)
  const [homePageCarouselServices, setHomePageCarouselServices] = useState([]);
  const [mainServices, setMainServices] = useState([]);
  const [quickService, setQuickService] = useState([]);
  const [storeData, setStoreData] = useState({});
  const [loadind, setLoading] = useState(true);
  const { colors } = useTheme();


  const getData = () => {
    if (status === 'loggedIn') {
      AsyncStorage
          .getItem('phoneNo')
          .then((phoneNo, msg) => {
              if (phoneNo) {
                  database()
                      .ref("/users/" + phoneNo + "/services")
                      .on('value', snapshot => {
                          setRefreshing(false)
                          setVetServiceCount(0)
                          setGroomingServiceCount(0)
                          setTrainingServiceCount(0)
                          if (snapshot.val()) {
                            let onGoingItems = snapshot.val().filter(item => item.mode === 'ongoing')
                            // console.log(onGoingItems)
                            if (onGoingItems.length > 0) {
                              setShowTrackComponent(true);
                              setTrackDetails(onGoingItems[0]);
                            } else {
                              setShowTrackComponent(false);
                            }
                            for(let i = 0; i < snapshot.val().length; i++) {
                                if((snapshot.val()[i].serviceType  === 'Consult' || snapshot.val()[i].serviceType  === 'Veterinary' || snapshot.val()[i].serviceType  === 'BloodTest') && snapshot.val()[i].mode === 'ongoing') {
                                  setVetServiceCount(1)
                                }
                                if(snapshot.val()[i].serviceType === 'Training' && snapshot.val()[i].mode === 'ongoing') {
                                  setTrainingServiceCount(1)
                                }
                                if(snapshot.val()[i].serviceType === 'Grooming' && snapshot.val()[i].mode === 'ongoing') {
                                  setGroomingServiceCount(1)
                                }
                            }
                          } else {
                            setShowTrackComponent(false);
                          }
                      })
              }
          })

  } else {
      AsyncStorage
          .getItem("anonymusServices")
          .then((data) => {
              if (data && JSON.parse(data).length > 0) {
                setRefreshing(false)
                let mainData = JSON.parse(data)
                let onGoingItems = mainData.filter(item => item.mode === 'ongoing')
                if (onGoingItems.length > 0) {
                  setShowTrackComponent(true);
                  setTrackDetails(onGoingItems[0]);
                } else {
                  setShowTrackComponent(false);
                }
                for(let i = 0; i < mainData.length; i++) {
                  if((mainData[i].serviceType  === 'Consult' || mainData[i].serviceType  === 'Veterinary' || mainData[i].serviceType  === 'BloodTest') && mainData[i].mode === 'ongoing') {
                    setVetServiceCount(1)
                  }
                  if(mainData[i].serviceType === 'Training' && mainData[i].mode === 'ongoing') {
                    setTrainingServiceCount(1)
                  }
                  if(mainData[i].serviceType === 'Grooming' && mainData[i].mode === 'ongoing') {

                    setGroomingServiceCount(1)
                  }
                }
              } else {
                setShowTrackComponent(false);
              }
          });
  }


    let HomePageCarouselServices = database()
      .ref('/HomePageCarouselServices'),
      services = database()
      .ref('/services');
    HomePageCarouselServices.keepSynced(true)
    services.keepSynced(true)
    HomePageCarouselServices.on('value', snapshot => {
      setLoading(false);
      if(snapshot.val()) {
        setHomePageCarouselServices(snapshot.val())
      }
    })
    
    services.on('value', snapshot => {
      if(snapshot.val()) {
        setMainServices(snapshot.val())
      }
    })

    
    database()
    .ref('/quickService')
    .on('value', snapshot => {
      if(snapshot.val()) {
        setQuickService(snapshot.val())
      }
    })
    
  }
  const onPressNavToService = (item) => {
    if(item.title === 'Veterinary' || item.title === 'Consult' || item.title === 'Blood Test') {
      if(vetServiceCount > 0) {
          Toast.show({
            type: 'customToast',
            text1: "You have an active ongoing service...",
            position: 'bottom',
            visibilityTime: 1500,
            bottomOffset: 80,
            props: {
                backgroundColor: Colors.error_toast_color
            }
        });
      } else {
        navigation.navigate(item.navTo, {item: item})
      }
    } else if (item.title === 'Relocation') {
      navigation.navigate(item.navTo, {item: item})
    } else if(item.title === 'Training') {
      if(trainingServiceCount > 0) {
        Toast.show({
          type: 'customToast',
          text1: "You have an active training request...",
          position: 'bottom',
          visibilityTime: 1500,
          bottomOffset: 80,
          props: {
              backgroundColor: Colors.error_toast_color
          }
      });
    } else {
      navigation.navigate(item.navTo, {item: item})
    }
    } else if(item.title === 'Grooming') {
      // console.log(groomingServiceCount)
      if(groomingServiceCount > 0) {
        Toast.show({
          type: 'customToast',
          text1: "You have an active grooming request...",
          position: 'bottom',
          visibilityTime: 1500,
          bottomOffset: 80,
          props: {
              backgroundColor: Colors.error_toast_color
          }
      });
      } else {
        navigation.navigate(item.navTo, {item: item})
      }
    }
  }
  const onPressRetry = () => {
    NetInfo.fetch().then(state => {
      if(!state.isConnected) {
        setIsConnectedToNet(false)
      } else {
        setIsConnectedToNet(true)
        getData();
      }
    });
  }

  const onRefresh = () => {
    setRefreshing(true)
    getData();
  }


  useEffect(() => {
    NetInfo.fetch().then(state => {
      if(!state.isConnected) {
        setIsConnectedToNet(false)
      } else {
        setIsConnectedToNet(true)
      }
    });
    if (isFocused) {
      AsyncStorage
        .getItem("homeAddress")
        .then((homeAddress, msg) => {
          setHomeAddress(JSON.parse(homeAddress))
      })
      getData();
    }
  }, [isFocused])
   return (
    <View  style={{ flex: 1, backgroundColor: Colors.appBackground}} >
      <LandingHeader homeAddress={homeAddress} status={status} navigation={navigation}/>
      {showTrackComponent && (
        <TrackComponent onPress={() => navigation.navigate("TrackService" , {details: {...trackDetails, fromScreen: 'Home'}})}/>
      )}
      {!isConnectedToNet && (
        <View
          style={{
          position: 'absolute',
          bottom: 0,
          zIndex: 9999,
          marginTop: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 15,
          alignItems: 'center'
      }}>
          <View
              style={{
              width: '100%',
              marginTop: 5,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              backgroundColor: Colors.green2,
              padding: 8,
              marginBottom: 10,
              borderRadius: 20,
              borderColor: Colors.darkGray,
              elevation: 15,
              borderWidth: 1
          }}>
              <Title
                  label={'Detected slow network connectivity'}
                  size={15}
                  color={Colors.appBackground}/>
              <TouchableRipple
                  style={{
                  width: 60,
                  backgroundColor: '#d35500',
                  elevation: 5,
                  borderRadius: 15,
                  alignItems: 'center'
              }}
                  onPress={onPressRetry}
                  rippleColor="rgba(0, 0, 0, .32)">
                  <Title label={"Retry"} color='#fff' size={15}/>
              </TouchableRipple>
          </View>
      </View>
      )}
      <View style={{ paddingHorizontal: 10, marginTop: 65, marginBottom: showTrackComponent? 60:0, flex: 1}}>
        <View style={{}}>
          <ScrollView 
          
          refreshControl={<RefreshControl tintColor="#ff0000"
          title="Loading..."
          titleColor={Colors.primary}
          progressBackgroundColor={Colors.white} progressViewOffset={20} colors={[Colors.primary, Colors.secondary]} refreshing={refreshing} onRefresh={onRefresh} />}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}>
            {homeAddress.serviceAvailable?
              <View>
                {loadind ? 
                <HomeScreenLoader/>
                :
                <View style={{flex: 1, padding: 5}}>
                  <Swiper showsPagination={true} autoplayTimeout={5} autoplay={true} dotColor={Colors.darkOverlayColor} activeDotColor={Colors.white} activeDotStyle={{width: 40}} style={{height: 150}}>
                      {homePageCarouselServices.map((item, index) =>
                      <View key={index} style={{
                          borderRadius: 20,
                          height: 130,
                          marginHorizontal: 5,
                          elevation: 5
                        }}>
                        <LinearGradient
                          start={{
                          x: 0.0,
                          y: 0.25
                        }}
                            end={{
                            x: 0.5,
                            y: 1.0
                        }}
                        style={{
                          borderRadius: 20
                        }}
                        colors={[item.backgroundColor, Colors.darkGray]}>
                          <View style={{
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}  blurRadius={5}>
                              <View style={{width: '60%', alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{ fontFamily: 'Oswald-SemiBold', fontSize: 15, marginBottom: 12, color: Colors.appBackground}}>{item.title}</Text>
                                <Button labelStyle={{fontFamily: 'Oswald-Medium', fontSize: 12, color: Colors.white}} color={Colors.lightRed} onPress={() => navigation.navigate(item.navTo)} mode="contained">{item.buttonText}</Button>
                              </View>
                              <View style={{width: '40%', alignItems: 'flex-end'}}>
                                <Image style={{height: 130, aspectRatio: 1}} source={{uri: item.image}}/>
                              </View>
                          </View>
                        </LinearGradient>
                      </View>
                      )}   
                  </Swiper>
      
                  <SectionBanner 
                      title={i18n.homeScreenServiceBannerTitle} 
                      borderWidth={80} 
                      fontSize={16}
                      borderColor={Colors.white}
                      titleColor={Colors.white}/>
                    <View style={{marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', width: "100%"}}>
                      <RNMasonryScroll
                          columns={2}
                          oddColumnStyle={{marginTop: 30 }}
                          horizontal={false}
                          showsVerticalScrollIndicator={false}
                          keyExtractor={(item) => item.id}>
                          {mainServices.map((item, index) =>
                          <Animatable.View  delay={100 * index} animation={'fadeInUp'} key={index} style={{alignItems: 'center', justifyContent: 'space-evenly', margin: 5, elevation: 5}}>
                            <RNBounceable onPress={() => onPressNavToService(item)} style={{width: Dimensions.get('screen').width/2 - 25 }}>
                              <ImageBackground blurRadius={2} source={require('../assets/images/background4.png')} style={{ justifyContent: 'space-between', borderRadius: 15, backgroundColor: item.backgroundColor, height: 150,  padding: 10}}>
                                  <Title label={item.title} size={16} color={'#fff'}/> 
                                  <View style={{marginTop: 5}}>
                                    <Text style={{color: Colors.secondary, fontSize: 12, fontFamily: 'PTSerif-BoldItalic'}}>{item.desc}</Text>
                                  </View>
                                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, width: '100%', height: '100%'}}>
                                    <Icon style={{marginTop: 5}} name={'arrow-right'} color={'#fff'} size={14}/> 
                                    <Image style={{height: 70, width: 70, aspectRatio: 1}} source={{uri: item.image}}/>
                                  </View>
                              </ImageBackground>
                            </RNBounceable>
                          </Animatable.View>
                          )}
                      </RNMasonryScroll>
                  </View> 
                  <View style={{marginBottom: 5}}>
                    {quickService.map((item, index) => 
                    <View key={index} style={{marginTop: 10, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: Colors.appBackground, borderRadius: 10, elevation: 2}}>
                      <TouchableRipple key={index} style={{width: '100%'}} onPress={() => onPressNavToService(item)}>
                        <ImageBackground blurRadius={5} source={require('../assets/images/background3.png')} style={{ width: '100%', height: 80, padding: 10}}>
                          <View style={{flexDirection: 'row'}}>
                            <Image source={{uri: item.image}} style={{borderRadius: 15, borderColor: Colors.darkGray, borderWidth: 2,  width: 60, height: 60}}/>
                            <View style={{marginLeft: 10, width: '70%', alignItems: 'flex-start', justifyContent: 'space-evenly'}}>
                              <Text style={{fontFamily: 'Oswald-Medium', fontSize: 16, color: Colors.primary}}>{item.title}</Text>
                              <Text style={{fontFamily: 'PTSerif-BoldItalic', fontSize: 14, color: Colors.secondary}}>{item.desc}</Text>
                            </View>
                          </View>
                        </ImageBackground>
                      </TouchableRipple>
                    </View>
                    )}
                  </View> 
                  <LinearGradient
                      start={{
                      x: 0.0,
                      y: 0.25
                  }}
                      end={{
                      x: 0.5,
                      y: 1.0
                  }}
                  colors={[Colors.lightRed, Colors.gray]}
                  style={{marginTop: 15, elevation: 2,  height: 140, backgroundColor: Colors.gray, width: '100%', borderRadius: 20}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View style={{width: '60%', padding: 10}}>
                      <Text style={{marginTop: 5, fontFamily: 'Oswald-Bold', fontSize: 16, color: Colors.white}}>{"Order with pescriptions"}</Text>
                        <Text style={{marginTop: 5, fontFamily: 'PTSerif-BoldItalic', fontSize: 14, color: Colors.lightOverlayColor}}>{"Upload pescriptions and tell us what you need!"}</Text>
                        {/* <Text style={{marginTop: 5, fontFamily: 'PTSerif-Bold', fontSize: 12, color: Colors.lightOverlayColor}}>{"We will provide you at your dooestep..."}</Text> */}
                        <View style={{marginTop: 10, alignItems: 'center', justifyContent: 'center'}}>
                          {/* <Text style={{marginLeft: 10, fontFamily: 'Oswald-Bold', fontSize: 12, color: Colors.secondary}}>{"Get 20% off"}</Text> */}
                          <Button labelStyle={{fontFamily: 'Oswald-Medium', fontSize: 12, color: Colors.white}} color={Colors.lightRed} onPress={() => navigation.navigate("PescriptionDetails", {status: status})} mode="contained">{'Upload'}</Button>
                        </View>
                      </View>
                      <View style={{width: '40%', alignItems: 'flex-end', overflow: 'hidden', borderRadius: 20 }}>
                        <Image style={{ height: 140,  aspectRatio: 1}} source={require('../assets/images/petMedicines.png')}/>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
                } 
              </View>  
              :
              <View style={{ alignItems: 'center'}}>
                <Animatable.View animation={'fadeIn'} style={{flexDirection: 'row', alignItems: 'center'}}>
                  <LottieView style={{width: Dimensions.get("screen").height / 2.5, height: Dimensions.get("screen").height / 2.5}}  source={status === 'Success'? require('../assets/lottie/payment-successfull.json') : require('../assets/lottie/serviceUnavailable.json')} autoPlay={true} />
                </Animatable.View>
                <View style={{width: '90%', alignItems: 'center'}}>
                  <View style={{marginBottom: 10}}>
                    <Title label="Oh, snap," color={Colors.secondary} bold={true} size={25}/>
                  </View>  
                  <Title label="Service Unavialable at your region, we will try to provide here soon..." color={Colors.darkGray} bold={true} size={20}/>
                </View>
              </View>
            }
           
          </ScrollView>
        </View>
      </View>
    </View>
   );
 };
 
 const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: "20%"
  }
 });
 
 export default HomeScreen;
 