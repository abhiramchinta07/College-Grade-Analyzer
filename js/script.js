// ========================================
// COLLEGE GRADE PREDICTOR
// Matches Python grade_calculator.py
// ========================================


// ----------------------------------------
// GRADE TARGETS
// ----------------------------------------

const grades = {
    S: 90,
    A: 80,
    B: 70,
    C: 60,
    D: 50,
    E: 40
};


// ----------------------------------------
// GET GRADE
// ----------------------------------------

function getGrade(score) {

    if (score >= 90) return "S";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    if (score >= 40) return "E";

    return "F";
}


// ----------------------------------------
// CALCULATE WEIGHTED MID
// ----------------------------------------
// 80% higher Mid + 20% lower Mid
// ----------------------------------------

function calculateWeightedMid(mid1, mid2) {

    const higherMid = Math.max(mid1, mid2);
    const lowerMid = Math.min(mid1, mid2);

    return (0.80 * higherMid) + (0.20 * lowerMid);
}


// ----------------------------------------
// CALCULATE INTERNAL
// ----------------------------------------

function calculateInternal(mid1, mid2, hasOBE, obeMarks = 0) {

    const weightedMid =
        calculateWeightedMid(mid1, mid2);

    let midContribution;
    let obeContribution;

    if (hasOBE) {

        // Mid contributes 20 marks
        midContribution =
            (weightedMid / 40) * 20;

        // OBE contributes 10 marks
        obeContribution =
            (obeMarks / 30) * 10;

    } else {

        // Mid contributes full 30 marks
        midContribution =
            (weightedMid / 40) * 30;

        obeContribution = 0;
    }

    const internal =
        midContribution + obeContribution;

    return {
        weightedMid,
        midContribution,
        obeContribution,
        internal
    };
}


// ----------------------------------------
// REQUIRED END-SEM
// ----------------------------------------

function requiredEndSem(internal, targetScore) {

    return targetScore - internal;
}


// ----------------------------------------
// VALID SUBJECT NAME
// ----------------------------------------

function validSubjectName(name, existingNames) {

    name = name.trim();

    if (!name) {
        return "Subject name cannot be empty.";
    }

    // At least one letter
    if (!/[a-zA-Z]/.test(name)) {
        return "Enter a subject name containing letters.";
    }

    // Same characters allowed by Python
    if (!/^[a-zA-Z0-9\s&\-.]+$/.test(name)) {
        return "Use only letters, numbers, spaces, &, - or .";
    }

    // Duplicate check
    if (existingNames.includes(name.toLowerCase())) {
        return "This subject name already exists.";
    }

    return "";
}


// ========================================
// MAIN PROGRAM
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const subjectCountSection =
        document.getElementById("subjectCountSection");

    const subjectNamesSection =
        document.getElementById("subjectNamesSection");

    const marksSection =
        document.getElementById("marksSection");

    const resultsSection =
        document.getElementById("resultsSection");


    const subjectCountInput =
        document.getElementById("subjectCount");

    const createSubjectsBtn =
        document.getElementById("createSubjectsBtn");

    const enterMarksBtn =
        document.getElementById("enterMarksBtn");

    const calculateBtn =
        document.getElementById("calculateBtn");


    const subjectNamesContainer =
        document.getElementById("subjectNamesContainer");

    const marksContainer =
        document.getElementById("marksContainer");


    const summaryTableBody =
        document.getElementById("summaryTableBody");

    const targetTableBody =
        document.getElementById("targetTableBody");


    let numberOfSubjects = 0;


    // ========================================
    // STEP 1: NUMBER OF SUBJECTS
    // ========================================

    createSubjectsBtn.addEventListener("click", function () {

        const count =
            Number(subjectCountInput.value);

        if (
            !Number.isInteger(count) ||
            count <= 0
        ) {
            alert("Enter a valid number of subjects greater than 0.");
            return;
        }

        numberOfSubjects = count;

        subjectNamesContainer.innerHTML = "";

        for (let i = 0; i < numberOfSubjects; i++) {

            const wrapper =
                document.createElement("div");

            wrapper.className = "mb-3";

            wrapper.innerHTML = `
                <label class="form-label fw-semibold">
                    Subject ${i + 1}
                </label>

                <input
                    type="text"
                    class="form-control subject-name"
                    placeholder="Enter subject name"
                >
            `;

            subjectNamesContainer.appendChild(wrapper);
        }

        subjectNamesSection.classList.remove("d-none");

        subjectNamesSection.scrollIntoView({
            behavior: "smooth"
        });
    });


    // ========================================
    // STEP 2: ENTER SUBJECT NAMES
    // ========================================

    enterMarksBtn.addEventListener("click", function () {

        const subjectInputs =
            document.querySelectorAll(".subject-name");

        const subjects = [];
        const existingNames = [];

        for (let i = 0; i < subjectInputs.length; i++) {

            const name =
                subjectInputs[i].value.trim();

            const error =
                validSubjectName(
                    name,
                    existingNames
                );

            if (error) {

                alert(
                    `Subject ${i + 1}: ${error}`
                );

                subjectInputs[i].focus();

                return;
            }

            subjects.push(name);

            existingNames.push(
                name.toLowerCase()
            );
        }


        // --------------------------------
        // CREATE MARK INPUTS
        // --------------------------------

        marksContainer.innerHTML = "";

        subjects.forEach(function (subject, index) {

            const card =
                document.createElement("div");

            card.className =
                "card mb-4 border";

            card.innerHTML = `

                <div class="card-body">

                    <h4 class="mb-3">
                        ${subject}
                    </h4>

                    <div class="row">

                        <div class="col-md-6 mb-3">

                            <label class="form-label">
                                Mid-1 Marks / 40
                            </label>

                            <input
                                type="number"
                                class="form-control mid1"
                                min="0"
                                max="40"
                                step="0.01"
                                placeholder="Enter Mid-1 marks"
                            >

                        </div>


                        <div class="col-md-6 mb-3">

                            <label class="form-label">
                                Mid-2 Marks / 40
                            </label>

                            <input
                                type="number"
                                class="form-control mid2"
                                min="0"
                                max="40"
                                step="0.01"
                                placeholder="Enter Mid-2 marks"
                            >

                        </div>

                    </div>


                    <div class="mb-3">

                        <label class="form-label">
                            Does this subject have
                            OBE / Assignment?
                        </label>

                        <select class="form-select has-obe">

                            <option value="no">
                                No
                            </option>

                            <option value="yes">
                                Yes
                            </option>

                        </select>

                    </div>


                    <div
                        class="obe-section d-none"
                    >

                        <label class="form-label">
                            OBE / Assignment Marks / 30
                        </label>

                        <input
                            type="number"
                            class="form-control obe-marks"
                            min="0"
                            max="30"
                            step="0.01"
                            placeholder="Enter OBE marks"
                        >

                    </div>

                </div>
            `;

            marksContainer.appendChild(card);
        });


        // --------------------------------
        // OBE SHOW / HIDE
        // --------------------------------

        const obeSelects =
            document.querySelectorAll(".has-obe");

        obeSelects.forEach(function (select) {

            select.addEventListener(
                "change",
                function () {

                    const card =
                        this.closest(".card");

                    const obeSection =
                        card.querySelector(
                            ".obe-section"
                        );

                    const obeInput =
                        card.querySelector(
                            ".obe-marks"
                        );


                    if (this.value === "yes") {

                        obeSection.classList.remove(
                            "d-none"
                        );

                    } else {

                        obeSection.classList.add(
                            "d-none"
                        );

                        obeInput.value = "";
                    }
                }
            );
        });


        marksSection.classList.remove("d-none");

        marksSection.scrollIntoView({
            behavior: "smooth"
        });
    });


    // ========================================
    // STEP 3: CALCULATE RESULTS
    // ========================================

    calculateBtn.addEventListener("click", function () {

        const subjectInputs =
            document.querySelectorAll(".subject-name");

        const mid1Inputs =
            document.querySelectorAll(".mid1");

        const mid2Inputs =
            document.querySelectorAll(".mid2");

        const obeSelects =
            document.querySelectorAll(".has-obe");

        const obeInputs =
            document.querySelectorAll(".obe-marks");


        const results = [];


        // --------------------------------
        // CALCULATE EACH SUBJECT
        // --------------------------------

        for (
            let i = 0;
            i < numberOfSubjects;
            i++
        ) {

            const subject =
                subjectInputs[i].value.trim();

            const mid1 =
                Number(mid1Inputs[i].value);

            const mid2 =
                Number(mid2Inputs[i].value);


            // --------------------------------
            // VALIDATE MID-1
            // --------------------------------

            if (
                isNaN(mid1) ||
                mid1 < 0 ||
                mid1 > 40
            ) {

                alert(
                    `${subject}: Mid-1 must be between 0 and 40.`
                );

                mid1Inputs[i].focus();

                return;
            }


            // --------------------------------
            // VALIDATE MID-2
            // --------------------------------

            if (
                isNaN(mid2) ||
                mid2 < 0 ||
                mid2 > 40
            ) {

                alert(
                    `${subject}: Mid-2 must be between 0 and 40.`
                );

                mid2Inputs[i].focus();

                return;
            }


            const hasOBE =
                obeSelects[i].value === "yes";


            let obeMarks = 0;


            if (hasOBE) {

                obeMarks =
                    Number(obeInputs[i].value);


                if (
                    isNaN(obeMarks) ||
                    obeMarks < 0 ||
                    obeMarks > 30
                ) {

                    alert(
                        `${subject}: OBE/Assignment marks must be between 0 and 30.`
                    );

                    obeInputs[i].focus();

                    return;
                }
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

            const maxScore =
                result.internal + 70;


            const maxGrade =
                getGrade(maxScore);


            results.push({

                name: subject,

                mid1: mid1,

                mid2: mid2,

                weightedMid:
                    result.weightedMid,

                hasOBE: hasOBE,

                obeMarks: obeMarks,

                midContribution:
                    result.midContribution,

                obeContribution:
                    result.obeContribution,

                internal:
                    result.internal,

                maxScore:
                    maxScore,

                maxGrade:
                    maxGrade
            });
        }


        // ========================================
        // SUMMARY TABLE
        // ========================================

        summaryTableBody.innerHTML = "";


        results.forEach(function (subject) {

            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td>
                    ${subject.name}
                </td>

                <td>
                    ${subject.weightedMid.toFixed(2)}
                    / 40
                </td>

                <td>
                    ${subject.maxScore.toFixed(2)}
                    / 100
                </td>

                <td>
                    <strong>
                        ${subject.maxGrade}
                    </strong>
                </td>
            `;

            summaryTableBody.appendChild(row);
        });


        // ========================================
        // END-SEM TARGET TABLE
        // ========================================

        targetTableBody.innerHTML = "";


        results.forEach(function (subject) {

            const row =
                document.createElement("tr");


            let cells = `
                <td>
                    ${subject.name}
                </td>
            `;


            Object.entries(grades).forEach(
                function ([grade, target]) {

                    const required =
                        requiredEndSem(
                            subject.internal,
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

                        // Python uses math.ceil()
                        display =
                            Math.ceil(required);
                    }


                    cells += `
                        <td>
                            ${display}
                        </td>
                    `;
                }
            );


            row.innerHTML = cells;

            targetTableBody.appendChild(row);
        });


        // ========================================
        // SHOW RESULTS
        // ========================================

        resultsSection.classList.remove("d-none");


        resultsSection.scrollIntoView({
            behavior: "smooth"
        });

    });

});