import React, {useRef, useState, useEffect, useMemo} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
    Dimensions,
    ImageBackground
} from 'react-native';
import GeneralHeader from '../reusable_elements/GeneralHeader';
import Title from '../reusable_elements/Title';
import Colors from '../util/Colors';
import database from '@react-native-firebase/database';
import RNMasonryScroll from "react-native-masonry-scrollview";
import HorizontalCategoryList from '../reusable_elements/HorizontalCategoryList'
import * as Animatable from 'react-native-animatable';
import Icon, {Icons} from '../util/Icons';
import i18n from '../util/i18n';

const AdoptPetScreen = ({navigation}) => {
    const [selectedCategoryIndex,
        setSelectedCategoryIndex] = useState(0);
    const [petCategories,
        setPetCategories] = useState([]);
    const [dogs,
        setDogs] = useState([]);
    const categoryCarousel = useRef(null);
    const onPressCaraousel = (orgs) => {
        setSelectedCategoryIndex(orgs.index);
        categoryCarousel
            .current
            .scrollToIndex(orgs, {
                animated: true,
                viewPosition: 2
            })
    }
    const ITEM_SIZE = Dimensions
        .get('window')
        .width / 2 - 15;

    const getData = () => {
        database()
            .ref('/petCategories')
            .on('value', snapshot => {
                if (snapshot.val()) {
                    setPetCategories(snapshot.val())
                }
            })
        database()
            .ref('/petDogs')
            .on('value', snapshot => {
                if (snapshot.val()) {
                    setDogs(snapshot.val())
                }
            })

    }
    useEffect(() => {
        getData();
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
                subHeaderText=""
                showSubHeaderText={false}
                subHeaderTextSize={20}
                subHeaderTextColor={Colors.secondary}
                position={'relative'}
                headerHeight={60}
                headerText={'Adopt'}
                headerTextSize={25}
                headerTextColor={Colors.primary}
                showHeaderText={true}
                showLeftIcon={true}
                leftIconType={Icons.MaterialIcons}
                leftIconName={'navigate-before'}
                leftIconSize={45}
                leftIonColor={Colors.black}
                leftIconBackgroundColor={Colors.appBackground}
                onPressLeft={() => navigation.goBack()}/>
            <View
                style={{
                flex: 1,
                backgroundColor: Colors.appBackground,
                width: '100%'
            }}>
                <View
                    style={{
                    paddingHorizontal: 20,
                    marginBottom: 140
                }}>
                    <FlatList
                        ref={categoryCarousel}
                        style={{
                        marginTop: 20,
                        height: 120
                    }}
                        data={petCategories}
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
                        .width / 8}
                        getItemLayout={(data, index) => ({
                        length: Dimensions
                            .get('window')
                            .width / 8,
                        offset: Dimensions
                            .get('window')
                            .width / 8 * index,
                        index
                    })}
                        renderItem={({item, index, separators}) => (<HorizontalCategoryList
                        categoryTitle={item.name}
                        onPress={() => onPressCaraousel({index})}
                        image={item.image}
                        selectedCategoryIndex={selectedCategoryIndex}
                        index={index}
                        animationStyle="fadeInLeft"/>)}/>
                    <RNMasonryScroll
                        style={{
                        marginTop: 20
                    }}
                        removeClippedSubviews={true}
                        columns={2}
                        oddColumnStyle={{
                        marginTop: 30
                    }}
                        horizontal={false}
                        showsVerticalScrollIndicator={false}>
                        {dogs.map((item, index) => <Animatable.View
                            delay={100 * index}
                            animation={'fadeInUp'}
                            key={index}
                            style={{
                            backgroundColor: item.color,
                            borderRadius: 15,
                            elevation: 5,
                            overflow: "hidden",
                            margin: 5
                        }}>
                            <TouchableOpacity
                                style={{
                                borderRadius: 15,
                                alignItems: 'flex-start'
                            }}
                                onPress={() => navigation.navigate("PetDetail", {item: item})}>
                                <Image
                                    blurRadius={3}
                                    style={{
                                    width: ITEM_SIZE - 15,
                                    height: 180
                                }}
                                    source={{
                                    uri: item.image
                                }}></Image>
                            </TouchableOpacity>
                            <View
                                style={{
                                position: 'absolute',
                                bottom: 10,
                                left: 10
                            }}>
                                <Title color={'#fff'} size={18} bold={true} label={item.name}/>
                                <View
                                    style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-evenly'
                                }}>
                                    <View
                                        style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Icon
                                            type={Icons.Ionicons}
                                            style={{
                                            marginRight: 5
                                        }}
                                            name={'time-outline'}
                                            color={Colors.appBackground}
                                            size={20}/>
                                        <Title color={'#fff'} size={15} bold={true} label={item.details[1].value}/>
                                    </View>
                                    <View
                                        style={{
                                        marginLeft: 15,
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Icon
                                            type={Icons.Ionicons}
                                            style={{
                                            marginRight: 5
                                        }}
                                            name={item.details[2].value === 'Male'
                                            ? 'male'
                                            : 'female'}
                                            color={Colors.appBackground}
                                            size={20}/>
                                        <Title
                                            color={'#fff'}
                                            size={15}
                                            bold={true}
                                            label={item.details[2].value === 'Male'
                                            ? 'boy'
                                            : 'Girl'}/>
                                    </View>
                                </View>
                            </View>
                        </Animatable.View>)}
                    </RNMasonryScroll>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    categoriesListContainer: {
        justifyContent: 'space-around'
    }
});

export default AdoptPetScreen;
