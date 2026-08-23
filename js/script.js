// ========================================
// COLLEGE GRADE PREDICTOR
// ========================================


// ----------------------------------------
// GET VALID MARKS
// ----------------------------------------

function getMarks(prompt, maximum) {

    while (true) {

        let input = promptUser(prompt);
        let marks = Number(input);

        if (!isNaN(marks) && marks >= 0 && marks <= maximum) {
            return marks;
        }

        alert(`Please enter marks between 0 and ${maximum}.`);
    }
}


// ----------------------------------------
// PROMPT FUNCTION
// ----------------------------------------

function promptUser(message) {
    return window.prompt(message);
}


// ----------------------------------------
// CALCULATE MID RAW CONTRIBUTION
// ----------------------------------------
// 80% from higher mid
// 20% from lower mid
//
// Example:
// Mid1 = 38
// Mid2 = 17
//
// Higher = 38
// Lower = 17
//
// Raw contribution =
// (38 × 0.8) + (17 × 0.2)
// = 33.8 / 40
// ----------------------------------------

function calculateRawMid(mid1, mid2) {

    const higherMid = Math.max(mid1, mid2);
    const lowerMid = Math.min(mid1, mid2);

    return (0.8 * higherMid) + (0.2 * lowerMid);
}


// ----------------------------------------
// CALCULATE INTERNAL MARKS
// ----------------------------------------

function calculateInternal(mid1, mid2, hasOBE, obeMarks) {

    const rawMid = calculateRawMid(mid1, mid2);

    let midContribution;
    let obeContribution = 0;

    if (hasOBE) {

        // Mid contributes 20 marks
        midContribution = (rawMid / 40) * 20;

        // OBE / Assignment contributes 10 marks
        obeContribution = (obeMarks / 30) * 10;

    } else {

        // Mid contributes full 30 marks
        midContribution = (rawMid / 40) * 30;
    }

    const internalTotal = midContribution + obeContribution;

    return {
        rawMid: rawMid,
        midContribution: midContribution,
        obeContribution: obeContribution,
        internalTotal: internalTotal
    };
}


// ----------------------------------------
// GET GRADE
// ----------------------------------------

function getGrade(score) {

    if (score >= 90) {
        return "S";
    }
    else if (score >= 80) {
        return "A";
    }
    else if (score >= 70) {
        return "B";
    }
    else if (score >= 60) {
        return "C";
    }
    else if (score >= 50) {
        return "D";
    }
    else if (score >= 40) {
        return "E";
    }
    else {
        return "F";
    }
}


// ----------------------------------------
// REQUIRED END-SEM MARKS
// ----------------------------------------

function requiredEndSem(internalMarks, targetScore) {

    return targetScore - internalMarks;
}


// ----------------------------------------
// GRADE TARGETS
// ----------------------------------------

const grades = {
    "S": 90,
    "A": 80,
    "B": 70,
    "C": 60,
    "D": 50,
    "E": 40
};


// ----------------------------------------
// FORM SUBMISSION
// ----------------------------------------

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("gradeForm");

    if (!form) {
        console.error("gradeForm not found in index.html");
        return;
    }


    form.addEventListener("submit", function (event) {

        event.preventDefault();


        // --------------------------------
        // GET SUBJECT NAME
        // --------------------------------

        const subjectName =
            document.getElementById("subjectName").value.trim();


        // --------------------------------
        // GET MID MARKS
        // --------------------------------

        const mid1 =
            Number(document.getElementById("mid1").value);

        const mid2 =
            Number(document.getElementById("mid2").value);


        // --------------------------------
        // GET OBE OPTION
        // --------------------------------

        const hasOBE =
            document.getElementById("hasOBE").value === "yes";


        // --------------------------------
        // GET OBE MARKS
        // --------------------------------

        let obeMarks = 0;

        if (hasOBE) {

            obeMarks =
                Number(document.getElementById("obeMarks").value);

        }


        // --------------------------------
        // VALIDATION
        // --------------------------------

        if (!subjectName) {
            alert("Please enter subject name.");
            return;
        }


        if (
            isNaN(mid1) ||
            mid1 < 0 ||
            mid1 > 40
        ) {
            alert("Mid-1 must be between 0 and 40.");
            return;
        }


        if (
            isNaN(mid2) ||
            mid2 < 0 ||
            mid2 > 40
        ) {
            alert("Mid-2 must be between 0 and 40.");
            return;
        }


        if (
            hasOBE &&
            (
                isNaN(obeMarks) ||
                obeMarks < 0 ||
                obeMarks > 30
            )
        ) {
            alert("OBE/Assignment marks must be between 0 and 30.");
            return;
        }


        // --------------------------------
        // CALCULATE
        // --------------------------------

        const result =
            calculateInternal(
                mid1,
                mid2,
                hasOBE,
                obeMarks
            );


        // --------------------------------
        // MAXIMUM POSSIBLE SCORE
        // --------------------------------

        const maximumScore =
            result.internalTotal + 70;


        const maximumGrade =
            getGrade(maximumScore);


        // --------------------------------
        // DISPLAY BASIC RESULT
        // --------------------------------

        document.getElementById("result").style.display = "block";


        document.getElementById("result").innerHTML = `

            <h2>${subjectName}</h2>

            <p>
                <strong>Mid-1:</strong>
                ${mid1.toFixed(2)} / 40
            </p>

            <p>
                <strong>Mid-2:</strong>
                ${mid2.toFixed(2)} / 40
            </p>

            <p>
                <strong>Mid Raw Score:</strong>
                ${result.rawMid.toFixed(2)} / 40
            </p>

            <hr>

            <p>
                <strong>Mid Contribution:</strong>
                ${result.midContribution.toFixed(2)} / 
                ${hasOBE ? "20" : "30"}
            </p>

            ${
                hasOBE
                ?
                `
                <p>
                    <strong>OBE / Assignment:</strong>
                    ${obeMarks.toFixed(2)} / 30
                </p>

                <p>
                    <strong>OBE Contribution:</strong>
                    ${result.obeContribution.toFixed(2)} / 10
                </p>
                `
                :
                ""
            }

            <p>
                <strong>Total Internal:</strong>
                ${result.internalTotal.toFixed(2)} / 30
            </p>

            <p>
                <strong>End-Sem:</strong>
                70 marks
            </p>

            <p>
                <strong>Maximum Possible Total:</strong>
                ${maximumScore.toFixed(2)} / 100
            </p>

            <p>
                <strong>Maximum Possible Grade:</strong>
                ${maximumGrade}
            </p>

            <hr>

            <h3>End-Sem Marks Required</h3>

            <table border="1" cellpadding="8">

                <tr>
                    <th>Grade</th>
                    <th>Total Required</th>
                    <th>End-Sem Required / 70</th>
                </tr>

                ${Object.entries(grades).map(([grade, target]) => {

                    const required =
                        requiredEndSem(
                            result.internalTotal,
                            target
                        );

                    let display;

                    if (required <= 0) {
                        display = "Done";
                    }
                    else if (required > 70) {
                        display = "--";
                    }
                    else {
                        display = Math.ceil(required);
                    }

                    return `
                        <tr>
                            <td>${grade}</td>
                            <td>${target}</td>
                            <td>${display}</td>
                        </tr>
                    `;

                }).join("")}

            </table>

        `;

    });


    // --------------------------------
    // SHOW / HIDE OBE MARKS
    // --------------------------------

    const obeSelect =
        document.getElementById("hasOBE");

    const obeSection =
        document.getElementById("obeSection");


    if (obeSelect && obeSection) {

        obeSelect.addEventListener("change", function () {

            if (this.value === "yes") {

                obeSection.style.display = "block";

            }
            else {

                obeSection.style.display = "none";

                document.getElementById("obeMarks").value = "";

            }

        });

    }

});