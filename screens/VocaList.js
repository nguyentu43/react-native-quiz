import React from "react";
import {StyleSheet, Text, View, ScrollView, ActivityIndicator} from "react-native";

import RoundedPanel from "../components/RoundedPanel";
import RoundedButton from "../components/RoundedButton";
import LoadingIndicator from "../components/LoadingIndicator";
import globalStyles from "../styles";
import { ExecuteSelectQuery } from '../utils/db';

export default class VocaList extends React.Component{

    state = {
        lessions: [],
        loading: true
    }


    async componentDidMount(){
        const lessions = await ExecuteSelectQuery(`
        SELECT lession, count(en) as wordTotal
        from voca
        group by lession`, []);
        this.setState({lessions, loading: false});
    }

    navigateToLearningScreen = (index) => {
        this.props.navigation.navigate('learning-voca', { lession: index });
    }

    navigateToPracticeScreen = (index) => {
        this.props.navigation.navigate('practice-voca', { lession: index });
    }

    renderItem = (item, index) => {

        return (
            <RoundedPanel key={index} style={{ flexBasis: '48%', marginBottom: 10}}>
                <Text style={globalStyles.textH2}>Từ vựng {item.lession + 1}</Text>
                <Text style={globalStyles.text}>
                    {item.wordTotal} từ
                </Text>
                <RoundedButton
                    size={22}
                    title="Học"
                    onPress={() => this.navigateToLearningScreen(index)}
                    />
                <RoundedButton
                    size={22}
                    style={{marginTop: 5, backgroundColor: '#00aa55'}} 
                    title="Luyện tập"
                    onPress={() => this.navigateToPracticeScreen(index)}
                    />
            </RoundedPanel>
        );

    }

    render(){

        const { lessions, loading } = this.state;

        return (
            <ScrollView style={globalStyles.container}>
                <LoadingIndicator loading={loading}/>
                <View style={[globalStyles.flexRow, {justifyContent: 'space-between'}]}>
                    {
                        lessions.map(this.renderItem)
                    }
                </View>
            </ScrollView>
            
        );
    }
}
