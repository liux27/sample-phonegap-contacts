/*
 * Copyright (c) 2012, Intel Corporation. All rights reserved.
 * File revision: 04 October 2012
 * Please see http://software.intel.com/html5/license/samples 
 * and the included README.md file for license terms and conditions.
 */

// The object representing an "Edit contact" form
function ContactForm() {
    
    var formSectionPatterns = defineSectionPatterns();
    
    // Appends a form section corresponding to the itemName (e.g. phone number input, etc.) to the form.
    // itemName should correcpond to a Contact class property name.
    this.addItem = function(itemName) {
        
        switch (itemName) {
            
            case "phoneNumbers":
                addItemP("phonesSec", "phoneNumber");
                break;
            case "emails":
                addItemP("emailsSec", "email");
                break;
            case "ims":
                addItemP("imsSec", "im");
                break;
            case "addresses":
                addItemP("addressesSec", "address");
                break;
            case "organizations":
                addItemP("organizationsSec", "organization");
                break;
            case "urls":
                addItemP("urlsSec", "url");
                break;
            case "note":
                getElement("noteSec").style.display = "block";
                break;
        }
    }
        
    // Appends a form subsection to the section corresponding to the sectionName 
    // (e.g. adds a phone number subsection to the phoneNumbers section, etc.) to the form.
    function addItemP(sectionName, subsectionName) {
        
        var section = getElement(sectionName);
        buildSection(section, subsectionName, 1);
        var inputs = getElementChildren(section.lastChild, "input");
        if (inputs[0]) {
            inputs[0].focus();
        }
        $("#" + sectionName).trigger("create");
    }
    
    // Forms the "edit contact" form (and fills the form if the contact info is profided)
    this.buildContactForm = function(contact) {
        
        var contactPropBatch = getElement("new_contact_form");
        if (contactPropBatch == null) {
            return;
        }
        
        contactPropBatch.innerHTML = formSectionPatterns.nameSec + formSectionPatterns.phonesSec + 
                                     formSectionPatterns.emailsSec + formSectionPatterns.addressesSec +
                                     formSectionPatterns.imsSec + formSectionPatterns.organizationsSec +
                                     formSectionPatterns.noteSec + formSectionPatterns.photoSec + 
                                     formSectionPatterns.urlsSec +
                                     "<a id='addNewItem_button' href='#item_chooser_page' data-rel='dialog' data-role='button' data-icon='plus' onclick='fixChooser();'>Add detail</a>";
                
        if (contact != null) {
            
            if (contact.name != null) {
                $("#given_name_input").val(contact.name.givenName);
                $("#family_input").val(contact.name.familyName);
                $("#middle_input").val(contact.name.middleName);
                $("#honorificPrefix_input").val(contact.name.honorificPrefix);
                $("#honorificSuffix_input").val(contact.name.honorificSuffix);
                $("#nickname_input").val(contact.nickname);
            }
            
            if (contact.phoneNumbers && (contact.phoneNumbers.length > 0)) {
                var phoneSec = getElement("phonesSec");
                buildSection(phoneSec, "phoneNumber", contact.phoneNumbers.length);
                for (var i = 0; i < contact.phoneNumbers.length; i++) {
                    getElement("phoneNumbersType_input_" + i).value = contact.phoneNumbers[i].type;
                    getElement("phoneNumbers_input_" + i).value = contact.phoneNumbers[i].value;
                }
            }
            
            if (contact.emails && (contact.emails.length > 0)) {
                var emailSec = getElement("emailsSec");
                buildSection(emailSec, "email", contact.emails.length);
                for (var i = 0; i < contact.emails.length; i++) {
                    getElement("emailsType_input_" + i).value = contact.emails[i].type;
                    getElement("emails_input_" + i).value = contact.emails[i].value;
                }
            }
            
            if (contact.addresses && (contact.addresses.length > 0)) {
                var addrSec = getElement("addressesSec");
                buildSection(addrSec, "address", contact.addresses.length);
                for (var i = 0; i < contact.addresses.length; i++) {
                    getElement("addressesType_input_" + i).value = contact.addresses[i].type;
                    getElement("addresses_street_input_" + i).value = contact.addresses[i].streetAddress;
                    getElement("addresses_city_input_" + i).value = contact.addresses[i].locality;
                    getElement("addresses_region_input_" + i).value = contact.addresses[i].region;
                    getElement("addresses_postal_input_" + i).value = contact.addresses[i].postalCode;
                    getElement("addresses_country_input_" + i).value = contact.addresses[i].country;
                }
            }
            
            if (contact.ims && (contact.ims.length > 0)) {
                var imSec = getElement("imsSec");
                buildSection(imSec, "im", contact.ims.length);
                for (var i = 0; i < contact.ims.length; i++) {
                    getElement("imsType_input_" + i).value = contact.ims[i].type;
                    getElement("ims_input_" + i).value = contact.ims[i].value;
                }
            }
            
            if (contact.organizations && (contact.organizations.length > 0)) {
                var orgSec = getElement("organizationsSec");
                buildSection(orgSec, "organization", contact.organizations.length);
                for (var i = 0; i < contact.organizations.length; i++) {
                    getElement("organizationsType_input_" + i).value = contact.organizations[i].type;
                    getElement("organizations_dep_input_" + i).value = contact.organizations[i].department;
                    getElement("organizations_name_input_" + i).value = contact.organizations[i].name;
                    getElement("organizations_title_input_" + i).value = contact.organizations[i].title;
                }
            }
            
            if (contact.note) {
                var nSec = getElement("noteSec");
                buildSection(nSec, null, 0);
                getElement("note_input").value = contact.note;
            }
            
            if (contact.photos && (contact.photos.length > 0)) {
                var pSec = getElement("photoSec");
                buildSection(pSec, null, 0);
                getElement("photo_loc_input").src = contact.photos[0].value;
            }
            
            if (contact.urls && (contact.urls.length > 0)) {
                var uSec = getElement("urlsSec");
                buildSection(uSec, "url", contact.urls.length);
                for (var i = 0; i < contact.urls.length; i++) {
                    getElement("urlType_input_" + i).value = contact.urls[i].type;
                    getElement("url_input_" + i).value = contact.urls[i].value;
                }
            }
        }
        $("#new_contact_form").trigger("create");
    }
    
    // Adds the necessary (subsectionNumber) number of subsections to the specified form section
    function buildSection(section, subsectionName, subsectionNumber) {
        section.style.display = "block";
        if (subsectionName) {
            var sectionChildren = getElementChildren(section, "div");
            var lastSecChild = sectionChildren[sectionChildren.length - 1];
            var lastSecChildInputs = getElementChildren(lastSecChild, "input");
            var lastSecChildInput = (lastSecChildInputs.length > 0) ? lastSecChildInputs[0] : null;
            var lastid = (lastSecChild && lastSecChildInput && lastSecChildInput.id) 
                            ? lastSecChildInput.id 
                            : "_-1";
            var indStr = lastid.substring(lastid.lastIndexOf("_") + 1);
            var lastInd = parseInt(indStr, 10);
            for (var i = lastInd + 1; i < subsectionNumber + lastInd + 1; i++) {
                section.appendChild(getFormSection(subsectionName, i));
            }
        }
    }
    
    // Returns the object containing all html strings defining the form parts
    function defineSectionPatterns() {
    
        var patterns = {};
        
        patterns.nameSec = "<div class='fSectionHeader'>Contact Name</div>" + 
            "<input id='given_name_input' name='given_name_input' type='text' placeholder='Given Name' value='' data-mini='true'/>" +
            "<input id='family_input' name='family_input' type='text' placeholder='Family Name' value='' data-mini='true'/>" +
            "<input id='middle_input' name='middle_input' type='text' placeholder='Middle Name' value='' data-mini='true'/>" +
            "<input id='honorificPrefix_input' name='honorificPrefix_input' type='text' placeholder='Honorific Prefix' value='' data-mini='true'/>" +
            "<input id='honorificSuffix_input' name='honorificSuffix_input' type='text' placeholder='Honorific Suffix' value='' data-mini='true'/>" +
            "<input id='nickname_input' name='nickname_input' type='text' placeholder='Nickname' value='' data-mini='true'/>";
            
        patterns.noteSec = "<div id='noteSec' class='fSection'>" + 
                               "<div class='fSectionHeader'>Note</div>" + 
                               "<fieldset class='ui-grid-a'>" +
                                   "<div class='ui-block-a'>" +
                                       "<input id='note_input' name='note_input' type='text' placeholder='Note' data-mini='true' />" + 
                                   "</div>" +
                                   "<div class='ui-block-b'>" +
                                       "<a href='#' data-role='button' data-inline='true' data-mini='true' data-icon='delete' onclick='remove(event);'>Remove</a>" +
                                   "</div>" +
                               "</fieldset>" +
                           "</div>";
        patterns.photoSec = "<div id='photoSec' class='fSection' style='display: block;'>" + 
                                 "<div class='fSectionHeader'>Photo</div>" + 
                                 "<fieldset class='ui-grid-a'>" +
                                     "<div class='ui-block-a'>" +
                                         "<a href='#' id='photo_select_input' onclick='selectPhoto(event)'>" +
                                            "<div style='height: 75px; width: 75px; display: block; border: gray 2px solid;'><img src='//:0' id='photo_loc_input' style='height: 75px; width: 75px; display: block;'></div>" +
                                         "</a>" +
                                     "</div>" +
                                     "<div class='ui-block-b'>" +
                                         "<a href='#' data-role='button' data-inline='true' data-mini='true' data-icon='delete' onclick='remove(event);'>Remove</a>" +
                                     "</div>" +
                                 "</fieldset>" +
                             "</div>";
        
        patterns.phonesSec = "<div id='phonesSec' class='fSection'>" + 
                                 "<div class='fSectionHeader'>Phone numbers</div>" +
                             "</div>";
        patterns.emailsSec = "<div id='emailsSec' class='fSection'>" + 
                                 "<div class='fSectionHeader'>Emails</div>" + 
                             "</div>";
        patterns.addressesSec = "<div id='addressesSec' class='fSection'>" + 
                                    "<div class='fSectionHeader'>Addresses</div>" +
                                "</div>";
        patterns.imsSec = "<div id='imsSec' class='fSection'>" + 
                              "<div class='fSectionHeader'>IMs</div>" +
                          "</div>";
        patterns.organizationsSec = "<div id='organizationsSec' class='fSection'>" + 
                                        "<div class='fSectionHeader'>Organizations</div>" + 
                                    "</div>";
        
        patterns.urlsSec = "<div id='urlsSec' class='fSection'>" + 
                               "<div class='fSectionHeader'>URLs</div>" + 
                           "</div>";
        
        patterns.phoneNumber = "<div class='fSectionItem'>" +
                "<select id='phoneNumbersType_input_@' name='phoneNumbersType_input_@' data-mini='true'>" +
                    "<option value='mobile' selected='selected'>Mobile</option>" +
                    "<option value='home'>Home</option>" +
                    "<option value='work'>Work</option>" +
                    "<option value='work fax'>Work Fax</option>" +
                    "<option value='home fax'>Home Fax</option>" +
                    "<option value='pager'>Pager</option>" +
                    "<option value='other'>Other</option>" +
                "</select>" +
                "<fieldset class='ui-grid-a'>" +
                    "<div class='ui-block-a'>" +
                        "<input id='phoneNumbers_input_@' name='phoneNumbers_input_@' type='tel' placeholder='Phone Number number' value='' data-mini='true'/>" +
                    "</div>" +
                    "<div class='ui-block-b'>" +
                        "<a href='#' data-role='button' data-inline='true' data-mini='true' data-icon='delete' onclick='remove(event);'>Remove</a>" +
                    "</div>" +
                "</fieldset>" +
            "</div>";
            
        patterns.email = "<div class='fSectionItem'>" +
                "<select id='emailsType_input_@' name='emailsType_input_@' data-mini='true'>" +
                    "<option value='work' selected='selected'>Work</option>" +
                    "<option value='other'>Other</option>" +
                "</select>" +
                "<fieldset class='ui-grid-a'>" +
                    "<div class='ui-block-a'>" +
                        "<input id='emails_input_@' name='emails_input_@' type='email' placeholder='Email' data-mini='true'>" +
                    "</div>" +
                    "<div class='ui-block-b'>" +
                        "<a href='#' data-role='button' data-inline='true' data-mini='true' data-icon='delete' onclick='remove(event);'>Remove</a>" +
                    "</div>" +
                "</fieldset>" +
            "</div>"; 
                    
        patterns.address = "<div class='fSectionItem'>" + 
                "<select id='addressesType_input_@' name='addressesType_input_@' data-mini='true'>" +
                    "<option value='work' selected='selected'>Work</option>" +
                    "<option value='home'>Home</option>" +
                    "<option value='other'>Other</option>" +
                "</select>" +
                "<fieldset class='ui-grid-a'>" +
                    "<div class='ui-block-a'>" +
                        "<input id='addresses_street_input_@' name='addresses_street_input_@' type='text' placeholder='Street' data-mini='true'>" +
                        "<input id='addresses_city_input_@' name='addresses_city_input_@' type='text' placeholder='City' data-mini='true'>" +
                        "<input id='addresses_region_input_@' name='addresses_region_input_@' type='text' placeholder='Region' data-mini='true'>" +
                        "<input id='addresses_postal_input_@' name='addresses_postal_input_@' type='text' placeholder='Postal Code text & pattern' pattern='[0-9]*' data-mini='true'>" +
                        "<input id='addresses_country_input_@' name='addresses_country_input_@' type='text' placeholder='Country' data-mini='true'>" +
                    "</div>" +
                    "<div class='ui-block-b'>" +
                        "<a href='#' data-role='button' data-inline='true' data-mini='true' data-icon='delete' onclick='remove(event);'>Remove</a>" +
                    "</div>" +
                "</fieldset>" +
            "</div>";
                    
        patterns.im = "<div class='fSectionItem'>" +
                "<select id='imsType_input_@' name='imsType_input_@' data-mini='true'>" +
                    "<option value='aim' selected='selected'>AIM</option>" +
                    "<option value='msn'>Windows Life</option>" +
                    "<option value='yahoo'>Yahoo</option>" +
                    "<option value='skype'>Skype</option>" +
                    "<option value='qq'>QQ</option>" +
                    "<option value='google talk'>Google Talk</option>" +
                    "<option value='icq'>ICQ</option>" +
                    "<option value='jabber'>Jabber</option>" +
                    "<option value='other'>Other</option>" +
                "</select>" +
                "<fieldset class='ui-grid-a'>" +
                    "<div class='ui-block-a'>" +
                        "<input id='ims_input_@' name='ims_input_@' type='text' placeholder='IM ID' data-mini='true'>" +
                    "</div>" +
                    "<div class='ui-block-b'>" +
                        "<a href='#' data-role='button' data-inline='true' data-mini='true' data-icon='delete' onclick='remove(event);'>Remove</a>" +
                    "</div>" +
                "</fieldset>" +
            "</div>";
                    
        patterns.organization = "<div class='fSectionItem'>" +
                "<select id='organizationsType_input_@' name='organizationsType_input_@' data-mini='true'>" +
                    "<option value='work'>Work</option>" +
                    "<option value='other'>Other</option>" +
                "</select>" +
                "<fieldset class='ui-grid-a'>" +
                    "<div class='ui-block-a'>" +
                        "<input id='organizations_name_input_@' name='organizations_name_input_@' type='text' placeholder='Name' data-mini='true'>" +
                        "<input id='organizations_dep_input_@' name='organizations_dep_input_@' type='text' placeholder='Department' data-mini='true'>" +
                        "<input id='organizations_title_input_@' name='organizations_title_input_@' type='text' placeholder='Title' data-mini='true'>" +
                    "</div>" +
                    "<div class='ui-block-b'>" +
                        "<a href='#' data-role='button' data-inline='true' data-mini='true' data-icon='delete' onclick='remove(event);'>Remove</a>" +
                    "</div>" +
                "</fieldset>" +
            "</div>";
                
        patterns.url = "<div class='fSectionItem'>" + 
                "<select id='urlType_input_@' name='urlType_input_@' data-mini='true'>" +
                    "<option value='work'>Work</option>" +
                    "<option value='other'>Other</option>" +
                "</select>" +
                "<fieldset class='ui-grid-a'>" +
                    "<div class='ui-block-a'>" +
                        "<input id='url_input_@' name='url_input_@' type='url' data-mini='true'>" +
                    "</div>" +
                    "<div class='ui-block-b'>" +
                        "<a href='#' data-role='button' data-inline='true' data-mini='true' data-icon='delete' onclick='remove(event);'>Remove</a>" +
                    "</div>" +
                "</fieldset>" +
            "</div>"; 
            
        return patterns;
    }
    
    // Returns the DOM element (form subsection) with the appropriate unique item ids 
    function getFormSection(propertyName, i) {
    
        var pattern = formSectionPatterns[propertyName];
        if (!isNaN(i)) {
            pattern = pattern.replace(/@/g, i);
        }
        
        var cont = document.createElement("div");
        cont.innerHTML = pattern;
        
        var subsection = cont.firstChild;
        
        return subsection;
    }
    
    // Returns the contact name information entered by user
    this.getNames = function() {
    
        var name = {};
        
        var givenName = getElement("given_name_input").value;
        name.givenName = (givenName && (givenName != "undefined")) ? $.trim(givenName) : "";
    
        var familyName = getElement("family_input").value;
        name.familyName = (familyName && (familyName != "undefined")) ? $.trim(familyName) : "";
        
        var middleName = getElement("middle_input").value;
        name.middleName = (middleName && (middleName != "undefined")) ? $.trim(middleName) : "";
        
        var honorificPrefix = getElement("honorificPrefix_input").value;
        name.honorificPrefix = (honorificPrefix && (honorificPrefix != "undefined")) ? $.trim(honorificPrefix) : "";
        
        var honorificSuffix = getElement("honorificSuffix_input").value;
        name.honorificSuffix = (honorificSuffix && (honorificSuffix != "undefined")) ? $.trim(honorificSuffix) : "";
        
        return name;
    }
    
    // Returns the contact nickname information entered by user
    this.getNickname = function() {
    
        var nickname = getElement("nickname_input").value;
        return (nickname && (nickname != "undefined")) ? $.trim(nickname) : "";
    }
    
    // Returns the contact phone numbers information entered by user
    this.getPhoneNumbers = function() { 
    
        return getContactFields("phonesSec", "phoneNumbersType_input_");
    }
    
    // Returns the contact emails information entered by user
    this.getEmails = function() {
    
        return getContactFields("emailsSec", "emailsType_input_");
    }
    
    // Returns the contact ims information entered by user
    this.getIMs = function() {
    
        return getContactFields("imsSec", "imsType_input_");
    }
    
    // Returns the contact URLs information entered by user
    this.getURLs = function() {
    
        return getContactFields("urlsSec", "urlType_input_");
    }
    
    // Returns the contact photo information entered by user
    this.getPhotos = function() {
        
        var photo = {};
        
        if (getElement("photoSec").style.display == "none") {
            
            photo.type = "";
            photo.value = "";
        
        } else {
            photo.type = "url";
            photo.value = getElement("photo_loc_input").src.substring(0, ((getElement("photo_loc_input").src.indexOf("?") != -1) 
                                                                            ? getElement("photo_loc_input").src.indexOf("?") 
                                                                            : getElement("photo_loc_input").src.length));
        }
        
        photo.pref = false;
        return [ photo ];
    }
    
    // Returns the contact field information entered by user
    function getContactFields(sectionName, selectionIdPrefix) {
    
        var fields = [];    
        var fieldInputs = getElementChildren(getElement(sectionName));
        if (fieldInputs && fieldInputs.length > 0) {
            for (var i = 0; i < fieldInputs.length; i++) {
                if (fieldInputs[i].className == "fSectionItem") {
                    var fieldData = { };
                    
                    var fieldValInput = fieldInputs[i].getElementsByTagName("input")[0]; 
                    fieldData.value = (fieldValInput.value && (fieldValInput.value != "undefined")) ? $.trim(fieldValInput.value) : "";
                    
                    var itemNumber = fieldValInput.id.substring(fieldValInput.id.lastIndexOf("_") + 1);
                    var fieldTypeSelect = getElement(selectionIdPrefix + itemNumber);
                    fieldData.type = fieldTypeSelect.options[fieldTypeSelect.selectedIndex].value;
                    
                    fieldData.pref = false;
                    fields.push(fieldData);
                }
            }
        }
        return fields;
    }
    
    // Returns the contact address information entered by user
    this.getAddresses = function() {
        
        var addresses = [];
        var addrInputs = getElementChildren(getElement("addressesSec"));
        if (addrInputs && addrInputs.length > 0) {
            for (var i = 0; i < addrInputs.length; i++) {
                if (addrInputs[i].className == "fSectionItem") {
                    var addrData = { };
                    
                    var streetValInput = addrInputs[i].getElementsByTagName("input")[0];
                    addrData.streetAddress = (streetValInput.value && (streetValInput.value != "undefined")) ? $.trim(streetValInput.value) : "";
                    
                    var itemNumber = streetValInput.id.substring(streetValInput.id.lastIndexOf("_") + 1);
                    var addrTypeSelect = getElement("addressesType_input_" + itemNumber);
                    addrData.type = addrTypeSelect.options[addrTypeSelect.selectedIndex].value;
                    
                    addrData.locality = (getElement("addresses_city_input_" + itemNumber).value && (getElement("addresses_city_input_" + itemNumber).value != "undefined"))
                                        ? $.trim(getElement("addresses_city_input_" + itemNumber).value) 
                                        : "";
                                        
                    addrData.region = (getElement("addresses_region_input_" + itemNumber).value && (getElement("addresses_region_input_" + itemNumber).value != "undefined")) 
                                        ? $.trim(getElement("addresses_region_input_" + itemNumber).value) 
                                        : "";
                    
                    addrData.postalCode = (getElement("addresses_postal_input_" + itemNumber).value && (getElement("addresses_postal_input_" + itemNumber).value != "undefined")) 
                                        ? $.trim(getElement("addresses_postal_input_" + itemNumber).value) 
                                        : "";
                    
                    addrData.country = (getElement("addresses_country_input_" + itemNumber).value && (getElement("addresses_country_input_" + itemNumber).value != "undefined")) 
                                        ? $.trim(getElement("addresses_country_input_" + itemNumber).value) 
                                        : "";
                    
                    addrData.pref = false;
                    
                    addrData.formatted = addrData.locality;
                    addresses.push(addrData);
                }
            }
        }
        return addresses;
    }
    
    // Returns the contact organization information entered by user
    this.getOrganizations = function() {
    
        var orgs = [];
        var orgInputs = getElementChildren(getElement("organizationsSec"));
        if (orgInputs && orgInputs.length > 0) {
            for (var i = 0; i < orgInputs.length; i++) {
                if (orgInputs[i].className == "fSectionItem") {
                    var orgData = { };
                    
                    var nameValInput = orgInputs[i].getElementsByTagName("input")[0];
                    orgData.name = (nameValInput.value && (nameValInput.value != "undefined")) ? $.trim(nameValInput.value) : "";
                    
                    var itemNumber = nameValInput.id.substring(nameValInput.id.lastIndexOf("_") + 1);
                    var orgTypeSelect = getElement("organizationsType_input_" + itemNumber);
                    orgData.type = orgTypeSelect.options[orgTypeSelect.selectedIndex].value;
                    
                    orgData.title = (getElement("organizations_title_input_" + itemNumber).value && (getElement("organizations_title_input_" + itemNumber).value != "undefined")) 
                                        ? $.trim(getElement("organizations_title_input_" + itemNumber).value) 
                                        : "";
                                        
                    orgData.department = (getElement("organizations_dep_input_" + itemNumber).value  && (getElement("organizations_dep_input_" + itemNumber).value != "undefined"))
                                        ? $.trim(getElement("organizations_dep_input_" + itemNumber).value) 
                                        : "";
                    
                    orgData.pref = false;
                    
                    orgs.push(orgData);
                }
            }
        }
        return orgs;
    }
    
    // Returns the contact note information entered by user
    this.getNote = function() {
        
        var note = (getElement("noteSec").style.display == "none") ? "" : getElement("note_input").value;
        return note ? $.trim(note) : "";
    }
}

// Removes the subsection from the form. Is to be triggered by the remove button click event.
// The remove button is to be contained by the subsection to remove.
function remove(e) { 
    
    var targetEl = getElement(e.target);
    var toRemove = targetEl;
    
    while ((toRemove.className != "fSectionItem") && (toRemove.id != "noteSec") && (toRemove.id != "photoSec")) {
    
        toRemove = toRemove.parentNode;
        
        if (toRemove.tagName && (toRemove.tagName.toLowerCase() == "body")) {
            return;
        }
    }
    
    if (toRemove.id == "noteSec") {
        toRemove.getElementsByTagName("input")[0].value = "";
        toRemove.style.display = "none";
    } else if (toRemove.id == "photoSec") {
        getElement("photo_loc_input").src = "//:0";
        getElement("photo_loc_input").style.display = "none";
    } else {
        var section = toRemove.parentNode;
        section.removeChild(toRemove);
        var sectionItems = getElementChildren(section);
        if ((sectionItems.length == 0) || ((sectionItems.length == 1) && (sectionItems[0].className != "fSectionItem"))) {
            section.style.display = "none";
        }
    }                                               
}

// Disables the "Add subsection" chooser items which are to be single and are already displayed into the form  
function fixChooser() {
    
    var noteDisplayStyle = window.getComputedStyle(getElement("noteSec")).display;
    if (noteDisplayStyle == "none") {
        $("#item_chooser_input option[value=note]").attr({ disabled: false });
    } else {
        $("#item_chooser_input option[value=note]").attr({ disabled: true });
        if (getElement("item_chooser_input").options[getElement("item_chooser_input").selectedIndex].value == "note") {
            getElement("item_chooser_input").selectedIndex = 0;
        }
    }
    $("#item_chooser_input").selectmenu('refresh', true);
}