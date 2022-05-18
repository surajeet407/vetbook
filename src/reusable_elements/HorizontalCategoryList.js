import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import Colors from '../util/Colors';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import i18n from '../util/i18n';

const HorizontalCategoryList = (props) => {
    return (
        <Animatable.View
            key={props.index}
            delay={100 * props.index}
            animation={props.animationStyle}
            style={{
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <View
                style={{
                borderWidth: 1,
                borderColor: props.selectedCategoryIndex == props.index
                    ? Colors.secondary
                    : Colors.darkGray,
                backgroundColor: props.selectedCategoryIndex == props.index
                    ? Colors.secondary
                    : Colors.appBackground,
                elevation: 4,
                paddingHorizontal: 15,
                paddingVertical: 10,
                borderRadius: 20
            }}>
                <TouchableOpacity onPress={props.onPress}>
                    <Image
                        style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50
                    }}
                        source={{
                        uri: props.image
                    }}/>
                </TouchableOpacity>
            </View>

            <View
                style={{
                alignItems: 'center',
                flexDirection: 'row'
            }}>
                {props.selectedCategoryIndex === props.index
                    ? <View
                            style={{
                            marginTop: 5,
                            marginRight: 5
                        }}>
                            <FontAwesome
                                name={'dot-circle-o'}
                                size={15}
                                color={props.selectedCategoryIndex == props.index
                                ? Colors.primary
                                : Colors.darkGray}/>
                        </View>
                    : null
}
                <Text
                    style={{
                    marginTop: 2,
                    color: props.selectedCategoryIndex == props.index
                        ? Colors.primary
                        : Colors.darkGray,
                    fontSize: 15,
                    fontFamily: 'Redressed-Regular'
                }}>{props.categoryTitle}</Text>
            </View>
        </Animatable.View>
    );
};

const styles = StyleSheet.create({});

export default HorizontalCategoryList;
