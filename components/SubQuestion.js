import React, {useState} from "react";
import {Text} from "react-native";
import Html from "react-native-render-html";

import RoundedPanel from "./RoundedPanel";
import RadioButton from "./RadioButton";

import globalStyles from "../styles";

const defaultRadioState = ['uncheck', 'uncheck', 'uncheck', 'uncheck'];

export default function SubQuestion({ data, onValueChange, mode }){

    function checkRight(radioState, choice, answer){
        radioState[answer] = "right";
        if (choice > -1 && choice !== answer) radioState[choice] = "wrong";
    }

    const {sentence, index, indexOfTest, choices, response, answer, hint} = data;
    
    const prevRadioState = [...defaultRadioState];

    if(response > -1){
        prevRadioState[response] = 'checked';
        if(mode === 'practice'){
            checkRight(prevRadioState, response, answer)
        }
    }

    if(mode === 'review' || mode === 'check' ){
        checkRight(prevRadioState, response, answer);
    }

    const [radioState, setRadioState] = useState(prevRadioState);

    function handleValueChange(choice){

        if(radioState.some(item => item !== 'uncheck') && mode !== 'test') return;
    
        const tmpRadioState = [...defaultRadioState];
        tmpRadioState[choice] = "checked";

        if(mode === 'practice'){
            checkRight(tmpRadioState, choice, answer);
        }

        setRadioState(tmpRadioState);

        onValueChange(choice);
    }

    return (
        <RoundedPanel>
            <Text selectable={true} style={globalStyles.text}>
                { (indexOfTest + index + ". ").padStart(4, "0") }
            </Text>
            { 
                sentence && <Html textSelectable={true} baseFontStyle={globalStyles.text} html={sentence}/>
            }
            { choices.map((choice, index) => {
                return <RadioButton 
                            key={index + "" + indexOfTest} 
                            value={index} text={choice}
                            state={radioState[index]}
                            onValueChange={handleValueChange}
                        />
            }) }
            { (mode === 'review' && response === -1) 
              && <Text style={[globalStyles.smallText, {marginTop: 5}]}>Bạn chưa làm câu này</Text>}

            { (radioState.some(state => ['wrong', 'right'].indexOf(state) > -1) && hint) && <Html textSelectable={true} html={hint}/>}
        </RoundedPanel>
    );

}
