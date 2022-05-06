import React, {useRef, useState, useEffect} from 'react';
 import {
   StyleSheet,
   Text,
   View,
   TouchableOpacity,
   FlatList,
   Animated,
   ImageBackground
 } from 'react-native';
 import Colors from '../util/Colors';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import { SwipeListView } from 'react-native-swipe-list-view';
import { RadioButton } from 'react-native-paper';
import Button from '../reusable_elements/Button';
import * as Animatable from 'react-native-animatable';
import database from '@react-native-firebase/database';
import Icon, { Icons } from '../util/Icons';
import i18n from '../util/i18n';
 
 const ManageAddressScreen = ({navigation, route}) => {
  const [addressess, setAddressess] = useState([]);
  const [checked, setChecked] = React.useState('');
  const [showSelection, setShowSelection] = useState(route.params.showSelection);
  const animation = useRef(new Animated.Value(0)).current;
  const opacity = animation.interpolate({
      inputRange: [0, 80],
      outputRange: [1, 0],
      extrapolate: 'clamp'
  })
  const height = animation.interpolate({
      inputRange: [0, 120],
      outputRange: [120, 100],
      extrapolate: 'clamp'
  }) 

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
  };
  const onPressAddressRadioButton = (id) => {
    setChecked(id);
  }
  const getData = () => {
    database()
    .ref('/appData/users/8900162177/addresses')
    .on('value', snapshot => {
      if(snapshot.val()) {
        setAddressess(snapshot.val())
      }
    })
    
  }
  useEffect(() => {
    getData();
  }, []);
   return (
    <View style={{ flex: 1, backgroundColor: Colors.appBackground}} >
        <GeneralHeader 
            showRigtIcon={!showSelection}
            rightIconType={Icons.MaterialIcons}
            rightIconName={'add'} 
            rightIconSize={40} 
            rightIconColor={Colors.appBackground}
            rightIconBackgroundColor={Colors.primary}
            onPressRight={() => navigation.goBack()} 

            showRightSideText={false}
            rightSideText={''} 
            rightSideTextSize={20} 
            rightSideTextColor={Colors.secondary}

            subHeaderText={showSelection? "Select an address to proceed...":"Swipe right to delete address..."}
            showSubHeaderText={true} 
            subHeaderTextSize={20} 
            subHeaderTextColor={Colors.secondary}

            position={'relative'} 
            headerHeight={120}

            headerText={showSelection? "Addresses":"My Addresses"} 
            headerTextSize={25} 
            headerTextColor={Colors.primary} 
            showHeaderText={true}

            showLeftIcon={true}
            leftIconType={Icons.MaterialIcons} 
            leftIconName={'navigate-before'} 
            leftIconSize={45} 
            leftIonColor={Colors.black}
            leftIconBackgroundColor={Colors.appBackground}
            onPressLeft={() => navigation.goBack()} 
        />
      <View style={{marginBottom: showSelection? 80:0, paddingHorizontal: 15, marginTop: 10, flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: Colors.appBackground,  width: '100%'}}>
          {addressess.length !== 0?
          <SwipeListView
            disableLeftSwipe={showSelection? true:false}
            disableRightSwipe= {true}
            onScroll={Animated.event([{nativeEvent: {contentOffset: {y: animation}}}], {useNativeDriver: false})}
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
            <Animatable.View delay={50 * rowMap} animation={'slideInRight'} style={[styles.item, {backgroundColor: checked === item.id ? '#91d3cb':Colors.appBackground}]}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontFamily: 'Oswald-SemiBold', fontSize: 20, color: checked === item.id? '#ff9d0a':Colors.darkGray}}>{item.title}</Text>
                    <Text style={{color: Colors.appBackground, marginLeft: 5, marginTop: 5, padding: 5, backgroundColor: Colors.primary, borderRadius: 10, fontFamily: 'Oswald-Medium', fontSize: 10}}>Home</Text>
                  </View>
                  <Text style={{fontFamily: 'PTSerif-Italic', fontSize: 18, color: checked === item.id? '#fff':'grey'}}>{item.desc}</Text>
                </View>
                {showSelection?
                <RadioButton onPress={() => onPressAddressRadioButton(item.id)} color={Colors.primary} status={ checked === item.id ? 'checked' : 'unchecked' }/>
                :
                null
                }
                </View>
            </Animatable.View>
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
      {showSelection?
      <Animatable.View delay={100} animation={'slideInUp'}>
        <ImageBackground blurRadius={0} source={require('../assets/images/background6.png')} style={{overflow: 'hidden', position: 'absolute', bottom: 0, width: '100%', alignItems: 'center', justifyContent: 'center', padding: 10, height: 80,  backgroundColor: Colors.secondary, borderTopLeftRadius: 50, elevation: 15, borderTopRightRadius: 50}}>
            <View style={{width: '90%'}}>
            <Button backgroundColor={Colors.primary} iconPostionRight={true} useIcon={true} title="Select" icon="long-arrow-right" onPress={() => navigation.navigate('Payment')}/>
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
    flex: 1,
    padding: 12,
    marginHorizontal: 10,
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
 