const colorCSSToRGB = (colorKeyword) => {

    // CREATE TEMPORARY ELEMENT
    let el = document.createElement('div');
  
    // APPLY COLOR TO TEMPORARY ELEMENT
    el.style.color = colorKeyword;
  
    // APPEND TEMPORARY ELEMENT
    document.body.appendChild(el);
  
    // RESOLVE COLOR AS RGB() VALUE
    let rgbValue = window.getComputedStyle(el).color;
    
    // REMOVE TEMPORARY ELEMENT
    document.body.removeChild(el);
  
    return rgbValue;

}

const parseRgbValue = (rgbString) => {
  const rgba = rgbString.match(/rgba?\((.*)\)/)[1].split(',').map(Number);
  const red = rgba[0];
  const green = rgba[1];
  const blue = rgba[2];
  return {
      red: red,
      green: green,
      blue: blue
  }
}

const getCombinedValue = (bgcolor) => {
  const rgba = colorCSSToRGB(bgcolor);
  const colorObj = parseRgbValue(rgba);
  const value = 0.2126 * colorObj.red + 0.7152 * colorObj.green + 0.0722 * colorObj.blue;
  return value;
}

const getTextForeground = (bgcolor) => {
  const value = getCombinedValue(bgcolor);
  return (value > 135) ? "black" : "white";
}

const getIconForeground = (bgcolor) => {
  const value = getCombinedValue(bgcolor);
  return (value > 190) ? "black" : "white";
}

const getTextClassName = (bgcolor) => {
  const value = getCombinedValue(bgcolor);
  return (value > 135) ? "elastic-flow-node-label-text text-black" : "elastic-flow-node-label-text text-white";
}

const getIconClassName = (bgcolor) => {
  const value = getCombinedValue(bgcolor);
  return (value > 180) ? "elastic-flow-node-icon icon-black" : "elastic-flow-node-icon icon-white";
}

const colorUtils = {
  getIconForeground: getIconForeground,
  getTextForeground: getTextForeground,
  getIconClassName: getIconClassName,
  getTextClassName: getTextClassName
}

export default colorUtils 