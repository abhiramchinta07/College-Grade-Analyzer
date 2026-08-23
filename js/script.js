$(document).ready(function () {

    // ==========================================
    // GRADE CONFIGURATION
    // ==========================================

    let gradeConfig = null;

    const gradeOrder = ["S", "A", "B", "C", "D", "E"];


    // ==========================================
    // LOAD grades.json
    // ==========================================

    $.getJSON("js/grades.json", function (data) {

        gradeConfig = data;

        console.log("Grade configuration loaded successfully.");

    }).fail(function () {

        alert("Unable to load grades.json.");

    });



    // ==========================================
    // CREATE SUBJECT NAME INPUTS
    // ==========================================

    $("#createSubjectsBtn").click(function () {

        let subjectCount =
            parseInt($("#subjectCount").val());


        if (
            isNaN(subjectCount) ||
            subjectCount <= 0
        ) {

            alert(
                "Please enter a valid number of subjects."
            );

            return;
        }


        $("#subjectNamesContainer").empty();


        for (
            let i = 1;
            i <= subjectCount;
            i++
        ) {

            let input = `

                <div class="mb-3">

                    <label class="form-label">
                        Subject ${i}
                    </label>

                    <input
                        type="text"
                        class="form-control subject-name"
                        placeholder="Enter subject name"
                    >

                    <div class="invalid-feedback">
                        Please enter a valid subject name.
                    </div>

                </div>

            `;


            $("#subjectNamesContainer")
                .append(input);

        }


        $("#subjectNamesSection")
            .removeClass("d-none");


        $("html, body").animate({

            scrollTop:
                $("#subjectNamesSection").offset().top

        }, 500);

    });



    // ==========================================
    // ENTER MARKS
    // ==========================================

    $("#enterMarksBtn").click(function () {

        let valid = true;

        let subjects = [];


        $(".subject-name").each(function () {

            let name =
                $(this).val().trim();


            if (name === "") {

                $(this)
                    .addClass("is-invalid");

                valid = false;

                return;
            }


            if (!/[a-zA-Z]/.test(name)) {

                $(this)
                    .addClass("is-invalid");

                valid = false;

                return;
            }


            $(this)
                .removeClass("is-invalid");


            subjects.push(name);

        });


        if (!valid) {

            alert(
                "Please enter valid names for all subjects."
            );

            return;
        }



        // ==========================================
        // CREATE MARK INPUTS
        // ==========================================

        $("#marksContainer").empty();


        subjects.forEach(function (
            subject,
            index
        ) {

            let marksInput = `

                <div class="card mb-3">

                    <div class="card-body">

                        <h5 class="mb-3">
                            ${subject}
                        </h5>


                        <div class="row">

                            <div class="col-md-6 mb-3">

                                <label class="form-label">
                                    Mid-1 (out of 40)
                                </label>

                                <input
                                    type="number"
                                    class="form-control mid1"
                                    data-index="${index}"
                                    min="0"
                                    max="40"
                                    step="0.01"
                                    placeholder="Enter Mid-1 marks"
                                >

                                <div class="invalid-feedback">
                                    Enter marks between 0 and 40.
                                </div>

                            </div>


                            <div class="col-md-6 mb-3">

                                <label class="form-label">
                                    Mid-2 (out of 40)
                                </label>

                                <input
                                    type="number"
                                    class="form-control mid2"
                                    data-index="${index}"
                                    min="0"
                                    max="40"
                                    step="0.01"
                                    placeholder="Enter Mid-2 marks"
                                >

                                <div class="invalid-feedback">
                                    Enter marks between 0 and 40.
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            `;


            $("#marksContainer")
                .append(marksInput);

        });


        $("#marksSection")
            .removeClass("d-none");


        $("html, body").animate({

            scrollTop:
                $("#marksSection").offset().top

        }, 500);

    });



    // ==========================================
    // REMOVE SUBJECT ERROR
    // ==========================================

    $(document).on(
        "input",
        ".subject-name",
        function () {

            $(this)
                .removeClass("is-invalid");

        }
    );



    // ==========================================
    // CALCULATE RESULTS
    // ==========================================

    $("#calculateBtn").click(function () {


        if (gradeConfig === null) {

            alert(
                "Grade configuration is still loading. Please try again."
            );

            return;
        }


        let valid = true;

        let results = [];


        // ==========================================
        // PROCESS EACH SUBJECT
        // ==========================================

        $(".mid1").each(function (index) {


            let mid1 =
                parseFloat($(this).val());


            let mid2 =
                parseFloat(
                    $(".mid2").eq(index).val()
                );


            let mid1Input = $(this);

            let mid2Input =
                $(".mid2").eq(index);



            // ==========================================
            // VALIDATE MID-1
            // ==========================================

            if (
                isNaN(mid1) ||
                mid1 < 0 ||
                mid1 > gradeConfig.marks.mid_max
            ) {

                mid1Input
                    .addClass("is-invalid");

                valid = false;

            }
            else {

                mid1Input
                    .removeClass("is-invalid");

            }



            // ==========================================
            // VALIDATE MID-2
            // ==========================================

            if (
                isNaN(mid2) ||
                mid2 < 0 ||
                mid2 > gradeConfig.marks.mid_max
            ) {

                mid2Input
                    .addClass("is-invalid");

                valid = false;

            }
            else {

                mid2Input
                    .removeClass("is-invalid");

            }



            if (
                isNaN(mid1) ||
                isNaN(mid2) ||
                mid1 < 0 ||
                mid1 > gradeConfig.marks.mid_max ||
                mid2 < 0 ||
                mid2 > gradeConfig.marks.mid_max
            ) {

                return;

            }



            // ==========================================
            // MID CALCULATION
            // ==========================================

            let higherMid =
                Math.max(mid1, mid2);


            let lowerMid =
                Math.min(mid1, mid2);


            let midContribution =

                (
                    gradeConfig
                        .mid_weightage
                        .higher_mid
                    *
                    higherMid
                )

                +

                (
                    gradeConfig
                        .mid_weightage
                        .lower_mid
                    *
                    lowerMid
                );



            // ==========================================
            // MAXIMUM SCORE
            // ==========================================

            let maxScore =

                midContribution
                +
                gradeConfig
                    .marks
                    .end_sem_contribution;



            // ==========================================
            // MAXIMUM GRADE
            // ==========================================

            let maxGrade = "F";


            for (
                let grade of gradeOrder
            ) {

                if (
                    maxScore >=
                    gradeConfig.grades[grade]
                ) {

                    maxGrade = grade;

                    break;

                }

            }



            // ==========================================
            // REQUIRED END-SEM MARKS
            // ==========================================

            let requiredMarks = {};


            for (
                let grade of gradeOrder
            ) {

                let targetScore =
                    gradeConfig.grades[grade];


                let requiredEndSem =

                    (
                        (
                            targetScore
                            -
                            midContribution
                        )
                        /
                        gradeConfig
                            .marks
                            .end_sem_contribution
                    )
                    *
                    gradeConfig
                        .marks
                        .end_sem_max;



                if (
                    requiredEndSem >
                    gradeConfig
                        .marks
                        .end_sem_max
                ) {

                    requiredMarks[grade] =
                        "--";

                }

                else if (
                    requiredEndSem <= 0
                ) {

                    requiredMarks[grade] =
                        "0";

                }

                else {

                    requiredMarks[grade] =
                        Math.ceil(
                            requiredEndSem
                        );

                }

            }



            // ==========================================
            // SAVE RESULT
            // ==========================================

            results.push({

                subject:
                    $(".subject-name")
                        .eq(index)
                        .val()
                        .trim(),

                midContribution:
                    midContribution,

                maxScore:
                    maxScore,

                maxGrade:
                    maxGrade,

                requiredMarks:
                    requiredMarks

            });

        });



        // ==========================================
        // VALIDATION
        // ==========================================

        if (!valid) {

            alert(
                "Please enter valid Mid-1 and Mid-2 marks between 0 and 40."
            );

            return;

        }



        // ==========================================
        // SUMMARY TABLE
        // ==========================================

        $("#summaryTableBody")
            .empty();


        results.forEach(function (result) {


            let gradeClass =
                "grade-" +
                result.maxGrade.toLowerCase();


            let row = `

                <tr>

                    <td>
                        ${result.subject}
                    </td>

                    <td>
                        ${result.midContribution.toFixed(2)}
                    </td>

                    <td>
                        ${result.maxScore.toFixed(2)}
                    </td>

                    <td>

                        <span
                            class="grade-badge ${gradeClass}"
                        >
                            ${result.maxGrade}
                        </span>

                    </td>

                </tr>

            `;


            $("#summaryTableBody")
                .append(row);

        });



        // ==========================================
        // END-SEM TABLE
        // ==========================================

        $("#targetTableBody")
            .empty();


        results.forEach(function (result) {


            let row = `

                <tr>

                    <td>
                        ${result.subject}
                    </td>

                    <td class="${
                        result.requiredMarks.S === "--"
                            ? "impossible"
                            : ""
                    }">
                        ${result.requiredMarks.S}
                    </td>

                    <td class="${
                        result.requiredMarks.A === "--"
                            ? "impossible"
                            : ""
                    }">
                        ${result.requiredMarks.A}
                    </td>

                    <td class="${
                        result.requiredMarks.B === "--"
                            ? "impossible"
                            : ""
                    }">
                        ${result.requiredMarks.B}
                    </td>

                    <td class="${
                        result.requiredMarks.C === "--"
                            ? "impossible"
                            : ""
                    }">
                        ${result.requiredMarks.C}
                    </td>

                    <td class="${
                        result.requiredMarks.D === "--"
                            ? "impossible"
                            : ""
                    }">
                        ${result.requiredMarks.D}
                    </td>

                    <td class="${
                        result.requiredMarks.E === "--"
                            ? "impossible"
                            : ""
                    }">
                        ${result.requiredMarks.E}
                    </td>

                </tr>

            `;


            $("#targetTableBody")
                .append(row);

        });



        // ==========================================
        // SHOW RESULTS
        // ==========================================

        $("#resultsSection")
            .removeClass("d-none");


        $("html, body").animate({

            scrollTop:
                $("#resultsSection").offset().top

        }, 500);

    });



    // ==========================================
    // REMOVE MARK ERRORS
    // ==========================================

    $(document).on(
        "input",
        ".mid1, .mid2",
        function () {

            $(this)
                .removeClass("is-invalid");

        }
    );

});