import React from "react";
import { StyleSheet, Text, View, FlatList, Alert, ToastAndroid } from "react-native";

import RoundedPanel from "../components/RoundedPanel";
import RoundedButton from "../components/RoundedButton";
import TextCircle from "../components/TextCircle";
import {scaleScore, calTotalScore, changeToCefr} from "../utils/itp";
import globalStyles from "../styles";
import {getDateFormat} from '../utils/time';
import {ExecuteSelectQuery, ExecuteQuery} from '../utils/db';

const textSectionScore = [
                        "Listening Comprehension", 
                        "Structure & Written Expression", 
                        "Reading Comprehension", 
                        "Total Score"];
const numsOfSection = [50, 40, 50];

export default class ResultList extends React.Component{

    state = {
        resultList: []
    }

    componentDidMount(){
        this.getData();
    }

    getData = async () => {
        const resultList = await ExecuteSelectQuery(`
            select results.*, tests.name
            from results join tests on results.test_id = tests.id
            order by results.date desc
        `);

        resultList.forEach(item => {

            item.responses = JSON.parse(item.responses);
            item.date = getDateFormat(item.date);
            item.sections = JSON.parse(item.sections);

        });

        

        this.setState({resultList});
    }

    handleScore = (sections) => {

        const scoreArray = sections.map((score, index) => scaleScore(index + 1, score));
        const totalScore = calTotalScore(scoreArray);
        const cefr = changeToCefr(totalScore);

        return { scoreArray: [...scoreArray, totalScore], cefr };
    }

    renderItem = ({ item }) => {

        const { scoreArray, cefr } = this.handleScore(item.sections);

        return (
            <RoundedPanel style={styles.itemContainer}>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    {
                        scoreArray.map((score, index) => {
                            return <View key={index} style={{marginBottom: 5, flexBasis: '50%'}}>
                                        <TextCircle
                                        textSize={20}
                                        value={score} 
                                        color={index < 3 ? '#006b9f' : '#008000'} 
                                        key={index}
                                        bottomText={textSectionScore[index]}
                                        />
                                    </View>
                        })
                    }
                </View>
                <Text style={[globalStyles.textH1, styles.textCefr]}>CEFR: {cefr}</Text>
                <Text style={globalStyles.textH2}>{item.name}</Text>
                <Text style={globalStyles.text}>
                    Ngày làm bài: 
                    { ' ' + item.date } 
                    {item.sections.reduce((prev, num, index) => prev + `\n${textSectionScore[index]}: ${num}/${numsOfSection[index]} câu đúng` , "") }
                </Text>
                <View style={[globalStyles.flexRow, { marginTop: 10}]}>
                    <RoundedButton size={24} style={{marginRight: 10 }} title="Xóa" onPress={() => this.removeItem(item)}/>
                    <RoundedButton size={24} title="Xem lại bài làm" onPress={() => this.moveToReview(item)}/>
                </View>
            </RoundedPanel>
        );
    }

    removeItem = ({id: removeId}) => {
        Alert.alert(
            "Xóa kết quả", 
            "Bạn có muốn xóa kết quả này", 
            [
                {
                    text: 'Không',
                    style: 'cancel'
                },
                {
                    text: 'Có',
                    style: 'destructive',
                    onPress: async () => {

                        const resultDb = await ExecuteQuery(`delete from results where id = ?`, [removeId]);

                        if(resultDb.rowsAffected === 1){
                            const resultList = this.state.resultList.filter(item => item.id !== removeId);
                            this.setState({resultList});
                            ToastAndroid.show('Bạn đã xóa thành công', ToastAndroid.LONG);
                        }

                        
                    }
                }
            ]);
    }

    moveToReview = (item) => {
        this.props.navigation.navigate('response', { mode: 'review', item })
    }

    render(){

        const {resultList} = this.state;

        return (
            <FlatList 
                style={globalStyles.container} 
                data={resultList} 
                keyExtractor={(item) => item.id.toString()}
                renderItem={this.renderItem}
            />
        );
    }
}

const styles = StyleSheet.create({
    itemContainer: {
        marginBottom: 10,
        flex: 1
    },
    textCefr: {
        borderBottomColor:'#eee',
        borderBottomWidth: 1,
        textAlign: 'center',
        marginBottom: 5
    }
})