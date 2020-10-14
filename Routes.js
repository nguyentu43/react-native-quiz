import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "./screens/Home";
import TestList from "./screens/TestList";
import QuestionList from "./screens/QuestionList";
import ResponseQuestion from "./screens/ResponseQuestion";
import ResultList from "./screens/ResultList";
import VocaList from "./screens/VocaList";
import LearningVoca from "./screens/LearningVoca";
import PracticeVoca from "./screens/PracticeVoca";

const RootStack = createStackNavigator();

export default class Routes extends React.Component{
    render(){

        const theme = {
            dark: false,
            colors: {
                background: '#e1e1e1',
                card: 'white'
            }
        }

        return (
            <NavigationContainer theme={theme}>
                <RootStack.Navigator>
                    <RootStack.Screen name="home" component={Home} options={{ headerShown: false }}/>
                    <RootStack.Screen name="response" component={ResponseQuestion} options={{ headerShown: false}}/>
                    <RootStack.Screen name="result-list" component={ResultList} options={{ title: "Result List" }}/>
                    <RootStack.Screen name="test-list" component={TestList} options={{ title: "Test List" }}/>
                    <RootStack.Screen name="question-list" component={QuestionList} options={{ title: "Question List" }}/>
                    <RootStack.Screen name="voca-list" component={VocaList} options={{ title: "Voca List" }}/>
                    <RootStack.Screen name="learning-voca" component={LearningVoca} options={{ title: "Learning Voca" }}/>
                    <RootStack.Screen name="practice-voca" component={PracticeVoca} options={{ title: "Practice Voca" }}/>
                </RootStack.Navigator>
            </NavigationContainer>
        );
    }
}