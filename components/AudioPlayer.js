import React from "react";
import {Text, View, Platform, TouchableOpacity} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Slider from "@react-native-community/slider";
import SoundPlayer from 'react-native-sound-player';

import {millisecondsToHuman} from "../utils/time";

export default class AudioPlayer extends React.Component{

    state = {
        isPlaying: false,
        currentTime: 0,
        duration: 1
    };

    componentDidMount(){

        this.createPlayer();
        this.props.setRefPlayer(SoundPlayer);
        this.handleFinishedPlaying = SoundPlayer.addEventListener("FinishedPlaying", () => {
            SoundPlayer.seek(0);
            this.setState({isPlaying: false});
        });

        this.updateId = setInterval(this.updateDataPlayer, 1000);
    }

    componentDidUpdate(prevProps){
        if(prevProps.source !== this.props.source)
            this.createPlayer();
    }

    createPlayer = () => {

        try{
            const {source} = this.props;
            console.log(source);
            SoundPlayer.playSoundFile(source, 'mp3');
            this.setState({isPlaying: true});
        }
        catch(e){
            throw e;
        }
        
    }

    updateDataPlayer = async () => {

        try{
            const {duration, currentTime} = await SoundPlayer.getInfo();
            this.setState({duration, currentTime});
        }
        catch(e){
            throw e;
        }
        
    }

    togglePlayer = () => {
        const {isPlaying} = this.state;

        if(isPlaying){
            SoundPlayer.pause()
            this.setState({isPlaying: false});
        }
        else{
            SoundPlayer.play();
            this.setState({isPlaying: true});
        }
    }

    seekPlay = (percentage) => {
        const { duration } = this.state;
        SoundPlayer.seek(percentage * duration * 0.01);
    }

    componentWillUnmount(){
        this.handleFinishedPlaying.remove();
        SoundPlayer.stop();
        clearInterval(this.updateId);
        console.log('unmount');
    }

    render(){

        const { isPlaying, duration, currentTime } = this.state;
        const value = Math.ceil((currentTime/duration) * 100) || 0;

        return (
            <View style={{height: 50, flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity onPress={this.togglePlayer}>
                        {!isPlaying ? (<Icon name="play-circle-outline" size={40} />) : (<Icon name="pause-circle-outline" size={40}/>) }
                    </TouchableOpacity>
                    <Text>{millisecondsToHuman(Math.ceil(currentTime))}</Text>
                    <Slider
                        style={{flex: 3}} 
                        minimumValue={0} 
                        maximumValue={100}
                        value={value}
                        onValueChange={this.seekPlay}
                    />
                    <Text>{millisecondsToHuman(Math.ceil(duration))}</Text>
            </View>
        );
    }
}