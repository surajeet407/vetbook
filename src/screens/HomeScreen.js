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
 import { useTheme } from '@react-navigation/native';
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

 
 const HomeScreen = ({navigation, route}) => {
  const [trackDetails, setTrackDetails] = useState(null)
  const [status, setStatus] = useState(route.params.status);
  const [showTrackComponent, setShowTrackComponent] = useState(false)
  const [homePageCarouselServices, setHomePageCarouselServices] = useState([]);
  const [mainServices, setMainServices] = useState([]);
  const [quickService, setQuickService] = useState([]);
  const [storeData, setStoreData] = useState({});
  const [loadind, setLoading] = useState(true);
  const { colors } = useTheme();
  const animation = useRef(new Animated.Value(0)).current;

  const opacity = animation.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  })

  const height = animation.interpolate({
      inputRange: [0, 100],
      outputRange: [120, 80],
      extrapolate: 'clamp'
  }) 

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
                            console.log(onGoingItems)
                            if (onGoingItems.length > 0) {
                              setShowTrackComponent(true);
                              setTrackDetails(onGoingItems[0]);
                            }
                          }
                      })
              }
          })

  } else {
      AsyncStorage
          .getItem("anonymusService")
          .then((data) => {
              if (data && JSON.parse(data).length > 0) {
                setShowTrackComponent(true)
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

  useEffect(() => {
    getData();
  }, [])
   return (
    <View  style={{ flex: 1, backgroundColor: Colors.appBackground}} >
      <LandingHeader status={status} navigation={navigation}/>
      {showTrackComponent && (
        <TrackComponent onPress={() => navigation.navigate("TrackOrder" , {details: trackDetails})}/>
      )}
      <View style={{ paddingHorizontal: 10, marginTop: 65, marginBottom: showTrackComponent? 60:0, flex: 1}}>
        <View style={{}}>
          <ScrollView scrollEventThrottle={16}
          onScroll={Animated.event([{nativeEvent: {contentOffset: {y: animation}}}], {useNativeDriver: false})}
          showsVerticalScrollIndicator={false}>
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
                    <Animatable.View  delay={100 * index} animation={'fadeInUp'} key={index} style={{alignItems: 'center', justifyContent: 'space-evenly', margin: 5}}>
                      <RNBounceable onPress={() => navigation.navigate(item.navTo, {item: item})} style={{width: Dimensions.get('screen').width/2 - 20, justifyContent: 'space-evenly', borderRadius: 15, backgroundColor: item.backgroundColor, elevation: 5, height: 180,  padding: 10}}>
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
                <TouchableRipple key={index} style={{width: '100%'}} onPress={() => navigation.navigate(item.navTo, {item: item})}>
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
 