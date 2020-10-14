import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
    container: {
        margin: 10,
        flex: 1
    },
    modal: {
        backgroundColor: '#e1e1e1',
        flex: 1,
        padding: 10
    },
    textH1: {
        fontSize: 35,
        fontWeight: 'bold',
        lineHeight: 40
    },
    textH2: {
        fontSize: 25,
        lineHeight: 35
    },
    textH3: {
        fontSize: 20,
        lineHeight: 35
    },
    text: {
        fontSize: 17,
        lineHeight: 28
    },
    smallText: {
        fontSize: 12,
        lineHeight: 18
    },
    flexRow: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
});

export default styles;