import {fontFamilies} from "../constants/fonts";

export const getFontFamily = (
    isLTR: boolean,
    weight: "normal" | "medium" | "bold",
) => {
    const selectedFontFamily = isLTR
        ? fontFamilies.MONTSERRAT
        : fontFamilies.RUBIK;
    return selectedFontFamily[weight];
};