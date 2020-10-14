import React from "react";
import { StyleSheet, View } from "react-native";

export default class RoundedPanel extends React.Component{
    render(){
        const { children, style } = this.props;
        return (
            <View style={[styles.container, style]}>
                { children }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 5,
        borderColor: 'black',
        backgroundColor: "white"
    }
})