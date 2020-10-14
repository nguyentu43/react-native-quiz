import React from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';

export default class LoadingIndicator extends React.Component {
    render(){
        const { loading } = this.props;
        return (
            <>
                {loading && (
                    <ActivityIndicator 
                    size={40}
                    color="black"
                    />
                )}
            </>
        )
    }
}