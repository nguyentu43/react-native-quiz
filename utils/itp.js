export function scaleScore(section, score){
    const scaleArray = [
        [24, 25, 26, 27, 28, 28, 29, 30, 31, 32, 33, 33, 36, 37, 39, 40, 41, 42, 43, 44, 44, 45, 46, 46, 46, 47, 47, 48, 49, 49, 49, 50, 50, 51, 52, 52, 52, 53, 54, 54, 55, 56, 56, 57, 58, 59, 60, 62, 64, 67, 68], 
        [20, 21, 22, 23, 24, 25, 26, 27, 29, 32, 34, 36, 38, 39, 40, 42, 43, 44, 45, 46, 47, 48, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 63, 66, 68, 68, 68], 
        [
        20, 21, 22, 23, 23, 24, 25, 26, 27, 28, 29, 29, 31, 34, 35, 37, 38, 40, 41, 42, 43, 44, 45, 46, 47, 48, 48, 49, 50, 50, 51, 52, 52, 53, 54, 54, 55, 56, 56, 57, 58, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67
        ]
    ];

    return scaleArray[section - 1][score];
}

export function calTotalScore(sections){
    return Math.round(sections.reduce((prev, score) => prev + score * 10, 0) / 3);
}

export function changeToCefr(score){

    if(score >= 650) return 'C2';
    if(score >= 590) return 'C1';
    if(score >= 500) return 'B2';
    if(score >= 450) return 'B1';
    if(score >= 360) return 'A2';
    return 'A1';
}