import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "*": {
        "boxSizing": "border-box"
    },
    "body": {
        "backgroundColor": "#fafafa",
        "fontFamily": "Roboto,sans-serif",
        "fontSmoothing": "antialiased",
        "WebkitFontSmoothing": "antialiased",
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0,
        "minHeight": "100%",
        "paddingTop": 0,
        "paddingRight": 0,
        "paddingBottom": 0,
        "paddingLeft": 0,
        "textRendering": "optimizeLegibility"
    },
    "mui-icon": {
        "fontFamily": "'material-ui-icons'",
        "speak": "none",
        "fontStyle": "normal",
        "fontWeight": "normal",
        "fontVariant": "normal",
        "textTransform": "none",
        "lineHeight": 1,
        "WebkitFontSmoothing": "antialiased",
        "MozOsxFontSmoothing": "grayscale"
    },
    "mui-icongithub": {
        "position": "absolute",
        "paddingTop": 10,
        "paddingRight": 10,
        "paddingBottom": 10,
        "paddingLeft": 10,
        "fontSize": 42,
        "right": 0,
        "top": 0,
        "textDecoration": "none",
        "color": "rgba(255,255,255,.83)",
        "transitionDuration": ".3s"
    },
    "mui-icongithub:hover": {
        "color": "#fff"
    },
    "mui-icongithub:before": {
        "content": "\\e625"
    },
    "page__title": {
        "backgroundColor": "#fb8c00",
        "color": "#fff",
        "paddingTop": 32,
        "paddingRight": 16,
        "paddingBottom": 16,
        "paddingLeft": 16
    },
    "page__title-main": {
        "position": "relative",
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0,
        "fontWeight": "400",
        "fontSize": 56,
        "verticalAlign": "baseline"
    },
    "page__title-desc": {
        "fontStyle": "italic"
    },
    "card": {
        "boxShadow": "rgba(0, 0, 0, 0.117647) 0 1px 6px, rgba(0, 0, 0, 0.117647) 0 1px 4px",
        "width": "50%",
        "marginTop": 10,
        "marginRight": 10,
        "marginBottom": 10,
        "marginLeft": 10,
        "backgroundColor": "#fff"
    },
    "card__head": {
        "paddingTop": 16,
        "paddingRight": 16,
        "paddingBottom": 0,
        "paddingLeft": 16
    },
    "card__title": {
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0,
        "fontWeight": "500",
        "fontSize": 20
    },
    "card__conent": {
        "paddingTop": 16,
        "paddingRight": 16,
        "paddingBottom": 16,
        "paddingLeft": 16
    }
});