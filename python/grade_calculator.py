
import math


# ---------------------------------------
# GET VALID MARKS
# ---------------------------------------

def get_marks(prompt, maximum):
    while True:
        try:
            marks = float(input(prompt))

            if 0 <= marks <= maximum:
                return marks

            print(
                f"Invalid marks! Enter a value between "
                f"0 and {maximum}."
            )

        except ValueError:
            print("Invalid input! Please enter a number.")


# ---------------------------------------
# GET YES / NO
# ---------------------------------------

def get_yes_no(prompt):

    while True:

        answer = input(prompt).strip().lower()

        if answer in ["yes", "y"]:
            return True

        if answer in ["no", "n"]:
            return False

        print("Please enter Yes or No.")


# ---------------------------------------
# GET NUMBER OF SUBJECTS
# ---------------------------------------

def get_subject_count():

    while True:

        try:
            count = int(input("Enter number of subjects: "))

            if count > 0:
                return count

            print("Number of subjects must be greater than 0.")

        except ValueError:
            print("Please enter a valid whole number.")


# ---------------------------------------
# GET VALID SUBJECT NAME
# ---------------------------------------

def get_subject_name(existing_names):

    while True:

        name = input("Enter subject name: ").strip()

        if not name:
            print("Subject name cannot be empty.")
            continue

        # At least one letter is required
        if not any(char.isalpha() for char in name):
            print(
                "Invalid subject name! "
                "Enter a name containing letters."
            )
            continue

        # Allow letters, numbers, spaces, &, - and .
        valid = True

        for char in name:

            if not (
                char.isalnum()
                or char.isspace()
                or char in "&-."
            ):
                valid = False
                break

        if not valid:
            print(
                "Invalid subject name! "
                "Use only letters, numbers, spaces, &, - or ."
            )
            continue

        # Duplicate check
        if name.lower() in existing_names:
            print(
                "This subject name already exists. "
                "Enter a different name."
            )
            continue

        return name


# ---------------------------------------
# CALCULATE WEIGHTED MID
# ---------------------------------------

def calculate_weighted_mid(mid1, mid2):

    higher_mid = max(mid1, mid2)
    lower_mid = min(mid1, mid2)

    # 80% from higher mid + 20% from lower mid
    weighted_mid = (
        (0.80 * higher_mid)
        + (0.20 * lower_mid)
    )

    return weighted_mid


# ---------------------------------------
# CALCULATE INTERNAL CONTRIBUTION
# ---------------------------------------

def calculate_internal(mid1, mid2, has_obe, obe_marks=0):

    weighted_mid = calculate_weighted_mid(mid1, mid2)

    if has_obe:

        # Mid contribution is reduced from 30 to 20
        mid_contribution = (
            weighted_mid / 40
        ) * 20

        # OBE/Assignment is out of 30
        # Contribution is reduced to 10
        obe_contribution = (
            obe_marks / 30
        ) * 10

        internal = (
            mid_contribution
            + obe_contribution
        )

    else:

        # Entire 30 internal marks come from Mid
        mid_contribution = (
            weighted_mid / 40
        ) * 30

        obe_contribution = 0

        internal = mid_contribution

    return (
        weighted_mid,
        mid_contribution,
        obe_contribution,
        internal
    )


# ---------------------------------------
# GET GRADE
# ---------------------------------------

def get_grade(score):

    if score >= 90:
        return "S"

    elif score >= 80:
        return "A"

    elif score >= 70:
        return "B"

    elif score >= 60:
        return "C"

    elif score >= 50:
        return "D"

    elif score >= 40:
        return "E"

    else:
        return "F"


# ---------------------------------------
# REQUIRED END-SEM MARKS
# ---------------------------------------

def required_end_sem(internal, target_score):

    # Final score = Internal /30 + End-Sem /70
    return target_score - internal


# ---------------------------------------
# GRADE TARGETS
# ---------------------------------------

grades = {
    "S": 90,
    "A": 80,
    "B": 70,
    "C": 60,
    "D": 50,
    "E": 40
}


# =======================================
# MAIN PROGRAM
# =======================================

print("========================================")
print("       COLLEGE GRADE PREDICTOR")
print("========================================")


# ---------------------------------------
# NUMBER OF SUBJECTS
# ---------------------------------------

number_of_subjects = get_subject_count()


# =======================================
# STEP 1: ENTER ALL SUBJECT NAMES
# =======================================

print("\nEnter subject names:")

subjects = []
existing_names = set()

for i in range(number_of_subjects):

    print(f"\nSubject {i + 1}:")

    subject_name = get_subject_name(existing_names)

    subjects.append({
        "name": subject_name
    })

    existing_names.add(subject_name.lower())


# =======================================
# STEP 2: ENTER MARKS FOR EACH SUBJECT
# =======================================

print("\n")
print("----------------------------------------")
print("          ENTER MARKS")
print("----------------------------------------")


for subject in subjects:

    print(f"\n---------- {subject['name']} ----------")

    # -----------------------------------
    # MID MARKS
    # -----------------------------------

    mid1 = get_marks(
        "Enter Mid-1 marks (out of 40): ",
        40
    )

    mid2 = get_marks(
        "Enter Mid-2 marks (out of 40): ",
        40
    )

    # -----------------------------------
    # OBE / ASSIGNMENT
    # -----------------------------------

    has_obe = get_yes_no(
        "Does this subject have OBE/Assignment? (Yes/No): "
    )

    obe_marks = 0

    if has_obe:

        obe_marks = get_marks(
            "Enter OBE/Assignment marks (out of 30): ",
            30
        )

    # -----------------------------------
    # CALCULATE INTERNAL
    # -----------------------------------

    (
        weighted_mid,
        mid_contribution,
        obe_contribution,
        internal
    ) = calculate_internal(
        mid1,
        mid2,
        has_obe,
        obe_marks
    )

    # -----------------------------------
    # MAXIMUM POSSIBLE FINAL SCORE
    # -----------------------------------

    max_final_score = internal + 70

    max_grade = get_grade(max_final_score)

    # -----------------------------------
    # STORE DATA
    # -----------------------------------

    subject["mid1"] = mid1
    subject["mid2"] = mid2
    subject["weighted_mid"] = weighted_mid

    subject["has_obe"] = has_obe
    subject["obe_marks"] = obe_marks

    subject["mid_contribution"] = mid_contribution
    subject["obe_contribution"] = obe_contribution

    subject["internal"] = internal

    subject["max_score"] = max_final_score
    subject["max_grade"] = max_grade


# =======================================
# SEMESTER GRADE TARGETS
# =======================================

print("\n")
print("=" * 80)
print("                    SEMESTER GRADE TARGETS")
print("=" * 80)

print(
    f"{'Subject':<18}"
    f"{'Weighted Mid':>15}"
    f"{'Mid Cont.':>13}"
    f"{'OBE Cont.':>13}"
    f"{'Internal':>13}"
    f"{'Max Score':>13}"
    f"{'Max Grade':>12}"
)

print("-" * 80)


for subject in subjects:

    print(
        f"{subject['name']:<18}"
        f"{subject['weighted_mid']:>15.2f}"
        f"{subject['mid_contribution']:>13.2f}"
        f"{subject['obe_contribution']:>13.2f}"
        f"{subject['internal']:>13.2f}"
        f"{subject['max_score']:>13.2f}"
        f"{subject['max_grade']:>12}"
    )


# =======================================
# END-SEM MARKS REQUIRED
# =======================================

print("\n")
print("=" * 80)
print("                END-SEM MARKS REQUIRED")
print("=" * 80)

print(
    f"{'Subject':<18}"
    f"{'S':>9}"
    f"{'A':>9}"
    f"{'B':>9}"
    f"{'C':>9}"
    f"{'D':>9}"
    f"{'E':>9}"
)

print("-" * 80)


for subject in subjects:

    name = subject["name"]
    internal = subject["internal"]

    target_values = []

    for grade, target_score in grades.items():

        required = required_end_sem(
            internal,
            target_score
        )

        if required <= 0:

            target_values.append("Done")

        elif required > 70:

            target_values.append("--")

        else:

            target_values.append(
                str(math.ceil(required))
            )

    print(
        f"{name:<18}"
        f"{target_values[0]:>9}"
        f"{target_values[1]:>9}"
        f"{target_values[2]:>9}"
        f"{target_values[3]:>9}"
        f"{target_values[4]:>9}"
        f"{target_values[5]:>9}"
    )


print("=" * 80)


# ---------------------------------------
# LEGEND
# ---------------------------------------

print("\nLegend:")
print("Weighted Mid = 80% of higher Mid + 20% of lower Mid")
print("No OBE       = Mid contributes 30 marks")
print("With OBE     = Mid contributes 20 + OBE/Assignment contributes 10")
print("Internal     = maximum 30 marks")
print("End-Sem      = maximum 70 marks")
print("Total        = maximum 100 marks")
print("Number       = minimum End-Sem marks required out of 70")
print("Done         = target already achieved from Internal marks")
print("--           = target is impossible even with 70/70 in End-Sem")

print("\nThank you for using College Grade Predictor! 🎓")

