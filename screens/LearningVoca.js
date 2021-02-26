import React from "react";
import {ScrollView, View} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

import VocaCard from '../components/VocaCard';
import LoadingIndicator from '../components/LoadingIndicator';
import RoundedButton from '../components/RoundedButton';
import { ExecuteSelectQuery } from '../utils/db'
import globalStyles from "../styles";

const key = "ITP_DISCARD_WORD_LIST";

export default class LearningVoca extends React.Component{

    state = {
        wordList: [],
        loading: true,
        selectedIndex: 0,
        adjust: false
    }

    constructor(props){
        super(props);
    }

    async componentDidMount(){
        const {route} = this.props;
        this.tmpWordList = await ExecuteSelectQuery(`
        SELECT *
        from voca
        where lession = ?`, [route.params.lession]);

        this.discardWordList = JSON.parse(await AsyncStorage.getItem(key)) || [];

        const wordList = this.tmpWordList
                             .filter(item => this.discardWordList.indexOf(item.en) === -1);

        this.setState({wordList, loading: false});
    }

    nextCard = () => {
        const { wordList, selectedIndex } = this.state;
        if(selectedIndex + 1 === wordList.length)
            this.setState({selectedIndex: 0})
        else
            this.setState({selectedIndex: selectedIndex + 1});
    }

    prevCard = () => {
        const { wordList, selectedIndex } = this.state;
        if(selectedIndex - 1 < 0)
            this.setState({selectedIndex: wordList.length - 1})
        else
            this.setState({selectedIndex: selectedIndex - 1});
    }

    handleAdjustment = () => {
        let {adjust, wordList} = this.state;

        if(!adjust){

            wordList = [...this.tmpWordList];

            wordList.forEach(item => {
                if(this.discardWordList.indexOf(item.en) === -1)
                    item.forget = false;
                else
                    item.forget = true;
            });
        }
        else{
            wordList = [...this.tmpWordList
                             .filter(item => this.discardWordList.indexOf(item.en) === -1)];
            AsyncStorage.setItem(key, JSON.stringify(this.discardWordList));
        }

        this.setState({wordList, adjust: !adjust});
    }

    handleAddWord = (flag, en) => {

        const {wordList} = this.state;

        if(flag){
            if(this.discardWordList.indexOf(en) === -1)
                this.discardWordList.push(en);
            wordList.forEach(item => {
                if(item.en === en)
                    item.forget = true;
            });
        }
        else{
            this.discardWordList = this.discardWordList.filter(item => item !== en);
            wordList.forEach(item => {
                if(item.en === en)
                    item.forget = false;
            });
        }
        
        this.setState({ wordList })
    }

    render(){

        const {wordList, loading, adjust, selectedIndex} = this.state;

        return (
            <ScrollView style={globalStyles.container}>
                <RoundedButton style={{marginBottom: 10}} title={adjust ? "Xác nhận" : "Loại bỏ từ đã biết"} onPress={this.handleAdjustment}/>
                { <LoadingIndicator loading={loading}/> }
                { !loading && <VocaCard adjust={adjust} onAddWord={this.handleAddWord} data={wordList[selectedIndex]}/>}
                <View style={[globalStyles.flexRow, { justifyContent: 'space-between', marginTop: 10 }]}>
                    <RoundedButton iconName="arrow-back-outline" onPress={this.prevCard}/>
                    <RoundedButton iconName="arrow-forward-outline" onPress={this.nextCard}/>
                </View>
            </ScrollView>
        );
    }

}