import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import Html from 'react-native-render-html';
import Tts from 'react-native-tts';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/Ionicons';

import globalStyles from '../styles';

export default class VocaCard extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            front: true
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps.data.en !== this.props.data.en)
            this.setState({front: true});
    }

    flipCard = () => {
        const {front, adjust} = this.state;
        this.setState({front: !front});
    }

    handleSpeak = (word) => {
        Tts.speak(word);
    }

    render(){

        const {data, onAddWord, adjust} = this.props;
        const {front} = this.state;

        return (
            <TouchableOpacity style={styles.container} onPress={() => this.flipCard()}>
                { front ? (<View style={styles.card}>
                    {adjust && <View style={[globalStyles.flexRow, { alignItems: 'center', justifyContent: 'flex-end' }]}>
                        <CheckBox value={data.forget} onValueChange={ (value) => onAddWord(value, data.en) }/>
                        <Text>Chọn từ này</Text>
                    </View>}
                    <Image source={{uri: `asset:/voca_files/${data.en}.jpg`}} style={styles.image}/>
                    <Text style={globalStyles.textH1} onPress={() => this.handleSpeak(data.en)}>
                        {data.en}
                        <Icon size={40} name="volume-high-outline" />
                    </Text>
                    <Text style={globalStyles.smallText}>Chạm để xem định nghĩa</Text>
                </View>) : 
                (<View style={styles.card}>
                    <Image source={{uri: `asset:/voca_files/${data.en}.jpg`}} style={styles.image}/>
                    <Text style={[globalStyles.textH3, styles.boldText]}>{data.vi}</Text>
                    <Text style={[globalStyles.textH3, styles.boldText]}>Đồng nghĩa: {data.syn}</Text>
                    <Html baseFontStyle={globalStyles.text} html={data.explain}/>
                    <Text style={globalStyles.smallText}>Chạm để trở lại</Text>
                </View>)}
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        flex: 1,
        position: 'relative'
    },
    card: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5
    },
    image: {
        aspectRatio: 2,
        resizeMode: 'contain',
        marginBottom: 10
    },
    boldText: {
        fontWeight: 'bold'
    }
})