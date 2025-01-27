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

//FullPage
function genFullPageHTML(patient, index) {
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
        ageHTML = ' (Under 18)'
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
        <td>` + patient[keys['name']] + `</td>
        <td rowspan=3 colspan=2 class="text-center">
            <div class="qr-code" id="ptid-qr-` + index + `"></div>
        </td> 
        
    </tr>
    <tr>
        
        <td>DOB</td>
        <td>` + formatDate(patient[keys['dob']]) + ageHTML + `</td>
        
    </tr>
    <tr>
    <td>NHS No.</td>
    <td>` + patient[keys['nhsno']] + `</td>
    </tr>
    <tr>
    <td>Address</td>
    <td>` + address + `</td>
        <td>GP Practice</td>
        <td>` + RegisteredPracticeName + `</td>
    </tr>
</table>


<table class="table table-bordered">
    <tr>
        <th>Screening Questions (FOR COMPLETION BY PATIENT)</th>
        <th>Yes</th>
        <th>No</th>
    </tr>
    <tr>
        <td>1. Are you currently unwell with fever, symptoms of COVID-19 or a positive test in the last 28 days?</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>2. Do you have a history of any of the following? 1) Anaphylaxis, 2) Significant unexplained allergy? or 3) Reaction to a previous dose of COVID-19 vaccine?</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>3. Are you severely immunosuppressed?</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>4. Are you, or could you be pregnant, breastfeeding or planning to become pregnant in the next three months?</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>5. Are you or have you been involved in a Covid vaccine trial?</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>6. Are you taking anticoagulant medication, or do you have a bleeding disorder?</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>7. Have you been vaccinated against shingles in the last seven days?</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
	<td>8. Have you had a Covid vaccine related myocarditis or pericarditis?</td>
	<td></td>
	<td></td>
    </tr>
    <tr>
	<td>9. Do you have a history of Capillary Leak Syndrome or Idiopathetic Thrombocytopenia (ITP) ?</td>
	<td></td>
	<td></td>
    </tr>
    <tr>
        <td>10. The VidPrevtyn Beta vaccine contains squalene, an ingredient derived from fish oil. Do you have any religious, ethical or medical reasons why you cannot have this vaccine?</td>
        <td></td>
        <td></td>
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
            <td>Consent Provided By:</td>
            <td>Patient | LPA for Health | Court Appointed Deputy | Clinician Best Interests Decision (MCA)</td>
        </tr>
<tr>
    </table>


    <table class="table table-bordered">
        <tr>
            <th colspan="4">Vaccination Details FOR COMPLETION IN THE EVENT OF AN IT OUTAGE</th>
        </tr>
        <tr>
        <td colspan="2">Dose Round</td>
        <td colspan="2">` + doseHTML + `</td>
        </tr>
        <tr>
            <td>Time of Vaccination (24hr)</td>
            <td>` + sessiontime + `</td>
            <td>Date of Vaccination</td>
            <td>` + sessiondate + `</td>
        </tr>
        <tr>
            <td colspan="2">Vaccine Brand and Batch Number</td>
            <td colspan="2">` + vaccineType + ` ` + batchNumber + firstdoseHTML + `</td>
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