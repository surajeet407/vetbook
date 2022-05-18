import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    ScrollView,
    Animated,
    FlatList,
    TouchableOpacity,
    Text,
    Image,
    Dimensions,
    RefreshControl
} from 'react-native';
import {useIsFocused} from "@react-navigation/native";
import {Badge} from 'react-native-paper';
import Colors from '../util/Colors';
import {Searchbar} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import RNMasonryScroll from "react-native-masonry-scrollview";
import database from '@react-native-firebase/database';
import StoreItems from '../reusable_elements/StoreItems'
import HorizontalCategoryList from '../reusable_elements/HorizontalCategoryList'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import LandingHeader from '../reusable_elements/LandingHeader';
import RNBounceable from "@freakycoder/react-native-bounceable";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Title from '../reusable_elements/Title';
import Icon, {Icons} from '../util/Icons';
import * as Animatable from 'react-native-animatable';
import RBSheet from "react-native-raw-bottom-sheet";
import Button from '../reusable_elements/Button';
import RNFetchBlob from 'rn-fetch-blob';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker'
import axios from 'axios';
import uuid from 'react-native-uuid';
import i18n from '../util/i18n';

const PetStoreScreen = ({navigation, route}) => {
    const refRBSheet = useRef(null)
    const isFocused = useIsFocused();
    const [refreshing, setRefreshing] = useState(false);
    const [loadind, setLoading] = useState(true);
    const [singleFile, setSingleFile] = useState(null);
    const [homeAddress,
        setHomeAddress] = useState("")
    const [status,
        setStatus] = useState(route.params.status);
    const [cartItemCount,
        setCartItemCount] = useState('0');
    const [petStoreCategories,
        setPetStoreCategories] = useState([]);
    const [petStoreItems,
        setPetStoreItems] = React.useState([]);
    const [searchQuery,
        setSearchQuery] = React.useState('');
    const categoryCarousel = useRef(null);
    const [selectedCategoryIndex,
        setSelectedCategoryIndex] = useState(0);

    const onPressCaraousel = (orgs) => {
        setSelectedCategoryIndex(orgs.index);
        categoryCarousel
            .current
            .scrollToIndex(orgs, {
                animated: true,
                viewPosition: 0.5
            })
        let path = ""
        if (petStoreCategories[orgs.index].name === 'Medicine') {
            path = "/petMedicineItems"
        } else if (petStoreCategories[orgs.index].name === 'Food') {
            path = "/petFoodItems"
        } else if (petStoreCategories[orgs.index].name === 'Toys') {
            path = "/petToysItems"
        } else if (petStoreCategories[orgs.index].name === 'Accesorries') {
            path = "/petAccItems"
        } else {
            path = "/petFurItems"
        }
        database()
            .ref(path)
            .on('value', snapshot => {
                if (snapshot.val()) {
                    setPetStoreItems(snapshot.val())
                } else {
                    setPetStoreItems([])
                }
            })
    }
    const onChangeSearch = query => {
        setSearchQuery(query)
        let path = ""
        if (petStoreCategories[selectedCategoryIndex].name === 'Medicine') {
            path = "/petMedicineItems"
        } else if (petStoreCategories[selectedCategoryIndex].name === 'Food') {
            path = "/petFoodItems"
        } else if (petStoreCategories[selectedCategoryIndex].name === 'Toys') {
            path = "/petToysItems"
        } else if (petStoreCategories[selectedCategoryIndex].name === 'Accesorries') {
            path = "/petAccItems"
        } else {
            path = "/petFurItems"
        }
        if (query.length > 0) {
            database()
                .ref(path)
                .on('value', snapshot => {
                    if (snapshot.val()) {
                        setPetStoreItems(snapshot.val().filter(item => item.name.toLowerCase().includes(query.toLowerCase())))
                    }
                })
        } else {
            database()
                .ref(path)
                .on('value', snapshot => {
                    if (snapshot.val()) {
                        setPetStoreItems(snapshot.val())
                    }
                })
        }
    };
    const onPressAddToCart = () => {
        Toast.show({type: 'customToast', text1: 'Item added to your cart', position: 'bottom', visibilityTime: 1000});
    }
    const onPressRightIcon = () => {
        navigation.navigate("Cart", {status: status});
    }
    const getData = (path) => {
        database()
            .ref('/petStoreCategories')
            .on('value', snapshot => {
                if (snapshot.val()) {
                    setPetStoreCategories(snapshot.val())

                }
            })
        database()
            .ref(path)
            .on('value', snapshot => {
                if (snapshot.val()) {
                    setLoading(false);
                    setPetStoreItems(snapshot.val())
                }
            })

    }

    const getCartItems = () => {
        if (status === 'loggedOut') {
            AsyncStorage
                .getItem('cartItems')
                .then((data, msg) => {
                    if (data) {
                        setCartItemCount(JSON.parse(data).length)
                    } else {
                        setCartItemCount(0)
                    }
                })
        } else {
            AsyncStorage
                .getItem('phoneNo')
                .then((data, msg) => {
                    if (data) {
                        database()
                            .ref('/users/' + data + "/cartItems")
                            .on('value', snapshot => {
                                if (snapshot.val()) {
                                    setCartItemCount(snapshot.val().length)
                                } else {
                                    setCartItemCount("0")
                                }
                            })
                    }
                })
        }

    }
    const onPressFileUploadButton = () => {
        navigation.navigate("PescriptionDetails", {status: status})
    }
    const onPressUpload = () => {
        DocumentPicker.pickSingle({
            type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
            presentationStyle: 'fullScreen',
            copyTo: 'cachesDirectory',
        }).then((result) => {
            setSingleFile(result)
        })
    }
    const onPressDeleteIcon = () => {
        setSingleFile(null)
    }

    const onPressSubmit = () => {
        refRBSheet.current.close()
        const fileToUpload = singleFile;
        const data = new FormData();
        data.append('name', 'Image Upload');
        data.append('file_attachment', fileToUpload);
        RNFetchBlob.fs
            .readFile(singleFile.fileCopyUri, 'base64')
            .then(async base64String => {
                // console.log(base64String)
                let phoneNo = await AsyncStorage.getItem("phoneNo")
                let ar = [], obj ={
                    phoneNo: phoneNo,
                    image: base64String,
                    fileDetails: singleFile,
                    date: moment().format('yyyy-MM-DD').toString(),
                    active: true
                }
                database()
                .ref("/users/" + phoneNo + "/pescriptions")
                    .once('value')
                    .then(snapshot => {
                    if (snapshot.val()) {
                        ar = snapshot.val()
                    }
                    ar.push(obj)
                    database()
                        .ref("/users/" + phoneNo + "/pescriptions").set(ar)
                    Toast.show({
                        type: 'customToast',
                        text1: "We will contact you within few minitues...",
                        position: 'bottom',
                        visibilityTime: 1500,
                        bottomOffset: 80,
                        props: {
                            backgroundColor: Colors.green3
                        }
                    });
                })
            }).catch((err) => {
                Toast.show({
                    type: 'customToast',
                    text1: "Failed to decode bitmap...",
                    position: 'bottom',
                    visibilityTime: 1500,
                    bottomOffset: 80,
                    props: {
                        backgroundColor: Colors.error_toast_color
                    }
                });
        })
    
    }

    const onRefresh = () => {
        setRefreshing(true)
        let path
        if (petStoreCategories[selectedCategoryIndex].name === 'Medicine') {
            path = "/petMedicineItems"
        } else if (petStoreCategories[selectedCategoryIndex].name === 'Food') {
            path = "/petFoodItems"
        } else if (petStoreCategories[selectedCategoryIndex].name === 'Toys') {
            path = "/petToysItems"
        } else if (petStoreCategories[selectedCategoryIndex].name === 'Accesorries') {
            path = "/petAccItems"
        } else {
            path = "/petFurItems"
        }
        database()
            .ref(path)
            .on('value', snapshot => {
                if (snapshot.val()) {
                    setRefreshing(false)
                    setPetStoreItems(snapshot.val())
                }
            })
    }

    useEffect(() => {
        if (isFocused) {
            AsyncStorage
                .getItem("homeAddress")
                .then((homeAddress, msg) => {
                    setHomeAddress(JSON.parse(homeAddress))
                })
            getCartItems()
            let path
            if (selectedCategoryIndex  === 0) {
                path = "/petMedicineItems"
            } else if (selectedCategoryIndex === 1) {
                path = "/petFoodItems"
            } else if (selectedCategoryIndex === 2) {
                path = "/petToysItems"
            } else if (selectedCategoryIndex === 3) {
                path = "/petAccItems"
            } else {
                path = "/petFurItems"
            }
            getData(path);
        }
        

    }, [isFocused]);

    return (
        <View
            style={{
            flex: 1,
            backgroundColor: Colors.appBackground
        }}>
            {selectedCategoryIndex === 0 && ( 
            <Animatable.View animation={'fadeInUp'} style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                position: 'absolute',
                zIndex: 1,
                bottom: 15,
                right: 15,
                backgroundColor: Colors.primary,
                borderRadius: 50,
                elevation: 10
                }}>
                <Icon onPress={onPressFileUploadButton} type={Icons.Feather} name="upload" color={Colors.white} size={25} />
            </Animatable.View>
            )}
            <LandingHeader
                homeAddress={homeAddress}
                status={status}
                navigation={navigation}/>
            <View
                style={{
                borderTopLeftRadius: 50,
                marginTop: 50,
                marginBottom: 0,
                borderTopRightRadius: 50,
                paddingHorizontal: 15,
                flex: 1
            }}>
                <View
                    style={{
                    marginTop: 20,
                    marginBottom: 25,
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between'
                }}>
                    <View style={{
                        width: '82%'
                    }}>
                        <Searchbar
                            placeholder="Search"
                            onChangeText={onChangeSearch}
                            value={searchQuery}/>
                    </View>
                    <RNBounceable
                        onPress={() => navigation.navigate("Cart", {status: status})}
                        style={{
                        width: '15%',
                        padding: 10,
                        height: 48,
                        borderRadius: 10,
                        elevation: 5,
                        backgroundColor: Colors.white,
                        alignItems: 'center'
                    }}>
                        <MaterialCommunityIcons name={'cart'} color={Colors.secondary} size={30}/>
                        <View
                            style={{
                            position: 'absolute',
                            top: -15,
                            left: 30
                        }}>
                            <Badge
                                style={{
                                backgroundColor: Colors.primary,
                                borderWidth: 1,
                                borderColor: Colors.appBackground,
                                color: Colors.appBackground
                            }}
                                size={25}>{cartItemCount}</Badge>
                        </View>
                    </RNBounceable>
                </View>
                <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
                    {loadind ? 
                    <Animatable.View animation={'fadeIn'} >
                        <SkeletonPlaceholder style={{padding: 20}}>
                            <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{alignItems: 'center'}}>
                                    <View style={{ width: 80, height: 80, borderRadius: 20 }} />
                                    <View  style={{ marginTop: 5, width: 60, height: 10, borderRadius: 4}}/>
                                </View>
                                <View style={{alignItems: 'center'}}>
                                    <View style={{ width: 80, height: 80, borderRadius: 20 }} />
                                    <View  style={{ marginTop: 5, width: 60, height: 10, borderRadius: 4}}/>
                                </View>
                                <View style={{alignItems: 'center'}}>
                                    <View style={{ width: 80, height: 80, borderRadius: 20 }} />
                                    <View  style={{ marginTop: 5, width: 60, height: 10, borderRadius: 4}}/>
                                </View>
                                <View style={{alignItems: 'center'}}>
                                    <View style={{ width: 80, height: 80, borderRadius: 20 }} />
                                    <View  style={{ marginTop: 5, width: 60, height: 10, borderRadius: 4}}/>
                                </View>
                            </View>
                            <View style={{ marginTop: 30, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ width: Dimensions.get('screen').width / 2 - 30, height: 160, borderRadius: 20 }} />
                                <View style={{marginTop: 20, marginLeft: 5, width: Dimensions.get('screen').width / 2 - 30, height: 160, borderRadius: 20 }} />
                            </View>
                            <View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ width: Dimensions.get('screen').width / 2 - 30, height: 160, borderRadius: 20 }} />
                                <View style={{marginTop: 20, marginLeft: 5, width: Dimensions.get('screen').width / 2 - 30, height: 160, borderRadius: 20 }} />
                            </View>
                            <View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ width: Dimensions.get('screen').width / 2 - 30, height: 160, borderRadius: 20 }} />
                                <View style={{marginTop: 20, marginLeft: 5, width: Dimensions.get('screen').width / 2 - 30, height: 160, borderRadius: 20 }} />
                            </View>
                        </SkeletonPlaceholder>
                    </Animatable.View>
                    :
                    <View>
                        <FlatList
                            ref={categoryCarousel}
                            data={petStoreCategories}
                            scrollEnabled={true}
                            keyExtractor={(item) => item.id}
                            horizontal
                            pagingEnabled
                            bounces={false}
                            showsHorizontalScrollIndicator={false}
                            ItemSeparatorComponent={() => (<View style={{
                            marginLeft: 15
                        }}/>)}
                            snapToAlignment={'center'}
                            snapToInterval={Dimensions
                            .get('window')
                            .width / 5}
                            getItemLayout={(data, index) => ({
                            length: Dimensions
                                .get('window')
                                .width / 5,
                            offset: Dimensions
                                .get('window')
                                .width / 5 * index,
                            index
                        })}
                            renderItem={({item, index}) => (<HorizontalCategoryList
                            categoryTitle={item.name}
                            onPress={() => onPressCaraousel({index})}
                            image={item.image}
                            selectedCategoryIndex={selectedCategoryIndex}
                            index={index}
                            animationStyle="fadeInLeft"/>)}/>
                        <View style={{
                            marginTop: 15
                        }}>
                            {petStoreItems.length > 0
                                ? <RNMasonryScroll
                                        refreshControl={<RefreshControl progressViewOffset={20} colors={[Colors.primary, Colors.secondary]} refreshing={refreshing} onRefresh={onRefresh} />}
                                        removeClippedSubviews={true}
                                        columns={2}
                                        oddColumnStyle={{
                                            marginLeft: 10,
                                            marginTop: 30
                                    }}
                                        horizontal={false}
                                        showsVerticalScrollIndicator={false}
                                        keyExtractor={(item) => item.id}>
                                        {petStoreItems.map((item, index) => <View key={index}>
                                            <StoreItems
                                                animationStyle="fadeInUp"
                                                navToDetail={() => navigation.navigate("ItemDetails", {
                                                item: item,
                                                status: status
                                            })}
                                                name={item.name}
                                                image={item.image}
                                                actualPrice={item.actualPrice}
                                                discountPrice={item.discountPrice}
                                                index={item.id}
                                                width={Dimensions
                                                .get('screen')
                                                .width / 2 - 30}/>
                                        </View>)}
                                    </RNMasonryScroll>
                                : <View
                                    style={{
                                    alignItems: 'center',
                                    marginTop: 20
                                }}>
                                    <Title label="No items are found..." size={20} color={Colors.darkGray}/>
                                </View>
                            }
                        </View>
                    </View>
                    }
                </ScrollView>
            </View>
            <RBSheet
                height={status === 'loggedIn'? 220: 280}
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
                <View style={{justifyContent: 'space-evenly'}}>
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                    }}>
                        <View style={{marginBottom: 10, borderBottomColor: Colors.darkGray, borderBottomWidth: 1, padding: 5, paddingHorizontal: 20}}>
                            <Text style={{fontSize: 20, fontFamily: 'Redressed-Regular', color: Colors.darkGray}}>Upload doctor's pescription</Text>
                        </View>
                        {singleFile && (
                            <View style={{marginTop: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                {singleFile.type.split("/")[0] === 'image' && (
                                    <Image style={{width: 50, height: 50}} source={{uri: singleFile.fileCopyUri}}/>
                                )}
                                {singleFile.type === 'application/pdf' && (
                                    <Icon type={Icons.FontAwesome} name="file-pdf-o" size={40} color={Colors.darkOverlayColor2}/>
                                )}
                                {singleFile.type === 'application/msword' && (
                                    <Icon type={Icons.FontAwesome} name="file-word-o" size={40} color={Colors.darkOverlayColor2}/>
                                )}
                                <View>
                                    <Text style={{marginLeft: 10, fontSize: 16, fontFamily: 'Redressed-Regular', color: Colors.darkGray}}>{singleFile.name}</Text>
                                </View>
                                <View style={{marginLeft: 5}}>
                                    <Icon onPress={onPressDeleteIcon} type={Icons.MaterialCommunityIcons} name="delete" size={25} color={Colors.red}/>
                                </View>
                            </View>
                        )}
                        
                    </View>  
                    <View style={{alignItems: 'center', margin: 20}}>
                        {singleFile?
                        <Button
                            iconPostionLeft={true}
                            backgroundColor={Colors.green3}
                            useIcon={true}
                            title="Submit"
                            icon="save"
                            onPress={onPressSubmit}/>
                        :
                        <Button
                        
                            iconPostionRight={true}
                            backgroundColor={Colors.secondary}
                            useIcon={true}
                            title="Upload"
                            icon="save"
                            onPress={onPressUpload}/>
                        }
                    </View>
                </View>
            </RBSheet>
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        paddingVertical: 15,
        width: '100%',
        color: Colors.mediumDark,
        fontSize: 20
    }
});

export default PetStoreScreen;
