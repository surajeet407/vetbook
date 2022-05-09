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
 } from 'react-native';
 import { useTheme, useIsFocused } from '@react-navigation/native';
 import Toast from 'react-native-toast-message';
 import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from '../util/Colors';
 import Icon from 'react-native-vector-icons/FontAwesome';
 import { Button } from 'react-native-paper';
import Title from '../reusable_elements/Title';
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
import i18n from '../util/i18n';
import LottieView from 'lottie-react-native';

 
 const HomeScreen = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const [homeAddress, setHomeAddress] = useState("")
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
                          if (snapshot.val()) {
                            let onGoingItems = snapshot.val().filter(item => item.mode === 'ongoing')
                            // console.log(onGoingItems)r
                            if (onGoingItems.length > 0) {
                              setShowTrackComponent(true);
                              setTrackDetails(onGoingItems[0]);
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
                          }
                      })
              }
          })

  } else {
      // AsyncStorage
      //   .setItem("anonymusService", "[]")
      AsyncStorage
          .getItem("anonymusService")
          .then((data) => {
              if (data && JSON.parse(data).length > 0) {
                let mainData = JSON.parse(data)
                let onGoingItems = mainData.filter(item => item.mode === 'ongoing')
                if (onGoingItems.length > 0) {
                  setShowTrackComponent(true);
                  setTrackDetails(onGoingItems[0]);
                } else {
                  setShowTrackComponent(false);
                }
                debugger
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
      console.log(groomingServiceCount)
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
  useEffect(() => {
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
        <TrackComponent onPress={() => navigation.navigate("TrackOrder" , {details: {...trackDetails, fromScreen: 'Home'}})}/>
      )}
      <View style={{ paddingHorizontal: 10, marginTop: 65, marginBottom: showTrackComponent? 60:0, flex: 1}}>
        <View style={{}}>
          <ScrollView scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}>
            {homeAddress.serviceAvailable?
              <View>
                {loadind ? 
                <Animatable.View animation={'fadeIn'} >
                  <SkeletonPlaceholder style={{padding: 20}}>
                      <View style={{  height: 120, borderRadius: 30 }} />
                      <View style={{marginTop: 20, width: '100%', height: 50, borderRadius: 10 }}/>
                      <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ width: Dimensions.get('screen').width / 2 - 15, height: 160, borderRadius: 20 }} />
                        <View style={{marginLeft: 5, width: Dimensions.get('screen').width / 2 - 15, height: 160, borderRadius: 20 }} />
                      </View>
                      <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ width: Dimensions.get('screen').width / 2 - 15, height: 160, borderRadius: 20 }} />
                        <View style={{marginLeft: 5, width: Dimensions.get('screen').width / 2 - 15, height: 160, borderRadius: 20 }} />
                      </View>
                      <View style={{marginTop: 20, width: '100%', height: 100, borderRadius: 10 }}/>
                      <View style={{marginTop: 10, width: '100%', height: 100, borderRadius: 10 }}/>
                  </SkeletonPlaceholder>
                </Animatable.View>
                :
                <View style={{flex: 1}}>
                  <Swiper showsPagination={true} autoplayTimeout={5} autoplay={true} dotColor={Colors.darkGray} activeDotColor={Colors.primary} activeDotStyle={{paddingHorizontal: 10}} style={{height: 165}}>
                      {homePageCarouselServices.map((item, index) =>
                      <ImageBackground key={index} source={{uri: item.image}} style={styles.itemContainer}  blurRadius={5}>
                          <Text style={{fontFamily: 'Oswald-SemiBold', fontSize: 20, marginBottom: 10, color: Colors.appBackground}}>{item.title}</Text>
                          <Button labelStyle={{fontFamily: 'PTSerif-Regular', fontSize: 15, color: Colors.appBackground}} color={Colors.secondary} onPress={() => navigation.navigate(item.navTo)} mode="contained">{item.buttonText}</Button>
                      </ImageBackground>
                      )}   
                  </Swiper>
      
                  <SectionBanner fontSize={20} title={i18n.homeScreenServiceBannerTitle} borderColor={Colors.primary} borderWidth={100} titleColor={Colors.mediumDark}/>
                  <View style={{marginTop: 20, flexDirection: 'row', flexWrap: 'wrap', width: "100%"}}>
                      <RNMasonryScroll
                          columns={2}
                          oddColumnStyle={{marginTop: 30 }}
                          horizontal={false}
                          showsVerticalScrollIndicator={false}
                          keyExtractor={(item) => item.id}>
                          {mainServices.map((item, index) =>
                          <Animatable.View  delay={100 * index} animation={'fadeInUp'} key={index} style={{alignItems: 'center', justifyContent: 'space-evenly', margin: 5, elevation: 5}}>
                            <RNBounceable onPress={() => onPressNavToService(item)} style={{width: Dimensions.get('screen').width/2 - 20, justifyContent: 'space-evenly', borderRadius: 15, backgroundColor: item.backgroundColor, height: 180,  padding: 10}}>
                              <ImageBackground blurRadius={2} source={require('../assets/images/background4.png')} style={{ width: '100%', height: '100%'}}>
                                  <Title label={item.title} size={18} color={'#fff'}/> 
                                  <Text style={{color: Colors.gray, fontSize: 15, fontFamily: 'Oswald-Medium'}}>Lorem ipsum dolor sit amet...</Text>
                                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, width: '100%', height: '100%'}}>
                                    <Icon name={'arrow-right'} color={'#fff'} size={15}/> 
                                    <Image style={{height: '40%', width: '60%'}} source={{uri: item.image}}/>
                                  </View>
                              </ImageBackground>
                            </RNBounceable>
                          </Animatable.View>
                          )}
                      </RNMasonryScroll>
                  </View> 
                  <View style={{paddingHorizontal: 5}}>
                    {quickService.map((item, index) => 
                    <View key={index} style={{marginTop: 20, marginBottom: 5, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: Colors.appBackground, borderRadius: 10, elevation: 2}}>
                      <TouchableRipple key={index} style={{width: '100%'}} onPress={() => onPressNavToService(item)}>
                        <ImageBackground blurRadius={5} source={require('../assets/images/background3.png')} style={{ width: '100%', height: 100, padding: 10}}>
                          <View style={{flexDirection: 'row'}}>
                            <Image source={{uri: item.image}} style={{borderRadius: 15, borderColor: Colors.darkGray, borderWidth: 2,  width: 80, height: 80}}/>
                            <View style={{marginLeft: 10, width: '70%', alignItems: 'flex-start', justifyContent: 'space-between'}}>
                              <Text style={{fontFamily: 'Oswald-Medium', fontSize: 20, color: Colors.primary}}>{item.title}</Text>
                              <Text style={{fontFamily: 'PTSerif-Bold', fontSize: 15, color: Colors.darkGray}}>{item.desc}</Text>
                            </View>
                          </View>
                        </ImageBackground>
                      </TouchableRipple>
                    </View>
                    )}
                  </View> 
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
  itemContainer: {
    height: 120,
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: 'grey',
    overflow: 'hidden',
    borderRadius: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: "20%"
  }
 });
 
 export default HomeScreen;
 