import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import RoundedButton from "../components/RoundedButton";
import RoundedPanel from "../components/RoundedPanel";
import globalStyles from "../styles";
import {ExecuteSelectQuery} from '../utils/db';

export default class QuestionList extends React.Component{

    state = {
        questionData: [
        ]
    }

    async componentDidMount(){
        const {mode} = this.props.route.params;

        if(mode === 'pinned'){
            this.props.navigation.setOptions({ title: 'Pinned Question List' });
            this.key = 'ITP_PINNED_QUESTION_LIST';
        }
        if(mode === 'wrong'){
            this.props.navigation.setOptions({ title: 'Wrong Question List' });
            this.key = 'ITP_WRONG_QUESTION_LIST';
        }

        const list = JSON.parse(await AsyncStorage.getItem(this.key));

        if(list){
            const strList = list.join(',');

            const data = await ExecuteSelectQuery(`
                select questions.*, name as test_name
                from questions join tests on json_extract(questions.info, '$.test') = tests.id
                where questions.id in (${strList})
            `);

            data.forEach(item => {
                item.info = JSON.parse(item.info);
                item.info.test_name = item.test_name;
                item.list = JSON.parse(item.list);
            });

            this.setState({questionData: data})
        }
    }

    navigateToResponseScreen = (questionId) => {
        this.props.navigation.navigate('response', { mode: 'check',  id: questionId});
    }

    removeItem = async (questionId) => {
        const {questionData} = this.state;
        const list = JSON.parse(await AsyncStorage.getItem(this.key));
        await AsyncStorage.setItem(this.key, JSON.stringify(list.filter(item => item !== questionId)));
        this.setState({questionData: questionData.filter(item => item.id !== questionId)});
    }

    renderItem = ({item}) => {

        const {list, info} = item;

        const lastIndex = list.length > 1 ? '-' + (list.length + info.index - 1) : '';
        const typeOfQuestion = info.test ? `Đề thi: ${info.test_name}` : '';

        return (
                <RoundedPanel style={{marginBottom: 10}}>
                    <Text style={globalStyles.textH3}>Câu { item.info.index }{lastIndex}</Text>
                    <Text style={globalStyles.text}>{typeOfQuestion}</Text>
                    <View style={globalStyles.flexRow}>
                        <RoundedButton 
                            style={{marginRight: 10}} 
                            size={22} 
                            title="Xem"
                            onPress={() => this.navigateToResponseScreen(item.id, "practice")}
                        />
                        <RoundedButton 
                            size={22} 
                            style={{ backgroundColor: '#ff6a22' }} 
                            title="Xóa"
                            onPress={() => this.removeItem(item.id)}
                        />
                    </View>
                </RoundedPanel>
        );
    }

    render(){
        const {questionData} = this.state;
        return (
            <FlatList 
                style={globalStyles.container} 
                keyExtractor={item => item.id.toString()}
                data={questionData}
                renderItem={this.renderItem}
            />
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});