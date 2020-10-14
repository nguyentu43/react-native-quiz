import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Tts from 'react-native-tts';

import RoundedPanel from './RoundedPanel';
import globalStyles from '../styles';

Tts.setDefaultLanguage('en-US');

export default class GuessWord extends React.Component{

    state = {
        score: 0,
        isEnd: false,
        selectedWordIndex: 0,
        showAnswer: false,
        inputValue: ''
    }

    wrongWords = [];

    componentDidMount(){
        this.handleSpeak(0);
    }

    handleTextChange = (value) => {
        this.setState({inputValue: value});
    }

    handleCheckAnswer = () => {

        let {score, selectedWordIndex, inputValue} = this.state;
        const {wordList} = this.props;

        if(!inputValue.trim()) return;

        const word = wordList[selectedWordIndex];
        if(word.en === inputValue)
            score++;
        else
            this.wrongWords.push(word.en);
        this.setState({showAnswer: true, score}, () => {

            setTimeout(this.handleNextWord, 1500);

        });

    }

    handleNextWord = () => {

        const {selectedWordIndex} = this.state;

        if(selectedWordIndex + 1 === this.props.wordList.length){
            this.setState({ isEnd: true });
        }
        else {
            this.handleSpeak(selectedWordIndex + 1);
            this.setState({ showAnswer: false, selectedWordIndex: selectedWordIndex + 1, inputValue: '' });
        }

    }

    handleSpeak = (index) => {
        const { wordList } = this.props;

        Tts.speak(wordList[index].en);
    }

    render(){

        const { isEnd, score, selectedWordIndex, showAnswer, inputValue } = this.state;
        const { wordList } = this.props;
        const word = wordList[selectedWordIndex];

        let backgroundColor = '#00bf00';
        if(word.en !== inputValue)
            backgroundColor = '#ff3535';

        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                {!isEnd ? (
                    <View style={{flex: 1}}>
                        <RoundedPanel>
                            <Text style={globalStyles.textH3}>Hãy nghe và điền từ phù hợp</Text>
                            { showAnswer && (
                                <View>
                                    <Text style={globalStyles.textH1}>{ word.en }</Text>
                                    <Text style={globalStyles.textH3}>{ word.vi }</Text>
                                </View>
                                ) }
                            <Icon onPress={() => this.handleSpeak(selectedWordIndex)} size={70} name="volume-high-outline" />
                        </RoundedPanel>

                        <RoundedPanel style={{marginTop: 10, backgroundColor: showAnswer ? backgroundColor : 'white'}}>
                            <TextInput
                                style={globalStyles.textH1} 
                                maxLength={word.length} 
                                placeholder="Nhập đáp án"
                                onChangeText={this.handleTextChange}
                                onSubmitEditing={this.handleCheckAnswer}
                                value={inputValue}
                            />
                        </RoundedPanel>
                    </View>
                    ):
                    (
                        <RoundedPanel style={styles.resultPanel}>
                            <Text style={globalStyles.textH1}>Kết quả của bạn</Text>
                            <Text 
                                style={{fontSize: 70, color: score < Math.ceil(wordList.length*0.75) ? '#ff3535' : '#00bf00'}}
                            >{score}/{wordList.length}</Text>
                            {
                                this.wrongWords.length > 0 && 
                                <Text style={globalStyles.textH3}>
                                    Các từ trả lời sai: { this.wrongWords.join(', ') }
                                </Text>
                            }
                        </RoundedPanel>
                    ) 
                }
            </View>
        )
    }

}

const styles = StyleSheet.create({
    resultPanel: { 
        flexBasis: '75%', 
        justifyContent: 'center', 
        alignItems: 'center'
    }
})