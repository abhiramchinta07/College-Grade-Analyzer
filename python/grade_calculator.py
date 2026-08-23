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
# CALCULATE MID CONTRIBUTION
# ---------------------------------------

def calculate_mid_contribution(mid1, mid2):

    higher_mid = max(mid1, mid2)
    lower_mid = min(mid1, mid2)

    return (0.8 * higher_mid) + (0.2 * lower_mid)


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

def required_end_sem(mid_contribution, target_score):

    return ((target_score - mid_contribution) / 60) * 70


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
print("          ENTER MID MARKS")
print("----------------------------------------")


for subject in subjects:

    print(f"\n---------- {subject['name']} ----------")

    mid1 = get_marks(
        "Enter Mid-1 marks (out of 40): ",
        40
    )

    mid2 = get_marks(
        "Enter Mid-2 marks (out of 40): ",
        40
    )

    # Calculate Mid contribution
    mid_contribution = calculate_mid_contribution(
        mid1,
        mid2
    )

    # Maximum possible final score
    max_final_score = mid_contribution + 60

    # Maximum possible grade
    max_grade = get_grade(max_final_score)

    subject["mid"] = mid_contribution
    subject["max_score"] = max_final_score
    subject["max_grade"] = max_grade


# =======================================
# SEMESTER GRADE TARGETS
# =======================================

print("\n")
print("=" * 64)
print("                    SEMESTER GRADE TARGETS")
print("=" * 64)

print(
    f"{'Subject':<18}"
    f"{'Mid/40':>10}"
    f"{'Max Score':>14}"
    f"{'Max Grade':>14}"
)

print("-" * 64)


for subject in subjects:

    print(
        f"{subject['name']:<18}"
        f"{subject['mid']:>10.2f}"
        f"{subject['max_score']:>14.2f}"
        f"{subject['max_grade']:>14}"
    )


# =======================================
# END-SEM MARKS REQUIRED
# =======================================

print("\n")
print("=" * 64)
print("                END-SEM MARKS REQUIRED")
print("=" * 64)

print(
    f"{'Subject':<18}"
    f"{'S':>8}"
    f"{'A':>8}"
    f"{'B':>8}"
    f"{'C':>8}"
    f"{'D':>8}"
    f"{'E':>8}"
)

print("-" * 64)


for subject in subjects:

    name = subject["name"]
    mid = subject["mid"]

    target_values = []

    for grade, target_score in grades.items():

        required = required_end_sem(
            mid,
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
        f"{target_values[0]:>8}"
        f"{target_values[1]:>8}"
        f"{target_values[2]:>8}"
        f"{target_values[3]:>8}"
        f"{target_values[4]:>8}"
        f"{target_values[5]:>8}"
    )


print("=" * 64)


# ---------------------------------------
# LEGEND
# ---------------------------------------

print("\nLegend:")
print("Number = minimum End-Sem marks required out of 70")
print("Done   = target already achieved from Mid contribution")
print("--     = target is impossible even with 70/70 in End-Sem")

print("\nThank you for using College Grade Predictor! 🎓")