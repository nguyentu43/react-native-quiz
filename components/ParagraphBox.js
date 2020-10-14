import React from "react";
import {Text, ScrollView} from "react-native";
import Html from "react-native-render-html";

import RoundedPanel from "./RoundedPanel";
import globalStyles from "../styles";

export default function ParagraphBox({paragraphs, onClickLink}){

    return (
            <Html
                textSelectable={true}
                baseFontStyle={globalStyles.text}
                html={paragraphs}
                onLinkPress={onClickLink}
            />
    );
}