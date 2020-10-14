import React, { Component } from "react";
import {StyleSheet, Text, View, Modal} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

import RoundedButton from '../components/RoundedButton';
import FindMean from '../components/FindMean';
import GuessWord from '../components/GuessWord';
import { ExecuteSelectQuery } from '../utils/db';

import globalStyles from '../styles';
import {shuffle} from '../utils/array';

const key = "ITP_DISCARD_WORD_LIST";
export default class PracticeVoca extends React.Component{

    state = {
        functionValue: '',
        openModal: false,
        loading: true,
        wordList: [
        ]
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

    functionList = [
        { title: 'Tìm định nghĩa', backgroundColor: '#009191', value: 'find-mean'},
        { title: 'Tìm từ đồng nghĩa', backgroundColor: '#ff8346', value: 'find-syn'},
        { title: 'Nghe đoán từ', backgroundColor: '#ff5151', value: 'guess-word'}
    ]

    handleOpenModal = (functionValue) => {
        this.setState({functionValue}, () => {

            this.setState({ openModal: true })

        });
    }

    renderComponent = () => {
        const {wordList} = this.state;
        const shuffledList = shuffle(wordList);
        switch(this.state.functionValue){
            case 'find-mean':
                return <FindMean checkProp="vi" wordList={shuffledList}/>;
            case 'find-syn':
                return <FindMean checkProp="syn" wordList={shuffledList}/>;
            case 'guess-word':
                return <GuessWord wordList={shuffledList}/>;
            case 'complete-sentence':
                return <CompleteSentence wordList={shuffledList}/>
        }
    }

    render(){
        return (
            <View style={[globalStyles.container, {alignContent: 'center'}]}>
                {
                    this.functionList.map(item => {
                        return (
                            <RoundedButton 
                                onPress={() => this.handleOpenModal(item.value)}
                                key={item.value}
                                style={{ flex: 1, marginTop: 5, backgroundColor: item.backgroundColor}}
                                title= {item.title}
                            />
                        );
                    })
                }
                <Modal
                    visible={this.state.openModal}
                    onRequestClose={() => this.setState({openModal: false})}
                >
                    <View style={globalStyles.modal}>
                        { this.renderComponent() }
                    </View>
                </Modal>
            </View>
        );
    }

}

const styles = StyleSheet.create({
})
