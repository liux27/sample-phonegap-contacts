/*
 * Copyright (c) 2012, Intel Corporation. All rights reserved.
 * File revision: 04 October 2012
 * Please see http://software.intel.com/html5/license/samples 
 * and the included README.md file for license terms and conditions.
 */

// Sorting preferenses "enumeration"
var SortPref = {
    ASC : 0,
    DESC : 1,
};

// Display preferenses "enumeration"
var DispPref = {
    NAME_FIRST : 0,
    SURN_FIRST : 1,
};

// List of redused representations of contacts, which are to be displayable in a contacts list
function DisplayableContactList(contListContainer) {
    
    contListContainer = getElement(contListContainer);
    if (contListContainer === null) {
        
        return null;
    }
    
    var sortPref = SortPref.ASC;
    var dispPref = DispPref.NAME_FIRST;
    
    // Queries device contact database and redraws contacts list
    this.updateList = function(filter, filterField, additionalFieldsArray) {
        contListContainer.innerHTML = "";
        
        var contactFields = ["id", "name", "photos"];
        if (additionalFieldsArray) {
            
            for (var i = 0; i < additionalFieldsArray.length; i++) {
            
                contactFields.push(additionalFieldsArray[i]);
            }
        }
        var contactFindOptions = new ContactFindOptions();
        contactFindOptions.filter = filter ? filter : "";
        contactFindOptions.multiple = true;
        navigator.contacts.find(contactFields, contactSuccess, contactError, contactFindOptions);
        
        function contactSuccess(contacts) {
            var cArr = formContactList(contacts, filter, filterField);
            cArr = sortContactsList(cArr);
            drawListContent(cArr, "");
        }
        
        function contactError() {
        
            alert("Application can not access the device contact database to update the list of contacts");
        }
    }
    
    // Adds the list of contacts to the page. Contacts, not satisfying the filter string, are invisible.
    // If a filter is empty, all contacts are displayed.
    this.drawContactList = function(filter) {
        
        drawListContent(null, filter);
    }
    
    // Sets new contacts sorting preference and redraws contacts list
    this.setSortPref = function(newPref, filter) {
    
        if (((newPref === 0) || (newPref === 1)) && (newPref != sortPref)) {
            sortPref = newPref;
            drawListContent(sortContactsList(), filter);
        }
    }
    
    // Sets new contacts display preference and redraws contacts list
    this.setDispPref = function(newPref, filter) {
    
        if (((newPref === 0) || (newPref === 1)) && (newPref != dispPref)) {
            dispPref = newPref;
            drawListContent(sortContactsList(applyNewDisplayPrefs()), filter);
        }
    }
    
    // Swaps contact's family name and given name according to the current display preference
    function applyNewDisplayPrefs() {
        
        var contactList = getElementChildren(contListContainer);
        if (!contactList) {
            return null;
        }
        
        var contactListArray = [];
        
        for (var k = 0; k < contactList.length; k++) {
        
            if (!contactList[k]) {
                continue;
            }
            
            var item = $(contactList[k]).clone(true, true)[0];
            var childNodes = item.getElementsByTagName("div");
            var res = "";
            
            if (childNodes) {
                
                for (var i = 0; i < childNodes.length; i++) {
                
                    if (childNodes[i].className == "contactInfo") {
                    
                        var contactInfoItems = childNodes[i].getElementsByTagName("span");
                        var gName = null; 
                        var fName = null;
                        
                        if (contactInfoItems !== null) {
                            
                            for (var j = 0; j < contactInfoItems.length; j++) {
                            
                                if (contactInfoItems[j].className == "gName") {
                                    
                                    gName = $.trim(contactInfoItems[j].innerHTML);
                                }
                                
                                if (contactInfoItems[j].className == "fName") {
                                    
                                    fName = $.trim(contactInfoItems[j].innerHTML);
                                }
                                
                                if (gName && fName) {
                                    
                                    break;
                                }
                            }
                        }
                        
                        if (isEmptyOrBlank(gName)) {
        
                            if (isEmptyOrBlank(fName)) {
                                
                                childNodes[i].innerHTML = "<span class='gName'>Unknown</span>";
                            
                            } else {
                            
                                childNodes[i].innerHTML = "<span class='fName'>" + fName + "</span>";
                            }
                            
                        } else if (isEmptyOrBlank(fName)) {
                            
                            childNodes[i].innerHTML = "<span class='gName'>" + gName + "</span>";
                        
                        } else {
                        
                            if (dispPref === DispPref.NAME_FIRST) {
                                childNodes[i].innerHTML = "<span class='gName'>" + gName + "</span> <span class='fName'>" + fName + "</span>";
                            
                            } else {
                                childNodes[i].innerHTML = "<span class='fName'>" + fName + "</span> <span class='gName'>" + gName + "</span>";
                            }
                        }
                        
                        break;
                    }
                }
            }
            
            contactListArray.push(item);
        }
        return contactListArray;
    }
    
    // Returns an array of contact item elements (HTML strings) to display. Contacts to display are filtered 
    // by the filterField: a contact satisfies the filter if the filter is a substring of the field.
    function formContactList(contacts, filter, filterField) {
        
        contListContainer.innerHTML = "";
        
        if (!contacts) {
            return null;
        }
        
        var contactListArray = [];
        for (var i = 0; i < contacts.length; i++) {
            if(!checkFilter(contacts[i], filter, filterField)) {
                continue;
            }
            
            var cName = buildDisplayName(contacts[i]);
            
            var cPhoto;
            if ((contacts[i].photos) && (contacts[i].photos.length > 0) && !isEmptyOrBlank(contacts[i].photos[0].value) && (contacts[i].photos[0].value.indexOf("//:0") === -1)) {
                cPhoto = contacts[i].photos[0].value;
            } else {
                cPhoto = "resources/nophoto.jpg";
            }
            // Without the following string the contact avatar in the contact list would not be refreshed
            // because of caching (but it prevents displaying pictures in the Emulator). 
            // Comment the following line to see contact list avatars in Emulator.
            cPhoto += "?" + Math.random()*10000000000000000;
            
            var cID = (contacts[i].id) ? contacts[i].id : "none";
            var cSearchCriteria = getSearchCriteria(contacts[i]);
                
            var cBox = "<div class='ui-body ui-body-b' style='display: none;' onclick='showInfo(" + '"' + cID + '"' + ", " + '"' + cSearchCriteria + '"' + ")'>" +
                            "<div class='contactImage'>" +
                                "<img src='" + cPhoto + "' width='50' height='50' />" +
                            "</div>" +
                            "<div class='contactInfo'>" + cName + "</div>" + 
                        "</div>";
            contactListArray.push(cBox);
        }
        
        return contactListArray;
    }
    
    // Sorts contact elements by contact name
    function sortContactsList(contactListArray) {
        
        if (!contactListArray) {
            var contactList = getElementChildren(contListContainer);
            contactListArray = Array.prototype.slice.call(contactList, 0);
        }
        
        if ((contactListArray != null) && (contactListArray.length > 1)) {
            contactListArray.sort(sortScheme);
        }   
        
        return contactListArray;
        
        function sortScheme(a, b) {
            
            var aName = getDisplayedName(a).toLowerCase();
            var bName = getDisplayedName(b).toLowerCase();
            var res = (aName < bName) ? -1 : (aName > bName) ? 1 : 0;
            
            if (sortPref === SortPref.DESC) {
                res = res * -1;
            }
            
            return res;
        }
    }
    
    // Adds the list of contacts to the page. Contacts, not satisfying the filter string, are invisible.
    // If a filter is empty, all contacts are displayed.
    function drawListContent(contactListArray, filter) {
        
        var contactList;
        if (contactListArray) {
            contListContainer.innerHTML = "";
            
            for (var i = 0; i < contactListArray.length; i++) {
            
                if (typeof(contactListArray[i]) == "string") {
                    contListContainer.innerHTML += contactListArray[i];
                
                } else {
                    contListContainer.appendChild(contactListArray[i]);
                }
            }
        }
        contactList = getElementChildren(contListContainer);
        
        if (!contactList || (contactList.length === 0) || (contListContainer.innerHTML === "<p>No contacts found.</p>")) {
            contListContainer.innerHTML = "<p>No contacts found.</p>";
            return;
        }
        
        for (var i = 0; i < contactList.length; i++) {
            
            if (isEmptyOrBlank(filter)) {
                contactList[i].style.display = "block";
            
            } else {
            
                filter = filter.toLowerCase();
                var name = getDisplayedName(contactList[i]).toLowerCase().split(" ");
                if ((!name) || (name.length <= 0)) {
                    contactList[i].style.display = "none";
                
                } else {
                    
                    for (var j = 0; j < name.length; j++) {
                    
                        if (name[j].indexOf(filter) === 0) {
                            
                            contactList[i].style.display = "block";
                            break;
                        
                        } else {
                        
                            if (j === (name.length - 1)) {
                            
                                contactList[i].style.display = "none";
                            }
                        }
                    }
                }
            }
        }
    }
    
    // Gets the contact name displayed (the word order is preserved)
    function getDisplayedName(contactSection) {
        
        if (contactSection === null) {
            return null;
        }
        
        if (typeof(contactSection) == "string") {
            var div = document.createElement('div');
            div.innerHTML = contactSection;
            contactSection = div.firstChild;
        }
        
        var childNodes = contactSection.getElementsByTagName("div");
        var res = "";
        
        if (childNodes !== null) {
            
            for (var i = 0; i < childNodes.length; i++) {
            
                if (childNodes[i].className == "contactInfo") {
                    
                    var contactInfoItems = childNodes[i].getElementsByTagName("span");
                    
                    if (contactInfoItems !== null) {
                        
                        for (var j = 0; j < contactInfoItems.length; j++) {
                        
                            if ((contactInfoItems[j].className == "gName") || (contactInfoItems[j].className == "fName")) {
                                
                                res += $.trim(contactInfoItems[j].innerHTML) + " ";
                            }
                        }
                    }
                    break;
                }
            }
        }
        
        if (isEmptyOrBlank(res)) {
        
            return "Unknown";
            
        } else {
        
            return $.trim(res);
        }
    }
    
    // Returns the contact name to display satisfying the display criteria
    function buildDisplayName(contact) {
        
        if (contact === null) {
            
            return "<span class='gName'>Unknown</span>";
        }
        
        var name = contact.name;
        if (name === null) {
            
            return "<span class='gName'>Unknown</span>";
        }
        
        var givenName = name.givenName;
        var familyName = name.familyName;
        
        if (isEmptyOrBlank(givenName)) {
        
            if (isEmptyOrBlank(familyName)) {
                
                if (!isEmptyOrBlank(contact.name.formatted)) {
                
                    return "<span class='gName'>" + contact.name.formatted + "</span>";
                
                } else {
                    return "<span class='gName'>Unknown</span>";
                }
            
            } else {
            
                return "<span class='fName'>" + familyName + "</span>";
            }
        } else {
        
            if (isEmptyOrBlank(familyName)) {
            
                return "<span class='gName'>" + givenName + "</span>";
            }
        }
        
        if (dispPref === DispPref.NAME_FIRST) {
            
            return "<span class='gName'>" + givenName + "</span> <span class='fName'>" + familyName + "</span>";
        
        } else {
            
            return "<span class='fName'>" + familyName + "</span> <span class='gName'>" + givenName + "</span>";
        }
    }

    // Returns the sting which is to be used as a search criteria on contact info showing.
    // The first preference is a family name, the second is name, the third is contact id.
    function getSearchCriteria(contact) {
        
        if (!contact) {
            return "";
        }
        
        var name = contact.name;
        if (name) {
        
            if (!isEmptyOrBlank(name.familyName)) {
                return name.familyName;
            } else if (!isEmptyOrBlank(name.givenName)) {
                return name.givenName;
            } else if (!isEmptyOrBlank(name.formatted)) {
                return name.formatted;
            } else {
                return "";
            }
        } else {
            if (contact.id) {
                return contact.id;
            } else {
                return "";
            }
        }
    }
    
    // Checks whether the filter string is a substring of the contact field filterField.
    function checkFilter(contact, filter, filterField) {
        
        if (!contact) {
            return false;
        }
        
        if (isEmptyOrBlank(filter) && isEmptyOrBlank(filterField)) {
            
            return true;
        }

        filter = filter.toLowerCase();
        
        switch(filterField) {
            
            case "name":
                if (!contact.name) {
                    return false;
                }
                var val = (contact.name.familyName + " " + contact.name.givenName + " " + 
                          contact.name.middleName + " " + contact.name.honorificPrefix + " " + 
                          contact.name.honorificSuffix).toLowerCase();
                if (val.indexOf(filter) != -1) {
                    return true;
                } else {
                    return false;
                }
                
            case "nickname":
                if (!contact.nickname) {
                    return false;
                }
                var val = contact.nickname.toLowerCase();
                if (val.indexOf(filter) != -1) {
                    return true;
                } else {
                    return false;
                }
                
            case "phoneNumbers": case "emails": case "ims": case "urls": 
                var contactFieldArray = contact[filterField];
                for (var i = 0; i < contactFieldArray.length; i++) {
                    if (!contactFieldArray[i] || !contactFieldArray[i].value) {
                        continue;
                    }
                    var val = contactFieldArray[i].value.toLowerCase();
                    if (val.indexOf(filter) != -1) {
                        return true;
                    }
                }
                return false;
            
            case "addresses":
                var contactAddrs = contact.addresses;
                for (var i = 0; i < contactAddrs.length; i++) {
                    val = (contactAddrs[i].streetAddress + " " + contactAddrs[i].locality + " " + contactAddrs[i].region + " " + 
                              contactAddrs[i].postalCode + " " + contactAddrs[i].country).toLowerCase();
                    if (val.indexOf(filter) != -1) {
                        return true;
                    }
                }
                return false;
                
            case "organizations":
                var contactOrgs = contact.organizations;
                for (var i = 0; i < contactOrgs.length; i++) {
                    val = (contactOrgs[i].name + " " + contactOrgs[i].department + " " + contactOrgs[i].title).toLowerCase();
                    if (val.indexOf(filter) != -1) {
                        return true;
                    }
                }
                return false;
            
            default:
                return true;
        }
    }
}