import React from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import {millisecondsToHuman} from "../utils/time";

export default function Timer({ seconds }){

    const color = seconds <= 30 ? 'red' : 'black';

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="hourglass-outline" size={18} color={color}/>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color }}>{ millisecondsToHuman(Math.abs(seconds)) }</Text>
        </View>
    );
}