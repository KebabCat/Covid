//Form
function genFormHTML() {
    var fullhtml = '';
    csvResult.forEach(function (patient, index) {
        if (!patient[keys['name']]) {
            return;
        }
        html = genFullPageHTML(patient, index);
        fullhtml = fullhtml + html;
    });
    return fullhtml;
}

// Last Name In List

function LastNameField(fullName) {
    const lastName = fullName.trim().split(" ").pop();
    console.log(lastName)
    return lastName;
}


// First Name In List comma separated

function FirstNameField(fullName) {
    const FirstName = fullName.trim().split(",");
    console.log(FirstName[0])
    return FirstName[0];
}


//FullPage
function genFullPageHTML(patient, index) {
    const name = patient[keys['name']]
    console.log(name)
    const lastName = FirstNameField(name);
    console.log(lastName);



    var address = '';
    if (patient[keys['address']] !== undefined) {
        address = patient[keys['address']];
    }
    var sessiondate = '';
    if (patient.SessionDate !== undefined) {
        sessiondate = patient.SessionDate;
    }
    var sessiontime = '';
    if (patient.StartTime !== undefined) {
        sessiontime = patient.StartTime;
    }
    var RegisteredPracticeName = '';
    if (patient.RegisteredPracticeName !== undefined) {
        RegisteredPracticeName = patient.RegisteredPracticeName;
    }
    age = getAge(patient[keys['dob']]);
    ageHTML = ""
    if (age < 18) {
        ageHTML = ' (Under 18 - Check Vaccine Suitability)'
    }




    firstdoseHTML = ``;
    if (doseNumber == 1) {
        doseHTML = ` First`;
    } else if (doseNumber == 2) {
        if (firstDoseInformationExists(patient)) {
            doseHTML = ` Second`;
            firstdoseHTML = ` (First dose: ` + [patient[keys['firstdose_type']], patient[keys['firstdose_batch']], patient[keys['firstdose_date']]].filter(Boolean).join(" - ") + `)`;
        } else {
            doseHTML = ` Second`
        }
    } else if (doseNumber == 4) {
        if (firstDoseInformationExists(patient)) {
            doseHTML = ` Second`;
            firstdoseHTML = ` (First dose: ` + [patient[keys['firstdose_type']], patient[keys['firstdose_batch']], patient[keys['firstdose_date']]].filter(Boolean).join(" - ") + `)`;
        } else {
            doseHTML = ` First`;
        }
    } else {
        doseHTML = ` First    |    Second`;
    }


    return `<div class="vaccine-form"><h1>Vaccine Record Form</h1>





    <table class="table table-bordered">
    <tr>
        <td>Name</td>
        <td>  
          <h4>${patient[keys['name']]}</h4>
                
    
        </td>
        <td rowspan=3 colspan=2 class="text-center">
            <div class="qr-code" id="ptid-qr-${index}"></div>
        </td> 
        
    </tr>


  
    <tr>
        
        <td>DOB</td>
        <td>${formatDate(patient[keys['dob']])}${ageHTML}</td>
        
    </tr>
    <tr>  
    <td>NHS No.</td>
    <td>${patient[keys['nhsno']]}</td>
    </tr>
    <tr>
        <td>Barcode</td>
        <td>  

            <svg id="barcode-${index}"
                jsbarcode-format="upc"
                jsbarcode-textmargin="0"
                jsbarcode-fontoptions="bold">
            </svg>
<script>JsBarcode("#barcode-${index}", "${lastName}", { width: 3, height: 40, format: "CODE39" });</script>


        </td>
            <td>GP Practice</td>
            <td>${RegisteredPracticeName}</td>
    </tr>
</table>


<table class="table table-bordered patient">
    <tr>
        <th>Screening Questions (FOR COMPLETION BY PATIENT)<br><br>If you answer YES to any of these questions, or are unsure, please discuss with your vaccinator</th>
        <th>Yes</th>
        <th>No</th>
    </tr>
    <tr>
        <td>1. Are you feeling unwell today, for example, a high temperature, or on a course of antibiotics?</td>
        <td><div class="box"></div></td>
        <td><div class="box"></div></td>
    </tr>
    <tr>
        <td>2. Do you suffer from severe allergies, or have you ever had a severe allergic reaction?</td>
        <td><div class="box"></div></td>
        <td><div class="box"></div></td>
    </tr>
    <tr>
        <td>3. Have you suffered any severe side effects from any previous vaccinations?</td>
        <td><div class="box"></div></td>
        <td><div class="box"></div></td>
    </tr>

    </table>

    
    <table class="table table-bordered">
        <tr>
            <th colspan="2">Consent FOR COMPLETION IN THE EVENT OF AN IT OUTAGE</th>
        </tr>
        <tr>
            <td>Consent given?</td>
            <td>Yes | No</td>
        </tr>
        
<tr>
    </table>


    <table class="table table-bordered">
        <tr>
            <th colspan="4">Vaccination Details FOR COMPLETION IN THE EVENT OF AN IT OUTAGE</th>
        </tr>

        <tr>
            <td>Time of Vaccination (24hr)</td>
            <td><h3>${sessiontime}</h3></td>
            <td>Date of Vaccination</td>
            <td>${sessiondate}</td>
        </tr>
        <tr>
            <td colspan="2">Vaccine Brand and Batch Number</td>
            <td colspan="2">${vaccineType} ${batchNumber}${firstdoseHTML}</td>
        </tr>
        <tr>
            <td colspan="2">Administration Site</td>
            <td colspan="2">               Left    |    Right   |      Deltoid   |      Thigh</td>
        </tr>
        <tr>
            <td colspan="2">Any Adverse Effects (blank for none) or other comments</td>
            <td colspan="2"></td>
        </tr>
        <tr>
            <td colspan="2">Vaccinator Name</td>
            <td colspan="2"></td>
        </tr>
        <tr>
            <td colspan="2">Vaccine not given (reason)
            </td>
            <td colspan="2">Unwell | Contraindicated | Did not consent</td>
        </tr>
    </table>
    </div>
    <div class="page-break-clear"></div><div class="page-break">&nbsp;</div>`;
}