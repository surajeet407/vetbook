import React, {useRef, useState, useEffect} from 'react';
 import {
   StyleSheet,
   Text,
   View,
   TouchableOpacity,
   FlatList,
   Animated,
   ImageBackground,
   RefreshControl,
   Dimensions
 } from 'react-native';
 import Colors from '../util/Colors';
 import { useIsFocused } from '@react-navigation/native';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import { SwipeListView } from 'react-native-swipe-list-view';
import { RadioButton } from 'react-native-paper';
import Button from '../reusable_elements/Button';
import * as Animatable from 'react-native-animatable';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon, { Icons } from '../util/Icons';
import Toast from 'react-native-toast-message';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import i18n from '../util/i18n';
 
 const ManageAddressScreen = ({navigation, route}) => {
  // console.log(route.params.details)
  const isFocused = useIsFocused();
  const [status,
    setStatus] = useState(route.params.status);
  const [refreshing, setRefreshing] = useState(false);
  const [loadind, setLoading] = useState(true);
  const [addressess, setAddressess] = useState([]);
  const [checked, setChecked] = useState('');
  const [showSelection, setShowSelection] = useState(route.params.showSelection);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
        rowMap[rowKey].closeRow();
    }
  };
  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newAddressess = [...addressess];
    const prevIndex = addressess.findIndex(item => item.key === rowKey);
    newAddressess.splice(prevIndex, 1);
    setAddressess(newAddressess);
    if (status === 'loggedIn') {
      AsyncStorage
        .getItem('phoneNo')
        .then((phoneNo, msg) => {
          if (phoneNo) {
            if (newAddressess.length > 0) {
              // console.log(newAddressess)
              database()
              .ref('/users/' + phoneNo + "/addresses")
              .set(newAddressess)
            } else {
              database()
              .ref('/users/' + phoneNo + "/addresses")
              .set(null)
            }
            
          }
      })
    } else {
      if (newAddressess.length > 0) {
        AsyncStorage
        .setItem('anonymusAddresses', JSON.stringify(newAddressess))
      } else {
        AsyncStorage
        .setItem('anonymusAddresses', '[]')
      }
    }
  };

  const onPressAddressRadioButton = (id) => {
    setChecked(id);
  }

  const getData = () => {
    if(status === 'loggedIn') {
      AsyncStorage
        .getItem('phoneNo')
        .then((phoneNo, msg) => {
          setRefreshing(false)
          setLoading(false)
          if (phoneNo) {
            database()
            .ref('/users/' + phoneNo + "/addresses")
            .on("value", snapshot => {
              if(snapshot.val()) {
                setAddressess(snapshot.val())
              }
            })
          }
      })
    } else {
      AsyncStorage
        .getItem('anonymusAddresses')
        .then((data) => {
          setRefreshing(false)
          setLoading(false)
          if (data && JSON.parse(data).length > 0) {
            setAddressess(JSON.parse(data))
          }
      });
    }
    
  }
  const onSelectAddress = () => {
    if(checked === "") {
      Toast.show({
        type: 'customToast',
        text1: 'Please select one address to proceed...',
        position: 'bottom',
        visibilityTime: 1500,
        bottomOffset: 100,
        props: {
            backgroundColor: 'red'
        }
      });
    } else {
      if(status === 'loggedIn') {
        AsyncStorage
          .getItem('phoneNo')
          .then((phoneNo, msg) => {
            if (phoneNo) {
              database()
              .ref('/users/' + phoneNo + "/addresses")
              .once("value")
              .then(snapshot => {
                if(snapshot.val()) {
                  let path, ar = snapshot.val();
                  for (let i = 0; i < ar.length; i++) {
                    if(ar[i].id === checked) {
                        path = i
                    }                  }
                  database()
                  .ref('/users/' + phoneNo + "/addresses").set(ar)
                  navigation.navigate("Confirm", {details: {
                    ...route.params.details,
                    address: ar[path]
                  }})
                }
              })
            }
        })
      } else {
        AsyncStorage
          .getItem('anonymusAddresses')
          .then((data) => {
            if (data && JSON.parse(data).length > 0) {
              let path, ar = JSON.parse(data);
              for (let i = 0; i < ar.length; i++) {
                if(ar[i].id === checked) {
                    path = i
                }
              }
              AsyncStorage
                .setItem('anonymusAddresses', JSON.stringify(ar))
              navigation.navigate("Confirm", {details: {
                ...route.params.details,
                address: ar[path]
              }})
            }
        });
      }
    }
    
  }

  const onRefresh = () => {
    setRefreshing(true)
    getData()
  }

  useEffect(() => {
    if (isFocused) {
      getData();
    }
  }, [isFocused]);
  
   return (
    <View style={{ flex: 1, backgroundColor: Colors.appBackground}} >
        <GeneralHeader 
            showRigtIcon={true}
            rightIconType={Icons.MaterialIcons}
            rightIconName={'add'} 
            rightIconSize={35} 
            rightIconColor={Colors.appBackground}
            rightIconBackgroundColor={Colors.primary}
            onPressRight={() => navigation.navigate("Address")} 

            showRightSideText={false}
            rightSideText={''} 
            rightSideTextSize={20} 
            rightSideTextColor={Colors.secondary}

            subHeaderText={showSelection? "Select an address to proceed...":"Swipe right to delete address..."}
            showSubHeaderText={addressess.length === 0? false:true} 
            subHeaderTextSize={20} 
            subHeaderTextColor={Colors.secondary}

            position={'relative'} 
            headerHeight={addressess.length === 0? 80:120}

            headerText={showSelection? "Addresses":"My Addresses"} 
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
      <View style={{marginBottom: showSelection? 80:0, paddingHorizontal: 20, backgroundColor: Colors.appBackground, flex: 1}}>
        {loadind?
        <Animatable.View animation={'fadeIn'}>
          <SkeletonPlaceholder>
              {[1,2,3,4,5,6,7,8,9,0].map((item, index) => 
              <View key={index} style={{marginTop: 20, borderColor: Colors.darkGray, borderWidth: 1, padding: 15 }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View style={{ width: 100, height: 15, borderRadius: 4 }} />
                      <View style={{marginLeft: 20, width: 50, height: 15, borderRadius: 4 }} />
                  </View>
                  <View style={{marginTop: 10, width: Dimensions.get('screen').width - 80, height: 10, borderRadius: 4 }} />
                  <View style={{marginTop: 10, width: Dimensions.get('screen').width - 120, height: 10, borderRadius: 4 }} />
              </View>
              )}
          </SkeletonPlaceholder>
      </Animatable.View>
        :
        <View style={{marginTop: 10}}>
          {addressess.length !== 0?
          <SwipeListView
            refreshControl={<RefreshControl progressViewOffset={20} colors={[Colors.primary, Colors.secondary]} refreshing={refreshing} onRefresh={onRefresh} />}
            disableLeftSwipe={showSelection? true:false}
            disableRightSwipe= {true}
            width="100%"
            showsVerticalScrollIndicator={false}
            data={addressess}
            keyExtractor={item => item.id}
            leftOpenValue={65}
            rightOpenValue={-75}
            ItemSeparatorComponent={() => (
              <View style={{marginBottom: 5}}/>
            )}
            renderItem={ ({item, rowMap}) => (
            <View style={[styles.item, {backgroundColor: checked === item.id ? Colors.green2:Colors.appBackground}]}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontFamily: 'Oswald-SemiBold', fontSize: 20, color: checked === item.id? Colors.secondary:Colors.darkGray}}>{item.name}</Text>
                    <Text style={{color: Colors.appBackground, marginLeft: 5, marginTop: 5, paddingHorizontal: 5, backgroundColor: Colors.error_toast_color, fontFamily: 'Oswald-Medium', fontSize: 10}}>{item.tag}</Text>
                    {item.default && (
                      <Text style={{color: Colors.appBackground, marginLeft: 5, marginTop: 5, paddingHorizontal: 5, backgroundColor: Colors.green2, fontFamily: 'Oswald-Medium', fontSize: 10}}>Default</Text>
                    )}
                  </View>
                  <View style={{width: showSelection? '98%':'100%'}}>
                    <Text style={{fontFamily: 'PTSerif-Italic', fontSize: 15, color: checked === item.id? Colors.white:Colors.darkGray}}>{item.address + " " + item.pinCode}</Text>
                  </View>
                </View>
                {showSelection?
                <View style={{right: 15}}>
                  <RadioButton onPress={() => onPressAddressRadioButton(item.id)} color={Colors.primary} status={ checked === item.id ? 'checked' : 'unchecked' }/>
                </View>
                :
                null
                }
                </View>
            </View>
            )}
            renderHiddenItem={(data, rowMap) => (
              <View style={styles.rowBack}>
                <TouchableOpacity style={styles.backRightBtn} onPress={() => deleteRow(rowMap, data.item.key)} >
                  <Text style={styles.backTextWhite}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          /> 
          :
          <View style={{padding: 20}}>
            <Animatable.Text animation={'slideInUp'} style={{fontFamily: 'Redressed-Regular', fontSize: 25, color: checked === '#ff9d0a'}}>There is no saved address, click on add icon to add...</Animatable.Text>
          </View>
          }
        </View>
        }
      </View>
      {showSelection?
      <Animatable.View delay={100} animation={'slideInUp'}>
        <ImageBackground blurRadius={0} source={require('../assets/images/background6.png')} style={{overflow: 'hidden', position: 'absolute', bottom: 0, width: '100%', alignItems: 'center', justifyContent: 'center', padding: 10, height: 80,  backgroundColor: Colors.secondary, borderTopLeftRadius: 50, elevation: 15, borderTopRightRadius: 50}}>
            <View style={{width: '90%'}}>
            <Button backgroundColor={Colors.primary} iconPostionRight={true} useIcon={true} title="Select" icon="long-arrow-right" onPress={onSelectAddress}/>
            </View>
        </ImageBackground>
      </Animatable.View>
      :
      null
      }
    </View>
   );
 };
 
 const styles = StyleSheet.create({
  optionsMenu: {
    backgroundColor: 'red'
  },
  item: {
    padding: 12,
    marginHorizontal: 2,
    marginVertical: 4,
    borderRadius: 10,
    elevation: 4
  },
  title: {
    fontSize: 20,
  },
  backTextWhite: {
    color: Colors.appBackground,
  },
  rowBack: {
      flex: 1,
  },
  backRightBtn: {
      alignItems: 'center',
      bottom: 5,
      justifyContent: 'center',
      position: 'absolute',
      top: 5,
      width: 75,
      backgroundColor: 'red',
      right: 10,
      borderRadius: 10
  },
 });
 
 export default ManageAddressScreen;
 