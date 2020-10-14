import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Tts from 'react-native-tts';

import globalStyles from '../styles';
import { shuffle } from '../utils/array';
import RoundedPanel from './RoundedPanel';
import RoundedButton from './RoundedButton';

export default class FindMean extends React.Component{

    state = {
        choices: [],
        selectedWordIndex: 0,
        selectedButtonIndex: -1,
        score: 0,
        isEnd: false
    }

    wrongWords = [];

    componentDidMount(){

        const { wordList } = this.props;
        this.generateChoices();
        Tts.speak(wordList[0].en);

    }

    generateChoices = () => {

        const { wordList } = this.props;
        const { selectedWordIndex } = this.state;
        const choices = [...wordList.slice(0, selectedWordIndex), ...wordList.slice(selectedWordIndex + 1)];
        this.setState({ choices: shuffle([...choices.slice(0, 5), wordList[selectedWordIndex]]) });

    }

    handleNextWord = () => {

        const { selectedWordIndex } = this.state;
        const { wordList } = this.props;

        if(selectedWordIndex + 1 === wordList.length){
            this.setState({ isEnd: true });
        }
        else{
            Tts.speak(wordList[selectedWordIndex + 1].en);
            this.setState({ selectedWordIndex: selectedWordIndex + 1, selectedButtonIndex: -1 }, () => {
                this.generateChoices();
            });
        }

    }

    handleSelectButton = (index) => {
        this.setState({selectedButtonIndex: index}, () => {
            const {score, selectedWordIndex, choices} = this.state;
            const {wordList} = this.props;
            
            if(wordList[selectedWordIndex].en === choices[index].en)
                this.setState({score: score + 1});
            else
                this.wrongWords.push(wordList[selectedWordIndex].en);
            Tts.speak(wordList[selectedWordIndex].en);

            setTimeout(() => {
                this.handleNextWord();
            }, 1500);
        });
    }

    renderItems = () => {

        const {choices, selectedButtonIndex, selectedWordIndex} = this.state;
        const { wordList, checkProp } = this.props;

        return choices.map((item, index) => {

            let backgroundColor = 'white';
            let color = 'black';

            if(selectedButtonIndex === index){
                color = 'white';
                backgroundColor = '#ff3535';
            }

            if(selectedButtonIndex > -1){
                if(item.en ===  wordList[selectedWordIndex].en){
                    backgroundColor = '#00bf00';
                    color = 'white';
                }
            }

            return <RoundedButton 
                        style={{backgroundColor: backgroundColor, marginBottom: 10, flexBasis: '49%'}} 
                        color={color} 
                        key={item.en} 
                        title={item[checkProp]}
                        onPress={() => this.handleSelectButton(index)} 
                />

        });

    }

    render(){
        const { selectedWordIndex, isEnd, score } = this.state;
        const { wordList } = this.props;

        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                {!isEnd ? (
                    <View style={{flex: 1}}>
                        <RoundedPanel>
                            <Text style={globalStyles.textH3}>Hãy chọn đáp án phù hợp cho từ sau</Text>
                            <Text style={globalStyles.textH1}>{ wordList[selectedWordIndex].en }</Text>
                        </RoundedPanel>

                        <View style={[globalStyles.flexRow, { marginTop: 10, justifyContent: 'space-around' }]}>
                            { this.renderItems() }
                        </View>
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