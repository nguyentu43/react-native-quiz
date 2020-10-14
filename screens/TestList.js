import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

import RoundedPanel from "../components/RoundedPanel";
import globalStyles from "../styles";
import RoundedButton from "../components/RoundedButton";
import {ExecuteSelectQuery} from '../utils/db';


export default class FullTextList extends React.Component{

    state = {
        testList:[
        ]
    }

    async componentDidMount(){

        const list = await ExecuteSelectQuery("select * from tests");
        this.setState({testList: list})
    }

    navigateToResponseScreen(test_id, mode){
        this.props.navigation.navigate('response', { test: test_id, mode });
    }

    renderItem = (item, index) => {
        return (
            <RoundedPanel style={styles.item} key={index}>
                <Text style={globalStyles.textH2}>{item.name}</Text>
                <View style={globalStyles.flexRow}>
                    <RoundedButton 
                        style={{marginRight: 10}} 
                        size={22} 
                        title="Luyện tập"
                        onPress={() => this.navigateToResponseScreen(item.id, "practice")}
                    />
                    <RoundedButton 
                        size={22} 
                        style={{ backgroundColor: '#ff6a22' }} 
                        title="Kiểm tra"
                        onPress={() => this.navigateToResponseScreen(item.id, "test")}
                    />
                </View>
            </RoundedPanel>
        );
    }

    render(){
        return (
            <ScrollView style={globalStyles.container}>
                <RoundedPanel style={{marginBottom: 10}}>
                    <Text style={globalStyles.textH1}>FULL TEST</Text>
                </RoundedPanel>
                <View>
                    { this.state.testList.map(this.renderItem) }
                </View>
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    item: {
        marginBottom: 10
    }
})