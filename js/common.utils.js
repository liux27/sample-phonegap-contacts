/*
 * Copyright (c) 2012, Intel Corporation. All rights reserved.
 * File revision: 04 October 2012
 * Please see http://software.intel.com/html5/license/samples 
 * and the included README.md file for license terms and conditions.
 */

// Checks whether the string is null or blank
function isEmptyOrBlank(str) {
    
    return (!str || /^\s*$/.test(str));
}

// Retrieves the HTML DOM element by the element id or returns the element if the element itself was sent to the function. 
function getElement(element) {
    
    if(typeof(element) == "string") {
    
        element = document.getElementById(element);
    }
    return element;
}

// Gets all element's 1st order children which have the particular tagName
function getElementChildren(element, tag) {
    
    if (!element) {
        return null;
    }
    
    var children = element.childNodes;
    if (!tag) {
        return children;
    }
    var res = [];
    for (var i = 0; i < children.length; i++) {
        if (children[i].tagName && (children[i].tagName.toLowerCase() == tag.toLowerCase())) {
            res.push(children[i]);
        }
    }
    return res;
}

// Cancels the event bubbling 
function cancelEventBubbling(e) {
                
    if (!!e.stopPropagation) {
        e.stopPropagation();
    }
                
    if (!!e.preventDefault) {
        e.preventDefault();
    }
                
    e.cancelBubble = true;
    e.cancel = true;
    e.returnValue = false;

    return false;
}