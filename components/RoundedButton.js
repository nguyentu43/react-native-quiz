import React from "react";
import { StyleSheet, TouchableOpacity, Text, ColorPropType } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import PropTypes from "prop-types";

export default class RoundedButton extends React.Component{

    static propTypes = {
        color: ColorPropType,
        title: PropTypes.string,
        onPress: PropTypes.func,
        iconName: PropTypes.string,
        buttonStyle: PropTypes.object
    }

    static defaultProps = {
        size: 30,
        color: 'white',
        onPress: () => {},
        style: {},
        title: "",
        iconName: ""
    };

    render(){
        const {title, size, style, color, onPress, iconName} = this.props;
        return (
            <TouchableOpacity 
                style={[styles.container, {backgroundColor: "#2894ff"}, {...style}]} 
                onPress={onPress}
            >
                {!!iconName && <Icon name={iconName} size={size} color={color} style={{ marginBottom: !!title ? 7.5 : 0 }}/>}
                {!!title && <Text style={[styles.text, {color, fontSize: size - 6}]}>{ title }</Text>}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 5,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontWeight: 'bold',
        textAlign: 'center'
    }
});