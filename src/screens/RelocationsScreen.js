import React, {useRef, useState, useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    Animated,
    Dimensions,
    Linking,
    RefreshControl
} from 'react-native';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import ServiceScreenLoader from '../reusable_elements/ServiceScreenLoader';
import Colors from '../util/Colors';
import {SwipeListView} from 'react-native-swipe-list-view';
import Title from '../reusable_elements/Title';
import database from '@react-native-firebase/database';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Icon, {Icons} from '../util/Icons';
import {Rating} from 'react-native-ratings';
import {Button, Chip} from 'react-native-paper'
import i18n from '../util/i18n';
import {Picker} from '@react-native-picker/picker';
import SegmentedControlTab from 'react-native-segmented-control-tab'
import RBSheet from "react-native-raw-bottom-sheet";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const width = Dimensions
    .get('screen')
    .width - 50;

const RelocationsScreen = ({navigation, route}) => {
    const filters = [{
        key: "ongoing",
        text: "Ongoing"
    },{
        key: "cancelled",
        text: "Cancelled"
    },{
        key: "completed",
        text: "Completed"
    }]

    const refRBSheet = useRef(null)
    const [refreshing, setRefreshing] = useState(false);
    const [loading,
        setLoading] = useState(true)
    const [itemId, 
        setItemId] = useState("");
    const [pickerValue, 
        setPickerValue] = useState("");
    const [phoneNo,
        setPhoneNo] = useState("");
    const [catIndex,
        setCatIndex] = useState(0);
    const [status,
        setStatus] = useState(route.params.status);
    const [pastRelocations,
        setPastRelocations] = useState([])
    const reOrder = () => {}


    const getDataFromStorage = (filter) => {
        AsyncStorage
            .getItem("anonymusRelocation")
            .then((data) => {
                setLoading(false)
                setRefreshing(false)
                if (data && JSON.parse(data).length > 0) {
                    let allItem = JSON.parse(data);
                    let items = allItem.filter(item => item.mode === filter)
                    let pickerValArray = [],
                        obj = {
                            value: "Select reason for cancellation"
                        }
                    for(let i = 0; i < items.length; i++){
                        pickerValArray.push(obj)
                    }
                    setPickerValue(pickerValArray)
                    setPastRelocations(items);
                }
            });
    }
    const getDataFromDatabase = (phoneNo, filter) => {
        database()
            .ref("/users/" + phoneNo + "/relocations")
            .once('value')
            .then(snapshot => {
                setLoading(false)
                setRefreshing(false)
                if (snapshot.val()) {
                    let items = snapshot.val().filter(item => item.mode === filter)
                    let pickerValArray = [],
                        obj = {
                            value: "Select reason for cancellation"
                        }
                    for(let i = 0; i < items.length; i++){
                        pickerValArray.push(obj)
                    }
                    setPickerValue(pickerValArray)
                    setPastRelocations(items);
                }
            })
    }

    const onPressSubmit = () => {
        if(pickerValue === "") {
            Toast.show({
                type: 'customToast',
                text1: "Select reason for cancellation...",
                position: 'bottom',
                visibilityTime: 1500,
                bottomOffset: 200,
                props: {
                    backgroundColor: Colors.error_toast_color
                }
            });
        } else {
            refRBSheet.current.close()
            if (status === 'loggedIn') { 
                database()
                    .ref("/users/" + phoneNo + "/relocations")
                    .once('value')
                    .then(snapshot => {
                        let path;
                        snapshot
                            .val()
                            .forEach((dbItem, index) => {
                                if (dbItem.id === itemId) {
                                    path = index
                                }
    
                            })
                        database()
                            .ref("/users/" + phoneNo + "/relocations/" + path)
                            .update({mode: 'cancelled', reasonForCancellation: pickerValue}).then(() => {
                                getDataFromDatabase(phoneNo, filters[catIndex].key)
                                Toast.show({
                                    type: 'customToast',
                                    text1: "Relocation request has been cancelled...",
                                    position: 'bottom',
                                    visibilityTime: 1500,
                                    bottomOffset: 80,
                                    props: {
                                        backgroundColor: Colors.error_toast_color
                                    }
                                });
                            })
                    })        
            } else {
                AsyncStorage
                    .getItem("anonymusRelocation")
                    .then((data) => {
                        if (data && JSON.parse(data).length > 0) {
                            let path,
                            mainData = JSON.parse(data);
                            mainData.forEach((dbItem, index) => {
                                if (dbItem.id === itemId) {
                                    path = index
                                }
                            })
                            mainData[path].mode = 'cancelled'
                            mainData[path].reasonForCancellation = pickerValue
                            AsyncStorage.setItem("anonymusRelocation", JSON.stringify(mainData)).then(() => {
                                getDataFromStorage(filters[catIndex].key)
                                Toast.show({
                                    type: 'customToast',
                                    text1: "Relocation request has been cancelled...",
                                    position: 'bottom',
                                    visibilityTime: 1500,
                                    bottomOffset: 80,
                                    props: {
                                        backgroundColor: Colors.error_toast_color
                                    }
                                });
                            })
                            
                        }
                    });
            }
        }
        
    }

    const onPressCancel = (id) => {
        refRBSheet.current.open()
        setItemId(id)
    }

    const handleCustomIndexSelect = (index) => {
        setCatIndex(index)
        setPickerValue("")
        if (status === 'loggedIn') {
            getDataFromDatabase(phoneNo, filters[index].key);
        } else {
            getDataFromStorage(filters[index].key)
        }
    }

    const onRefresh = () => {
        setRefreshing(true)
        if (status === 'loggedIn') {
            getDataFromDatabase(phoneNo, filters[catIndex].key);
        } else {
            getDataFromStorage(filters[catIndex].key)
        }
    }

    useEffect(() => {
        if (status === 'loggedIn') {
            AsyncStorage
            .getItem('phoneNo')
            .then((phoneNo, msg) => {
                setPhoneNo(phoneNo)
                getDataFromDatabase(phoneNo, "ongoing");
            })
        } else {
            getDataFromStorage("ongoing")
        }
    }, []);
    return (
        <View
            style={{
            flex: 1,
            backgroundColor: Colors.appBackground
        }}>
            <GeneralHeader
                showRigtIcon={false}
                rightIconType={Icons.MaterialIcons}
                rightIconName={'navigate-before'}
                rightIconSize={45}
                rightIconColor={Colors.black}
                rightIconBackgroundColor={Colors.appBackground}
                onPressRight={() => navigation.goBack()}
                showRightSideText={false}
                rightSideText={''}
                rightSideTextSize={20}
                rightSideTextColor={Colors.secondary}
                subHeaderText="See all your booked relocations..."
                showSubHeaderText={false}
                subHeaderTextSize={20}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={100}
                headerText={'Relocations'}
                headerTextSize={25}
                headerTextColor={Colors.primary}
                showHeaderText={true}
                showLeftIcon={true}
                leftIconType={Icons.MaterialIcons}
                leftIconName={'navigate-before'}
                leftIconSize={45}
                leftIonColor={Colors.black}
                leftIconBackgroundColor={Colors.appBackground}
                onPressLeft={() => navigation.navigate("HomeBottomTabBar", {screen: "Settings", status: status})}/>
                <View
                    style={{
                    paddingHorizontal: 20,
                    alignItems: 'center',
                    width: '100%'
                    }}>
                <SegmentedControlTab
                    values={["Ongoing", "Cancelled", "Completed"]}
                    borderRadius={0}
                    tabsContainerStyle={{ height: 50, backgroundColor: Colors.white }}
                    tabStyle={{ backgroundColor: Colors.darkGray, borderColor: Colors.white, borderWidth: 1 }}
                    activeTabStyle={{ backgroundColor: Colors.green }}
                    tabTextStyle={{ color: '#444444', fontFamily: 'Oswald-Medium' }}
                    activeTabTextStyle={{ color: Colors.white }}
                    selectedIndex={catIndex}
                    onTabPress={handleCustomIndexSelect}
                    />
            </View>
            {loading?
            <View style={{paddingHorizontal: 20}}>
                <ServiceScreenLoader/>
            </View>
            :
            <FlatList
                refreshControl={<RefreshControl progressViewOffset={20} colors={[Colors.primary, Colors.secondary]} refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <View style={{alignItems: 'center', marginTop: 20}}>
                        <Title label="No relocation requests are found..." size={20} color={Colors.darkGray}/>
                    </View>
                }
                showsVerticalScrollIndicator={false}
                data={pastRelocations}
                keyExtractor={item => item.id}
                renderItem={({item, rowMap}) => {
                return (
                    <Animatable.View
                        delay={50 * rowMap}
                        animation={'slideInLeft'}
                        style={{
                        backgroundColor: Colors.appBackground,
                        marginHorizontal: 20,
                        marginVertical: 10,
                        padding: 10,
                        elevation: 5
                    }}>
                        <View
                            style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Title
                                size={20}
                                label={'Relocation Details : '}
                                bold={true}
                                color={Colors.darkGray}/>
                        </View>
                        <Title size={15} label={"Transaction Id: " + item.txnId} bold={true} color={Colors.darkGray}/>
                        <View
                            style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <Title size={15} label={"Booked On:"} bold={true} color={Colors.gray}/>
                            <View
                                style={{
                                marginLeft: 5
                            }}>
                                <Title
                                    size={15}
                                    label={item.selectedDate}
                                    bold={true}
                                    color={Colors.secondary}/>
                            </View>
                        </View>
                        <View
                            style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <Title size={15} label={"Status:"} bold={true} color={Colors.gray}/>
                            <View
                                style={{
                                marginLeft: 5
                            }}>
                                {item.mode === 'inprocess' && (<Title size={15} label={'In Process'} bold={true} color={Colors.yellow}/>)}
                                {item.mode === 'completed' && (<Title size={15} label={'Completed'} bold={true} color={Colors.green2}/>)}
                                {item.mode === 'cancelled' && (<Title
                                    size={15}
                                    label={'Cancelled'}
                                    bold={true}
                                    color={Colors.error_toast_color}/>)}
                            </View>
                        </View>
                        {item.mode === 'cancelled' && (
                            <Text style={{color: Colors.darkGray, fontSize: 15, fontFamily: 'Oswald-Medium'}}>{"Reason for cancellation: " + item.reasonForCancellation}</Text>
                        )}
                        <View
                            style={{
                            marginTop: 5,
                            marginBottom: 10
                        }}>
                            <View
                                style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <View>
                                    <View
                                        style={{
                                        borderBottomWidth: 1,
                                        width: 120
                                    }}>
                                        <Title
                                            size={18}
                                            label={'Current Location'}
                                            bold={true}
                                            color={Colors.darkGray}/>
                                    </View>
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 5
                                    }}>
                                        <Title size={15} label={"Address1:"} bold={true} color={Colors.darkGray}/>
                                        <View
                                            style={{
                                            marginLeft: 5
                                        }}>
                                            <Title
                                                size={15}
                                                label={'106'}
                                                bold={true}
                                                color={item.mode === 'inprocess'
                                                ? Colors.secondary
                                                : Colors.green2}/>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Title size={15} label={"Address2:"} bold={true} color={Colors.darkGray}/>
                                        <View
                                            style={{
                                            marginLeft: 5
                                        }}>
                                            <Title
                                                size={15}
                                                label={'RDU'}
                                                bold={true}
                                                color={item.mode === 'inprocess'
                                                ? Colors.secondary
                                                : Colors.green2}/>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Title size={15} label={"City:"} bold={true} color={Colors.darkGray}/>
                                        <View
                                            style={{
                                            marginLeft: 5
                                        }}>
                                            <Title
                                                size={15}
                                                label={'Midnapore'}
                                                bold={true}
                                                color={item.mode === 'inprocess'
                                                ? Colors.secondary
                                                : Colors.green2}/>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Title size={15} label={"State:"} bold={true} color={Colors.darkGray}/>
                                        <View
                                            style={{
                                            marginLeft: 5
                                        }}>
                                            <Title
                                                size={15}
                                                label={'WB'}
                                                bold={true}
                                                color={item.mode === 'inprocess'
                                                ? Colors.secondary
                                                : Colors.green2}/>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Title size={15} label={"Zip:"} bold={true} color={Colors.darkGray}/>
                                        <View
                                            style={{
                                            marginLeft: 5
                                        }}>
                                            <Title
                                                size={15}
                                                label={'721160'}
                                                bold={true}
                                                color={item.mode === 'inprocess'
                                                ? Colors.secondary
                                                : Colors.green2}/>
                                        </View>
                                    </View>
                                </View>
                                <View>
                                    <Icon
                                        type={Icons.Entypo}
                                        name={'arrow-with-circle-right'}
                                        color={Colors.primary}
                                        size={35}/>
                                </View>
                                <View>
                                    <View
                                        style={{
                                        borderBottomWidth: 1,
                                        width: 100
                                    }}>
                                        <Title size={18} label={'Drop Location'} bold={true} color={Colors.darkGray}/>
                                    </View>
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 5
                                    }}>
                                        <Title size={15} label={"Address1:"} bold={true} color={Colors.darkGray}/>
                                        <View
                                            style={{
                                            marginLeft: 5
                                        }}>
                                            <Title
                                                size={15}
                                                label={item.dropLocation.address1}
                                                bold={true}
                                                color={item.mode === 'inprocess'
                                                ? Colors.secondary
                                                : Colors.green2}/>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Title size={15} label={"Address2:"} bold={true} color={Colors.darkGray}/>
                                        <View
                                            style={{
                                            marginLeft: 5
                                        }}>
                                            <Title
                                                size={15}
                                                label={item.dropLocation.address2}
                                                bold={true}
                                                color={item.mode === 'inprocess'
                                                ? Colors.secondary
                                                : Colors.green2}/>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Title size={15} label={"City:"} bold={true} color={Colors.darkGray}/>
                                        <View
                                            style={{
                                            marginLeft: 5
                                        }}>
                                            <Title
                                                size={15}
                                                label={item.dropLocation.city}
                                                bold={true}
                                                color={item.mode === 'inprocess'
                                                ? Colors.secondary
                                                : Colors.green2}/>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Title size={15} label={"State:"} bold={true} color={Colors.darkGray}/>
                                        <View
                                            style={{
                                            marginLeft: 5
                                        }}>
                                            <Title
                                                size={15}
                                                label={item.dropLocation.state}
                                                bold={true}
                                                color={item.mode === 'inprocess'
                                                ? Colors.secondary
                                                : Colors.green2}/>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Title size={15} label={"Zip:"} bold={true} color={Colors.darkGray}/>
                                        <View
                                            style={{
                                            marginLeft: 5
                                        }}>
                                            <Title
                                                size={15}
                                                label={item.dropLocation.zip}
                                                bold={true}
                                                color={item.mode === 'inprocess'
                                                ? Colors.secondary
                                                : Colors.green2}/>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {item.mode !== 'cancelled' && (
                            <View
                                style={{
                                borderTopColor: Colors.darkGray,
                                borderTopWidth: 1,
                                padding: 5
                            }}>
                                {item.mode === 'inprocess' && (
                                    <View>
                                        <View
                                            style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginTop: 5
                                        }}>
                                            <TouchableOpacity
                                                onPress={() => navigation.navigate("TrackOrder", {details: {...item, fromScreen: 'Services'}})}
                                                style={{
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }}>
                                                <Title size={18} label={'Track'} bold={true} color={Colors.secondary}/>
                                                <Icon
                                                    type={Icons.AntDesign}
                                                    style={{
                                                    marginTop: 5,
                                                    marginLeft: 5
                                                }}
                                                    name={'arrowright'}
                                                    size={20}
                                                    color={Colors.secondary}/>
                                            </TouchableOpacity>
                                            <Button
                                                labelStyle={{
                                                color: Colors.white,
                                                fontFamily: 'PTSerif-Bold'
                                            }}
                                                color={Colors.error_toast_color}
                                                mode="contained"
                                                onPress={() => onPressCancel(item.id)}>Cancel</Button>
                                        </View>
                                    </View>
                                )}
                                {item.mode === 'completed' && (
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <View
                                            style={{
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}>
                                            <Title
                                                size={18}
                                                label={'Rate Our Service'}
                                                bold={true}
                                                color={Colors.secondary}/>
                                            <Icon
                                                type={Icons.AntDesign}
                                                style={{
                                                marginTop: 5,
                                                marginLeft: 5
                                            }}
                                                name={'arrowright'}
                                                size={20}
                                                color={Colors.secondary}/>
                                        </View>
                                        <Rating
                                            type='custom'
                                            ratingColor='#3498db'
                                            ratingBackgroundColor='#c8c7c8'
                                            ratingCount={5}
                                            imageSize={20}
                                            minValue={0}
                                            startingValue={0}
                                            jumpValue={1}
                                            showRating={false}/>
                                    </View>
                                )}
                            </View>
                        )}
                    </Animatable.View>
                )
            }}/>
            }
            <RBSheet
                height={180}
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                container: {
                    backgroundColor: Colors.white,
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50,
                    elevation: 10,
                    overflow: 'hidden',
                    paddingHorizontal: 20
                },
                wrapper: {
                    backgroundColor: "transparent",
                },
                draggableIcon: {
                    backgroundColor: Colors.secondary
                }
                }}
                >
                <View style={{marginTop: 20}}>
                    <View
                        style={{
                        borderWidth: 1,
                        borderColor: Colors.darkGray
                    }}>
                        <Picker
                            placeholder='Select reason for cancellation'
                            dropdownIconColor={Colors.darkGray}
                            mode="dropdown"
                            selectedValue={pickerValue}
                            onValueChange={(itemValue) => { 
                            setPickerValue(itemValue)
                        }}>
                            <Picker.Item  style={{
                                color: Colors.darkGray,
                                fontFamily: 'Oswald-Medium'
                            }} label="Select reason for cancellation" value="" />
                            <Picker.Item  style={{
                                color: Colors.darkGray,
                                fontFamily: 'Oswald-Medium'
                            }} label="I have changed my mind" value="I have changed my mind" />
                            <Picker.Item style={{
                                color: Colors.darkGray,
                                fontFamily: 'Oswald-Medium'
                            }} label="Solved by local partner" value="Solved by local partner" />
                            <Picker.Item style={{
                                color: Colors.darkGray,
                                fontFamily: 'Oswald-Medium'
                            }} label="Somewhat not satisfied with the privious service" value="Somewhat not satisfied with the privious service" />
                            <Picker.Item style={{
                                color: Colors.darkGray,
                                fontFamily: 'Oswald-Medium'
                            }} label="On my own" value="On my own" />
                            <Picker.Item style={{
                                color: Colors.darkGray,
                                fontFamily: 'Oswald-Medium'
                            }} label="Don't want to share" value="Don't want to share" />
                        </Picker>
                    </View>  
                    <View style={{alignItems: 'center', margin: 20}}>
                        <View style={{width: '50%'}}>
                            <Button
                                labelStyle={{
                                color: Colors.white,
                                fontFamily: 'PTSerif-Bold'
                                }}
                                color={Colors.error_toast_color}
                                mode="contained"
                                onPress={onPressSubmit}>Submit</Button>   
                        </View>
                    </View>
                </View>
            </RBSheet>
        </View>
    );
};

const styles = StyleSheet.create({
    backTextWhite: {
        color: Colors.appBackground
    },
    rowBack: {
        flex: 1
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 5,
        justifyContent: 'center',
        position: 'absolute',
        top: 5,
        width: 75,
        backgroundColor: 'green',
        right: 10,
        borderRadius: 15,
        overflow: 'hidden'
    }
});

export default RelocationsScreen;
