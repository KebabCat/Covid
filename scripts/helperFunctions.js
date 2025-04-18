//QR Generator
function genQRCodes() {
    csvResult.forEach(function (patient, index) {
        if (!patient[keys['dob']]) {
            return; //exit loop if no DOB
        }
        //Generate double QR style
        $('#ptid-qr-' + index).qrcode({
            // Original QR code
            //text: formatDate(patient[keys['dob']]) + String.fromCharCode(09) + patient[keys['nhsno']] + String.fromCharCode(09) + String.fromCharCode(32)

            // Create Only NHS Number
            text: patient[keys['nhsno']] + String.fromCharCode(32)

            // Swap over dob and NHS number
            //text: patient[keys['nhsno']] + String.fromCharCode(09) + ormatDate(patient[keys['dob']]) + String.fromCharCode(09) + String.fromCharCode(32)
        });

        if (type == "incBookingNumber") {
            $('#booking-qr-' + index).qrcode({
                text: patient.bookingNumber
            });
        }


    });
}

function generateAgeAlertsHTML(patient) {
    age = getAge(patient[keys['dob']]);
    patientAlertHTML = "";
    console.log(vaccineType)
    if (age < 16) {
        patientAlertHTML = patientAlertHTML + '<p class="patient-alert">This patient is under 16</p>'
    } else if (age < 18 && vaccineType != "Pfizer-BioNTech") {
        patientAlertHTML = patientAlertHTML + '<p class="patient-alert">This patient is under 18</p>'
    } else if (age < 30 && vaccineType == "AstraZeneca") {
        patientAlertHTML = patientAlertHTML + '<p class="patient-alert">This patient is under 30</p>'
    }
    return patientAlertHTML;
}

//Format date into the pinnacle format
function getMonthFromString(mon) {
    return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1
}

function formatDate(dateString) {
    if (dateString.includes('-')) {
        var splitDate = dateString.split('-');
    } else if (dateString.includes('.')) {
        var splitDate = dateString.split('.');
    } else if (dateString.includes('/')) {
        var splitDate = dateString.split('/');
    }
    //Seperate out month and year
    var month = splitDate[1];

    var year = splitDate[2];
    if (year.length == 2) {
        year = '19' + year;
    }
    //Convert text month to int
    var regExp = /[a-zA-Z]/g;
    if (regExp.test(month)) {
        month = getMonthFromString(month)
    }
    month = month - 1 //Javascript months are 0-11

    //Must be year-day-month
    var fomattedDate = new Date()
    fomattedDate.setFullYear(year)
    fomattedDate.setDate(splitDate[0])
    fomattedDate.setMonth(month)

    var out = fomattedDate.toLocaleDateString(
        'en-gb', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }
    ).replace(/ /g, '-').replace("Sept", "Sep")
    return out;
}

//Get age from formatDate
// RH -  Note this only work in chromium browsers.  Firefox will give the result in days not years!
function getAge(dateString) {
    var dateString = formatDate(dateString);
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

//Sort list of patients alphabetically
function sortAlphabetical(objArray) {
    function compare(a, b) {
        if (a.Name.toLowerCase() < b.Name.toLowerCase()) {
            return -1;
        }
        if (a.Name.toLowerCase() > b.Name.toLowerCase()) {
            return 1;
        }
        return 0;
    }

    objArray.sort(compare);
    return objArray;
}

//Identify the column names
function identifyCSVKeys(CSVArray, doseNumber) {
    var firstdosemissing = true
    var keys = Object.keys(CSVArray[0]);
    var nhsno_key, dob_key, name_key, address_key, firstdose_type, firstdose_batch, firstdose_date;
    keys.forEach(function (key) {
        lkey = key.toLowerCase();
        if (lkey.includes('nhs')) {
            nhsno_key = key;
        }
        if (lkey.includes('address')) {
            if (lkey.includes('organisation')) {} else
            if (lkey.includes('organization')) {} else
            if (lkey.includes('practice')) {} else
            if (lkey.includes('pcn')) {} else {
                address_key = key;
            }
        }
        if (lkey.includes('dob')) {
            dob_key = key;
        } else if (lkey.includes('birth')) {
            dob_key = key;
        }
        if (lkey.includes('name')) {
            //do not include if the column name has a "name" that is referencing something other than patient
            if (lkey.includes('organisation')) {} else
            if (lkey.includes('organization')) {} else
            if (lkey.includes('practice')) {} else
            if (lkey.includes('first')) {} else
            if (lkey.includes('sur')) {} else
            if (lkey.includes('pcn')) {} else {
                name_key = key;
            }
        }
        if (lkey.includes('first')) {
            if (lkey.includes('date')) {
                firstdose_date = key;
            }
            if (lkey.includes('type')) {
                firstdose_type = key;
            }
            if (lkey.includes('batch')) {
                firstdose_batch = key;
            }
            firstdosemissing = false
        }

    });
    if (doseNumber == 4 && firstdosemissing) {
        alert("You selected hybrid mode.  This is for clinics with a mix of first & second dose patients.\n\nYour CSV file does not contain columns for first dose information so the stickers will be printed with this batch as the first dose.")
    }

    return {
        dob: dob_key,
        name: name_key,
        nhsno: nhsno_key,
        address: address_key,
        firstdose_batch: firstdose_batch,
        firstdose_date: firstdose_date,
        firstdose_type: firstdose_type
    };
}


function firstDoseInformationExists(patient) {
    // Checks the relevent columns exist and that they have content for this patient.

    if (typeof patient[keys['firstdose_batch']] == "undefined" || typeof patient[keys['firstdose_type']] == "undefined" || typeof patient[keys['firstdose_date']] == "undefined") {
        return false;
    } else if (patient[keys['firstdose_batch']] !== "" || patient[keys['firstdose_type']] !== "" || patient[keys['firstdose_date']] !== "") {
        return true;
    } else {
        return false;
    }
}

function firstDoseDateExists(patient) {
    if (typeof patient[keys['firstdose_date']] !== "undefined") {
        return true;
    } else {
        return false;
    }
}

function firstDoseBatchDetailsExist(patient) {
    if (typeof patient[keys['firstdose_batch']] !== "undefined" || typeof patient[keys['firstdose_type']] !== "undefined") {
        return true;
    } else {
        return false
    }
}

function capitaliseName(str) {
    str = str.toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    });
    return str;
}

function generateAlert(text, elementToAppendTo, type = 'danger') {
    var alertHTML = `<div class="alert alert-` + type + `" role="alert">
        ` + text + `
        </div>`;
    console.log(alertHTML);
    $(elementToAppendTo).prepend(alertHTML);
}

//Error logging
window.onerror = function (error) {
    $("#patient-list").append(`<div class="alert alert-warning" role="alert">
        <strong>Error:</strong> ` + error + `
        <p>Please try the following:</p>
        <ul>
            
            <li>Try the dummy patient csv file in the package. If that works, the problem is in your CSV file</li>
                <li>Try and reformat your CSV file so it matches the dummy file</li>
                    <li>Check there are no blank lines in the CSV file</li>
            </ul>
        If this fails, contact mike@mikedavidsmith.com if you keep getting this error for support.
      </div>`);
};