import React from "react";
import {Text, View} from "react-native";

export default function TextCircle({ 
    value = 20, size = 70, 
    circleTextSize = 20, textSize = 18, 
    bottomText = "", color = 'black'}){

    const circleStyle = {
        width: size,
        height: size,
        borderWidth: 7,
        borderRadius: size,
        borderColor: color,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    };

    return (
        <View style={{alignItems: 'center'}}>
            <View style={circleStyle}>
            <Text style={{fontSize: circleTextSize}}>{value}</Text>
            </View>
            <Text style={{fontSize: textSize, textAlign: 'center'}}>{bottomText}</Text>
        </View>
    );
}