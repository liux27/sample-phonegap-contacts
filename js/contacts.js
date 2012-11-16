/*
 * Copyright (c) 2012, Intel Corporation. All rights reserved.
 * File revision: 04 October 2012
 * Please see http://software.intel.com/html5/license/samples 
 * and the included README.md file for license terms and conditions.
 */

var contactForm;
var displContactList;
var activeContact;
var backpressed = false;

// Called on bodyLoad 
function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
    $("#searchby_chooser_ok_button").bind ("click", searchByCriteria); 
    
    if (typeof Contact === "undefined") {
        getElement("contacts_list").innerHTML = "<p>The Cordova Contacts API is inaccessible</p>";
    }
}

// Called when Cordova is fully loaded (and calling to Cordova functions has become safe)
function onDeviceReady() {
    
    // Overwrites the default behavior of the device back button
    document.addEventListener("backbutton", onBackPress, false);
    
    displContactList = new DisplayableContactList("contacts_list");
    displContactList.updateList();
    contactForm = new ContactForm();
    
    // Bind application button elements with their functionality
    $("#edit_contact_button").bind ("click", onEditContact);
    $("#new_contact_ok_nav").bind ("click", onSaveContact);
    
    $("#new_contact_cancel_button").bind ("click", function() { window.history.back(); });
    $("#new_contact_cancel_nav").bind ("click", function() { window.history.back(); });
    
    $("#remove_ok_button").bind ("click", onRemoveContact); 
    
    $("#clone_contact_button").bind ("click", onSaveContactCopy); 
    
    $("#exit_popup").bind ("popupafterclose", function() { backpressed = false }); 
    
    $("#item_chooser_ok_button").bind ("click", function() { 
                                                               $(".ui-dialog").dialog("close");
                                                               var addVal = getElement("item_chooser_input").options[getElement("item_chooser_input").selectedIndex].value;
                                                               contactForm.addItem(addVal); 
                                                           });

    $("#search-input").bind ("change", function(event, ui) { 
                                                      var filter = $("#search-input").val();
                                                      if (!filter) {
                                                          filter = "";
                                                      }
                                                      displContactList.drawContactList(filter); 
                                                  });
                                                  
    $("#cont_list_page").live('pageshow', function(event, ui){
                                                                 activeContact = null;
                                                             });
}

// Called for a new contact creation
function onNewContact(e) {
    
    if (typeof Contact !== "undefined") {
        
        contactForm.buildContactForm(null);  
        $.mobile.changePage("#edit_contact_page", { transition: "pop" });
    }
    collapse(e, "new_contact_button");
    $("#options_popup").popup("close");
    return cancelEventBubbling(e);
}

// Called for an existing contact editing 
function onEditContact(e) {
    contactForm.buildContactForm(activeContact);  
    $.mobile.changePage("#edit_contact_page", { transition: "pop" });
}

// Called for an existing contact removing 
function onRemoveContact(e) {

    activeContact.remove(onSuccess, onError);
    
    function onSuccess() {
        alert("The contact was successfully removed");
        displContactList.updateList();
        $.mobile.changePage("#cont_list_page", { transition: "pop" }); 
    };

    function onError(contactError) {
        alert("Cannot remove contact: error " + contactError.code);
        $.mobile.changePage("#cont_info_page", { transition: "pop" }); 
    };
}

// Called for an existing contact duplication
function onSaveContactCopy(e) {
    
    $("#cont_options_popup").popup("close");
    var newContact = activeContact.clone();
    newContact.save(onSuccess, onError);
    
    function onSuccess(contact) {
        alert("The contact duplicate " + buildDisplayName(contact) + " was successfully created");
        displContactList.updateList();
    };

    function onError(contactError) {
        alert("The contact cannot be duplicated. Error: " + contactError.code);
    };
}

// Called for saving a contact having been edited
function onSaveContact(e) {
    
    var toSave;
    if (activeContact) {
        toSave = activeContact;
    } else {
        toSave = navigator.contacts.create();
    }
    
    // name saving:
    initName();
    
    // nickname saving:
    toSave.nickname = contactForm.getNickname();
    
    // phones saving:
    initContactFieldVals("phoneNumbers", contactForm.getPhoneNumbers());
    
    // emails saving:
    initContactFieldVals("emails", contactForm.getEmails());
    
    // ims saving:
    initContactFieldVals("ims", contactForm.getIMs());
    
    // urls saving:
    initContactFieldVals("urls", contactForm.getURLs());
    
    // addresses saving:
    initContactFieldVals("addresses", contactForm.getAddresses());
    
    // organizations saving:
    initContactFieldVals("organizations", contactForm.getOrganizations());
    
    // note saving:
    var note = contactForm.getNote();
    if (!isEmptyOrBlank(note)) {
        toSave.note = note;
    }
    
    // photo saving:
    initContactFieldVals("photos", contactForm.getPhotos());
        
    toSave.save(onSuccess,onError);
    
    function onSuccess(contact) {
        alert("The contact was successfully saved");
        displContactList.updateList();
        $.mobile.changePage("#cont_list_page", { transition: "pop" });
    };

    function onError(contactError) {
        alert("The contact cannot be saved: error: " + contactError.code);
    };
    
    function initName() {
        
        if (!toSave.name) {
            toSave.name = new ContactName();
        }
        var nameData = contactForm.getNames();
        toSave.name.givenName = nameData.givenName;
        toSave.name.familyName = nameData.familyName;
        toSave.name.middleName = nameData.middleName;
        toSave.name.honorificPrefix = nameData.honorificPrefix;
        toSave.name.honorificSuffix = nameData.honorificSuffix;
    };
    
    function initContactFieldVals(contactFieldName, contactFieldValsArray) {
    
        if (!toSave[contactFieldName] && (contactFieldValsArray.length > 0)) {
            toSave[contactFieldName] = [];
        } 
        for (var i = 0; i < contactFieldValsArray.length; i++) {
            if (!toSave[contactFieldName][i]) {
                if (contactFieldName == "addresses") {
                    toSave[contactFieldName][i] = new ContactAddress();
                } else if (contactFieldName == "organizations") {
                    toSave[contactFieldName][i] = new ContactOrganization();
                } else {
                    toSave[contactFieldName][i] = new ContactField();
                }
            }
            for (var key in contactFieldValsArray[i]) {
                toSave[contactFieldName][i][key] = contactFieldValsArray[i][key];
            }
        }
        if (toSave[contactFieldName]) {
            for (var i = contactFieldValsArray.length; i < toSave[contactFieldName].length; i++) {
                if (toSave[contactFieldName][i]) {
                    for (var key in toSave[contactFieldName][i]) {
                        if (key.toLowerCase() != "id") {
                            toSave[contactFieldName][i][key] = "";
                        }
                    }
                }
            }
        }
    };
}

// Opens an "Advanced search" page
function openSearchChooser(e) {

    $.mobile.changePage("#searchby_chooser_page", { transition : "pop" });
    collapse(e, "search_chooser_button");
    return cancelEventBubbling(e);
}

// Shows the list of contacts satisfying the advanced search criteria input
function searchByCriteria() {
    
    $.mobile.changePage("#cont_list_page", { transition : "pop" });
    if (typeof Contact !== "undefined") {
        var searchCriteria = getElement("searchby_chooser_input").options[getElement("searchby_chooser_input").selectedIndex].value;
        var searchVal = getElement("search_val_input").value;
        getElement("search_val_input").value = "";
        
        var addF = [];
        addF.push(searchCriteria);
        displContactList.updateList(searchVal, searchCriteria, addF);
        
        var div = getElement("full_list_button_container");
        if (div) {
            div.innerHTML = '<a href="#" id="full_list_button" data-role="button" data-mini="true" class="ui-btn-left" data-theme="c" >Show full list</a>';
            $("#full_list_button").bind("click", function() { displContactList.updateList(); div.innerHTML = ""; });
            $("#full_list_button").button();
        }
    }
}

// Sets contact list sorting preferences
function setSortPref(newPref) {
    
    var filter = $("#search-input").val();
    if (!filter) {
        filter = "";
    }
    
    displContactList.setSortPref(newPref, filter);
}

// Sets contact list display preferences
function setDisplPref(newPref) {
    
    var filter = $("#search-input").val();
    if (!filter) {
        filter = "";
    }
    
    displContactList.setDispPref(newPref, filter);
}

// Forms the "Contact information" page
function showInfo(contactID, searchCriteria) {
    
    var contInfoContainer = getElement("contact_info");
    var contactFields = ["*"];
    var contactFindOptions = new ContactFindOptions();
    contactFindOptions.filter = searchCriteria;
    contactFindOptions.multiple = true;
    navigator.contacts.find(contactFields, contactSuccess, contactError, contactFindOptions);
    
    function contactSuccess(contacts) {
        
        contInfoContainer.innerHTML = "";
        for (var i = 0; i < contacts.length; i++) {
            
            if (contacts[i].id == contactID) {
                
                activeContact = contacts[i];
        
                var cNameSection = "<div class='contactInfo'>" +
                                        "<div>" + buildDisplayName(contacts[i]) + "</div>" +
                                        "<div>" + (!isEmptyOrBlank(contacts[i].nickname) ?  ('"' + contacts[i].nickname + '"') : "") + "</div>" +
                                    "</div>";
                
                var cPhotoSection = "<div class='contactImage'>" +
                                        "<img src='" + 
                                        ((contacts[i].photos && (contacts[i].photos.length > 0) && !isEmptyOrBlank(contacts[i].photos[0].value) && (contacts[i].photos[0].value.indexOf("//:0") === -1)) 
                                            ? contacts[i].photos[0].value 
                                            : "resources/nophoto.jpg") + 
                                        "' width='50' height='50' />" +
                                    "</div>";
                
                var cPhoneNumbersSection = "";
                if (contacts[i].phoneNumbers && (contacts[i].phoneNumbers.length > 0)) {
                    
                    var cPhoneNumbersSectionHeader = "<div class='iSectionTitle'>Phone Numbers</div>";
                    var cPhoneNumbersSectionContent = "";
                    for (var j = 0; j < contacts[i].phoneNumbers.length; j++) {
                        if (contacts[i].phoneNumbers[j] && !isEmptyOrBlank(contacts[i].phoneNumbers[j].value)) {
                            cPhoneNumbersSectionContent += "<div class='iSectionItem'>" +
                                                        "<div class='iItemType'>" + contacts[i].phoneNumbers[j].type + "</div>" +
                                                        "<div class='iItemValue'>" + contacts[i].phoneNumbers[j].value + "</div>" +
                                                    "</div>";
                        }
                    }
                    if (!isEmptyOrBlank(cPhoneNumbersSectionContent)) {
                        cPhoneNumbersSection = cPhoneNumbersSectionHeader + cPhoneNumbersSectionContent;
                    }
                }
                
                var cEmailsSection = "";
                if (contacts[i].emails && (contacts[i].emails.length > 0)) {
                    
                    var cEmailsSectionHeader = "<div class='iSectionTitle'>Emails</div>";
                    var cEmailsSectionContent = "";
                    for (var j = 0; j < contacts[i].emails.length; j++) {
                        if (contacts[i].emails[j] && !isEmptyOrBlank(contacts[i].emails[j].value)) {
                        cEmailsSectionContent +=   "<div class='iSectionItem'>" +
                                                "<div class='iItemType'>" + contacts[i].emails[j].type + "</div>" +
                                                "<div class='iItemValue'>" + contacts[i].emails[j].value + "</div>" +
                                            "</div>";
                        }
                    }
                    if (!isEmptyOrBlank(cEmailsSectionContent)) {
                        cEmailsSection = cEmailsSectionHeader + cEmailsSectionContent;
                    }
                }
                
                var cIMsSection = "";
                if (contacts[i].ims && (contacts[i].ims.length > 0)) {
                    
                    var cIMsSectionHeader = "<div class='iSectionTitle'>IMs</div>";
                    var cIMsSectionContent = "";
                    
                    for (var j = 0; j < contacts[i].ims.length; j++) {
                        if (contacts[i].ims[j] && !isEmptyOrBlank(contacts[i].ims[j].value)) {
                            cIMsSectionContent +=  "<div class='iSectionItem'>" +
                                                "<div class='iItemType'>" + contacts[i].ims[j].type + "</div>" +
                                                "<div class='iItemValue'>" + contacts[i].ims[j].value + "</div>" +
                                            "</div>";
                        }
                    }
                    
                    if (!isEmptyOrBlank(cIMsSectionContent)) {
                        cIMsSection = cIMsSectionHeader + cIMsSectionContent;
                    }
                }
                
                var cUrlsSection = "";
                if (contacts[i].urls && (contacts[i].urls.length > 0)) {
                    
                    var cUrlsSectionHeader = "<div class='iSectionTitle'>Urls</div>";
                    var cUrlsSectionContent = "";
                    
                    for (var j = 0; j < contacts[i].urls.length; j++) {
                        if (contacts[i].urls[j] && !isEmptyOrBlank(contacts[i].urls[j].value)) {
                            cUrlsSectionContent +=  "<div class='iSectionItem'>" +
                                                "<div class='iItemType'>" + contacts[i].urls[j].type + "</div>" +
                                                "<div class='iItemValue'>" + contacts[i].urls[j].value + "</div>" +
                                            "</div>";
                        }
                    }
                    if (!isEmptyOrBlank(cUrlsSectionContent)) {
                        cUrlsSection = cUrlsSectionHeader + cUrlsSectionContent;
                    }
                }
                
                var cAddressesSection = "";
                if (contacts[i].addresses && (contacts[i].addresses.length > 0)) {
                    
                    var cAddressesSectionHeader = "<div class='iSectionTitle'>Addresses</div>";
                    var cAddressesSectionContent = "";
                    
                    for (var j = 0; j < contacts[i].addresses.length; j++) {
                        if (contacts[i].addresses[j] && (!isEmptyOrBlank(contacts[i].addresses[j].streetAddress) || !isEmptyOrBlank(contacts[i].addresses[j].locality) ||
                                                            !isEmptyOrBlank(contacts[i].addresses[j].region) || !isEmptyOrBlank(contacts[i].addresses[j].country))) {
                            
                            var atypeSubsection = ((!isEmptyOrBlank(contacts[i].addresses[j].type) && (contacts[i].addresses[j].type != "undefined")) ? ("<div class='iItemType'>" + contacts[i].addresses[j].type + "</div>") : "");
                            var strSubsection = ((!isEmptyOrBlank(contacts[i].addresses[j].streetAddress) && (contacts[i].addresses[j].streetAddress != "undefined")) ? ("<div>" + contacts[i].addresses[j].streetAddress + "</div>") : "");
                            var locSubsection = ((!isEmptyOrBlank(contacts[i].addresses[j].locality) && (contacts[i].addresses[j].locality != "undefined")) ? ("<div>" + contacts[i].addresses[j].locality + "</div>") : "");
                            var regSubsection = ((!isEmptyOrBlank(contacts[i].addresses[j].region) && (contacts[i].addresses[j].region != "undefined")) ? contacts[i].addresses[j].region : "");
                            var postSubsection = ((!isEmptyOrBlank(contacts[i].addresses[j].postalCode) && (contacts[i].addresses[j].postalCode != "undefined")) ? contacts[i].addresses[j].postalCode : "");
                            if (regSubsection != "") {
                                if (postSubsection != "") {
                                    regSubsection += ", ";
                                }
                            }
                            regSubsection += postSubsection;
                            var countrySubsection = ((!isEmptyOrBlank(contacts[i].addresses[j].country) && (contacts[i].addresses[j].country != "undefined")) ? ("<div>" + contacts[i].addresses[j].country + "</div>") : "");
                            
                            cAddressesSectionContent +=    "<div class='iSectionItem'>" +
                                                                atypeSubsection +
                                                                "<div class='iItemValue'>" + 
                                                                    strSubsection +
                                                                    locSubsection +
                                                                    ("<div>" + regSubsection + "</div>") +
                                                                    countrySubsection +
                                                                "</div>" +
                                                            "</div>";
                        }
                    }
                    if (!isEmptyOrBlank(cAddressesSectionContent)) {
                        cAddressesSection = cAddressesSectionHeader + cAddressesSectionContent;
                    }
                }
                
                var sectionHeading = "";
                var sectionContent = "";
                if (contacts[i].organizations && (contacts[i].organizations.length > 0)) {
                    for (var j = 0; j < contacts[i].organizations.length; j++) {
                        var typeSubsection = ((!isEmptyOrBlank(contacts[i].organizations[j].type) && (contacts[i].organizations[j].type != "undefined")) ? ("<div class='iItemType'>" + contacts[i].organizations[j].type + "</div>") : "");
                        var deptSubsection = ((!isEmptyOrBlank(contacts[i].organizations[j].department) && (contacts[i].organizations[j].department != "undefined")) ? (contacts[i].organizations[j].department) : "");
                        var orgSubsection = ((!isEmptyOrBlank(contacts[i].organizations[j].name) && (contacts[i].organizations[j].name != "undefined")) ? contacts[i].organizations[j].name : "");
                        var orgLine = orgSubsection;
                        if (deptSubsection != "") {
                            if (orgSubsection != "") {
                                orgLine += ", ";
                            } 
                            orgLine += deptSubsection;
                        }
                        var titleSubsection = ((!isEmptyOrBlank(contacts[i].organizations[j].title)) ? ("<div>" + contacts[i].organizations[j].title + "</div>") : "");
                        
                        if ((orgLine != "") || (titleSubsection != "")) {
                            sectionContent +=    "<div class='iSectionItem'>" +
                                                            typeSubsection +
                                                            "<div class='iItemValue'>" + 
                                                                ("<div>" + orgLine + "</div>") +
                                                                titleSubsection +
                                                            "</div>" +
                                                        "</div>";
                        }
                    }
                    if (!isEmptyOrBlank(sectionContent)) {
                        sectionHeading = "<div class='iSectionTitle'>Organizations</div>";
                    }
                }
                var cOrganizationsSection = sectionHeading + sectionContent;
                
                var cNoteSection = "";
                if (!isEmptyOrBlank(contacts[i].note)) {
                    cNoteSection += "<div class='iSectionTitle'>Note</div>" +
                                        "<div class='iSectionItem'>" +
                                            "<div class='iItemValue'>" + contacts[i].note + "</div>" +
                                        "</div>";
                }
                
                contInfoContainer.innerHTML +=  cPhotoSection + cNameSection + cPhoneNumbersSection + cEmailsSection + 
                                                cIMsSection + cUrlsSection + cAddressesSection + cOrganizationsSection + 
                                                cNoteSection;
                $.mobile.changePage("#cont_info_page", { transition: "pop" });
                break;
            }
        }
    }
    
    function contactError(contactError) {
        
        contInfoContainer.innerHTML = "Contacts are unavailable";
        $.mobile.changePage("#cont_info_page", { transition: "pop" });
    }
}

function buildDisplayName(contact) {
        
    if (contact === null) {
        
        return null;
    }
    
    var name = contact.name;
    if (name === null) {
        
        return "Unknown";
    }
    
    if (!isEmptyOrBlank(name.formatted)) {
            
        return name.formatted;
    }
    
    var givenName = name.givenName;
    var familyName = name.familyName;
    
    if (isEmptyOrBlank(givenName)) {
    
        if (isEmptyOrBlank(familyName)) {
            
            return "Unknown";
        
        } else {
            
            return familyName;
        }
    } else {

        if (isEmptyOrBlank(familyName)) {
            
                return givenName;
        }
    }
    
    return givenName + " " + familyName;
}

// Overwrites the default behavior of the device back button
function onBackPress(e) {
    
    if($.mobile.activePage.is("#cont_list_page")){
        e.preventDefault();
        if (!getElement("full_list_button")) {
            if (!backpressed) {
                $("#exit_popup").popup("open");
                backpressed = true;
            } else {
                navigator.app.exitApp();
            }
        } else {
            displContactList.updateList();
            getElement("full_list_button").parentNode.innerHTML = "";
        }
    } else {
        navigator.app.backHistory();
    }
}

// Collapses the jQueryMobile accordion items 
function collapse(e, id) {
    $("#" + id).trigger('expand');
    return cancelEventBubbling(e);
}