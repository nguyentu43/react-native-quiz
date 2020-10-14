import React from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";

import RoundedPanel from "../components/RoundedPanel";
import RoundedButton from "../components/RoundedButton";

import globalStyles from "../styles";

export default class Home extends React.Component{

    menuItems = [
        { title: "Đề thi", navigation: "test-list", backgroundColor: "#00699b", iconName: "newspaper-outline" },
        { title: "Kết quả", navigation: "result-list", backgroundColor: "#00ca65", iconName: "bar-chart-outline" },
        { title: "Câu đánh dấu", navigation: "question-list", params: {mode: 'pinned'}, backgroundColor: "#ff8040", iconName: "star-outline" },
        { title: "Câu bị sai", navigation: "question-list", params: {mode: 'wrong'}, backgroundColor: "#ff4242", iconName: "close-circle-outline" },
        { title: "Từ vựng", navigation: "voca-list", backgroundColor: "#008080", iconName: "book-outline" }
    ];

    handleMoveTo = ({navigation, params = {}}) => {
        this.props.navigation.navigate(navigation, params);
    }

    renderItems = () => {

        return this.menuItems.map((item, index) => {
            return (
                <RoundedButton
                    key={index}
                    title={item.title}
                    iconName={item.iconName}
                    style={{
                        backgroundColor: item.backgroundColor, 
                        flexBasis: '48%', 
                        marginTop: 10 }}
                    onPress={() => this.handleMoveTo(item)}
                />
            );
        });
    }

    render(){

        return (
            <SafeAreaView style={globalStyles.container}>
                <RoundedPanel>
                    <Text style={globalStyles.textH1}>TOEFL ITP</Text>
                </RoundedPanel>
                <ScrollView contentContainerStyle={[globalStyles.flexRow, {justifyContent: 'space-between'}]}>
                    { this.renderItems() }
                </ScrollView>
            </SafeAreaView>
        );
    }
}