import React from "react";
import { StyleSheet, View, Text, ScrollView, ToastAndroid, Alert } from "react-native";

import RoundedButton from "../components/RoundedButton";
import RoundedPanel from "../components/RoundedPanel";
import Timer from "../components/Timer";
import SubQuestion from "../components/SubQuestion";
import ParagraphBox from "../components/ParagraphBox";
import AudioPlayer from "../components/AudioPlayer";
import globalStyles from "../styles";
import {ExecuteSelectQuery, ExecuteQuery} from '../utils/db';
import {getDateNow} from '../utils/time';
import QuestionTable from "../components/QuestionTable";
import AsyncStorage from "@react-native-community/async-storage";

export default class ResponseQuestion extends React.Component{

    state = {
        timer: {
            enable: false,
            seconds: 115 * 60
        },
        showModal: false,
        selectedQuestionIndex: 0,
        showTranscript: false,
        mode: 'review'

    }

    questionData = [];
    responses = [];
    isSubmit = false;

    async componentDidMount(){

        const { mode, test, id } = this.props.route.params;
        const { timer } = this.state;

        if(mode === 'test'){

            timer.enable = true;
            this.timerIntervalId = setInterval(() => {
                const { seconds } = this.state.timer;
                if(seconds === 0){
                    clearInterval(this.timerIntervalId);

                    Alert.alert('Hết thời gian', "Hết thời làm bài", [
                        { text: 'OK', onPress: () => this.submitResponse() }
                    ]);
                }
                this.setState({ timer : { ...timer, seconds: seconds - 1 } })
            }, 1000);

        }

        if(mode === 'test' || (mode === 'practice' && test)){

            await this.getTest(test);

            this.questionData.forEach(item => {

                item.info = JSON.parse(item.info);
                item.list = JSON.parse(item.list);
                
                this.responses.push(item.list.map(choice => -1));

            });
        }

        if(mode === 'review'){
            const {item} = this.props.route.params;
            await this.getTest(item.test_id);

            this.responses = [...item.responses];

            this.questionData.forEach(item => {

                item.info = JSON.parse(item.info);
                item.list = JSON.parse(item.list);

            });
        }

        if(mode === 'check'){
            this.questionData = await ExecuteSelectQuery('select * from questions where id = ?', [id]);
            
            this.questionData.forEach(item => {

                item.info = JSON.parse(item.info);
                item.list = JSON.parse(item.list);
                
                this.responses.push(item.list.map(choice => -1));

            });
        }

        const key = 'ITP_PINNED_QUESTION_LIST';

        const list = JSON.parse((await AsyncStorage.getItem(key))) || [];
        this.pinnedQuestionList = new Set(list);

        this.setState({mode, timer});
        this.handleShowTranscript();

        this.props.navigation.addListener('beforeRemove', (e) => {
            const {test} = this.props.route.params;

            if(test){
                if(!this.isSubmit){
                    e.preventDefault();
                    Alert.alert(
                        "Thoát", 
                        "Bài làm của bạn sẽ không được lưu. Bạn có muốn thoát không?",
                        [
                            { text: 'Không' },
                            { 
                                text: 'Có', 
                                style: 'destructive', 
                                onPress: () => { this.props.navigation.dispatch(e.data.action); } }
                        ]
                    );
                }
            }
        });

    }

    componentWillUnmount(){
        if(this.timerIntervalId) clearInterval(this.timerIntervalId);
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.selectedQuestionIndex !== this.state.selectedQuestionIndex)
        {
            this.handleShowTranscript();
        }
    }

    getTest = async (test) => {
        this.questionData = await ExecuteSelectQuery(`
        select *
        from questions
        where json_extract(info, '$.test') = ?
        `, [test]);
    }

    handleSetRefPlayer = (player) => {
        this.player = player;
    }

    handleSeekPlayer = (event, a) => {
        this.player.seek(parseInt(a));
    }

    handleShowTranscript = () => {
        const {mode, selectedQuestionIndex} = this.state;
        if(['review', 'check'].indexOf(mode) >= 0 || (this.state.mode === 'practice' && 
           this.responses[selectedQuestionIndex].every(item => item > -1))){
            this.setState({showTranscript: true});
        }
        else
            this.setState({showTranscript: false})
    }

    handleSelectAnswer = (index, choice) => {
        this.responses[this.state.selectedQuestionIndex][index] = choice;
        this.handleShowTranscript();
    }

    nextQuestion = () => {
        const {selectedQuestionIndex} = this.state;
        if(selectedQuestionIndex < this.questionData.length - 1)
            this.setState({selectedQuestionIndex: selectedQuestionIndex + 1});
    }

    prevQuestion = () => {
        const {selectedQuestionIndex} = this.state;
        if(selectedQuestionIndex > 0)
            this.setState({selectedQuestionIndex: selectedQuestionIndex - 1});
    }

    moveToQuestion = (index) => {
        this.setState({selectedQuestionIndex: index, showModal: false});
    }

    pressSubmit = () => {

        Alert.alert("Nộp bài", "Bạn có muốn nộp bài?", [
            {
                text: "Có",
                onPress: () => this.submitResponse()
            },
            {
                text: "Không"
            }
        ], { cancelable: true });

    }

    submitResponse = async () => {
        const numsOfSection = await this.calculate();
        const totalOfSection = [50, 40, 50];
        const {test} = this.props.route.params;

        try{
            const result = await ExecuteQuery(`
                insert into results(date, sections, test_id, responses) values(?, ?, ?, ?)
            `, [getDateNow(), JSON.stringify(numsOfSection), test, JSON.stringify(this.responses)
            ]);

            if(result.rowsAffected === 1){
                this.isSubmit = true;
                Alert.alert(
                    'Kết quả của bạn', 
                    'Số câu trả lời đúng\n' + numsOfSection
                                            .map((num, index) => `Section ${index+1}: ${num}/${totalOfSection[index]}`)
                                            .join('\n'),
                    [
                        {
                            text: 'Chi tiết',
                            onPress: () => {
                                this.props.navigation.pop(1);
                                this.props.navigation.navigate('result-list'); }
                        }
                    ]
                )
            }
        }
        catch(e){
            throw e;
        }
        
    }

    calculate = async () => {
        const section = [0, 0, 0];

        const key = 'ITP_WRONG_QUESTION_LIST';

        const list = JSON.parse((await AsyncStorage.getItem(key))) || [];
        const set = new Set(list);

        for(let i = 1; i<=3; i++)
        {
            this.questionData.forEach((question, questionIndex) => {
                if(question.info.section === i)
                {
                    question.list.forEach((subQuestion, index) => {
                        const choice = this.responses[questionIndex][index]
                        if(choice > -1 && choice === subQuestion.answer )
                            section[i-1]++;
                        else
                            set.add(question.id);
                    });
                }
            });
        }

        await AsyncStorage.setItem(key, JSON.stringify(Array.from(set)));

        return section;
    }

    toggleModal = () => {
        this.setState({showModal: !this.state.showModal});
    }

    renderSubQuestion = (question) => {

        const {mode} = this.state;

        const {list} = question;
        const indexOfTest = question.info.index;
        const response = this.responses[this.state.selectedQuestionIndex];

        return list.map((sub, index) => {

            return (
                <View style={{marginBottom: 10}} key={index + indexOfTest}>
                    <SubQuestion
                        
                        data={{...sub, indexOfTest, index, response: response[index]}}
                        onValueChange={(choice) => this.handleSelectAnswer(index, choice)}
                        mode={mode}
                    />
                </View>
            );
        });
    }

    toggleQuestion = async () => {
        const {selectedQuestionIndex} = this.state;
        const id = this.questionData[selectedQuestionIndex].id;
        
        if(this.pinnedQuestionList.has(id)){
            this.pinnedQuestionList.delete(id);
            ToastAndroid.show('Bạn đã gỡ bỏ đánh dấu câu này', ToastAndroid.SHORT);
        }
        else{
            this.pinnedQuestionList.add(id);
            ToastAndroid.show('Bạn đã đánh dấu câu này', ToastAndroid.SHORT);
        }

        this.forceUpdate();

        const key = 'ITP_PINNED_QUESTION_LIST';

        await AsyncStorage.setItem(key, JSON.stringify(Array.from(this.pinnedQuestionList)));
    }

    renderButtonGroup = () => {

        const {test} = this.props.route.params;
        const {selectedQuestionIndex} = this.state;
        const id = this.questionData[selectedQuestionIndex].id;
        const backgroundColor = this.pinnedQuestionList.has(id) ? '#ff8040' : '#c0c0c0';

        return (
            <View style={styles.buttonGroup}>
                <RoundedButton iconName="arrow-back-outline" style={{backgroundColor:"#004080"}} onPress={this.prevQuestion}/>
                <RoundedButton iconName="reader-outline" style={{backgroundColor:"#46c8f9"}} onPress={this.toggleModal} />
                <RoundedButton iconName="star-outline" style={{backgroundColor}} onPress={this.toggleQuestion} />
                {test && <RoundedButton title="Nộp bài" style={{backgroundColor:"#00ce67"}} onPress={this.pressSubmit} />}
                <RoundedButton iconName="arrow-forward-outline" style={{backgroundColor:"#004080"}} onPress={this.nextQuestion}/>
            </View>
        );

    }

    render(){

        const {mode, timer, selectedQuestionIndex, showModal, showTranscript} = this.state;
        const selectedQuestion = this.questionData[selectedQuestionIndex];

        if(this.questionData.length === 0)
            return null;

        return (
            <View style={globalStyles.container}>

                {timer.enable && (
                    <RoundedPanel style={styles.toolbar}>
                        <Timer seconds={timer.seconds} />
                    </RoundedPanel>
                )}

                {
                    selectedQuestion.transcript
                    && (
                        <RoundedPanel style={styles.playerContainer}>
                            <AudioPlayer 
                                setRefPlayer={this.handleSetRefPlayer} 
                                source={'a' + selectedQuestion.id}/>
                        </RoundedPanel>
                    )
                }

                {
                    showTranscript
                    &&
                    selectedQuestion.transcript
                    && (
                        <ScrollView style={styles.paragraphsContainer}><RoundedPanel >
                            <ParagraphBox 
                                paragraphs={"<b>Transcript:</b><br>" + selectedQuestion.transcript}
                                onClickLink={this.handleSeekPlayer}
                            />
                        </RoundedPanel></ScrollView>
                    )
                }

                {
                    selectedQuestion.paragraphs
                    && (
                        <ScrollView style={styles.paragraphsContainer}><RoundedPanel >
                            <ParagraphBox paragraphs={selectedQuestion.paragraphs}/>
                        </RoundedPanel></ScrollView>
                    )
                }

                <ScrollView>{ this.renderSubQuestion(selectedQuestion) }</ScrollView>

                {mode !== 'check' && this.renderButtonGroup()}

                <QuestionTable 
                    selectedQuestionIndex={selectedQuestionIndex}
                    questionData={this.questionData}
                    responses={this.responses}
                    handleCloseModal={this.toggleModal}
                    visible={showModal}
                    moveToQuestion={this.moveToQuestion}
                    routeParams={this.props.route.params}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    toolbar: {
        marginBottom: 10
    },
    paragraphsContainer: {
        marginBottom: 10,
    },
    playerContainer: {
        marginBottom: 10
    },
    questionContainer: {
        marginBottom: 10
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: 10
    }
})
