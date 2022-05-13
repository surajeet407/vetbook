import React from 'react';
import {StyleSheet, Text} from 'react-native';

const Title = (props) => {
    return (
        <Text
            style={{
            fontFamily: props.fontFamily? props.fontFamily:'Oswald-Medium',
            color: props.color,
            fontSize: props.size
        }}>{props.label}</Text>
    );
};

const styles = StyleSheet.create({});

export default Title;
