import React from 'react';
import {Text, StyleSheet, Modal, View, ScrollView} from 'react-native';

import RoundedButton from './RoundedButton';
import globalStyles from '../styles';

export default class QuestionTable extends React.PureComponent {
    
    showSection = false;

    componentDidMount(){
        const {test} = this.props.routeParams;

        this.showSection = test !== 0;
    }

    render(){

        const {mode} = this.props.routeParams;
        const {questionData, visible, responses, handleCloseModal, moveToQuestion, selectedQuestionIndex} = this.props;

        return (
            <Modal
                visible={visible}
                animationType="fade"
            >
                <View style={styles.questionTable}>
                    <RoundedButton title="Đóng" style={{backgroundColor: "red"}} onPress={handleCloseModal}/>
                    <ScrollView style={{flex: 1}} contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap' }}>
                    {
                        questionData.map((question, rIndex) => {

                            const head = this.showSection && question.info.index === 1 ? 
                                <Text
                                    key={"section-" + question.info.section}
                                    style={[globalStyles.textH2, {flexBasis: "100%", marginTop: 10 }]}>
                                        Section {question.info.section}
                                </Text> : null;

                            return [head, ...question.list.map((subQuestion, index) => {

                                let backgroundColor = rIndex === selectedQuestionIndex ? '#008080' : '#7d7d7d';

                                if(responses[rIndex][index] > -1)
                                    if(mode !== 'test'){
                                        if(subQuestion.answer === responses[rIndex][index])
                                            backgroundColor = "blue";
                                        else
                                            backgroundColor = "red";
                                    }

                                const buttonStyle = {backgroundColor, marginRight: 5, marginTop: 10};

                                return <RoundedButton 
                                            key={question.info.section + "-" + question.info.index + index} 
                                            style={buttonStyle} 
                                            onPress={() => moveToQuestion(rIndex)} 
                                            title={(question.info.index + index + "").padStart(2, "0")}
                                        />
                            })];
                        })
                    }
                    </ScrollView>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    questionTable: {
        padding: 5,
        flex: 1
    }
});