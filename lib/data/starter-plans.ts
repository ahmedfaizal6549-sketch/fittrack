export const BEGINNER_PLAN = {
  name: "6-Day Push / Pull / Legs",
  description: "6 days a week, Sunday rest. Push/Pull/Legs repeated twice. Focus on form first — increase weight gradually each week. Rest 60-90s between sets.",
  days: [
    {
      dayLabel: "Day 1 – Push (Chest, Shoulders, Triceps)",
      dayOrder: 1,
      exercises: [
        { name: "Dumbbell Bench Press", setsTarget: 4, repsTarget: "10-12", restSeconds: 90, notes: "Monday. Lower dumbbells to chest level, press straight up. Control the descent. Keep shoulder blades pinched back.", orderIndex: 1 },
        { name: "Incline Dumbbell Press", setsTarget: 3, repsTarget: "10-12", restSeconds: 90, notes: "Bench at 30-45°. Targets upper chest. Don't go too steep — shoulder stress increases above 45°.", orderIndex: 2 },
        { name: "Overhead Press (Dumbbell)", setsTarget: 3, repsTarget: "10-12", restSeconds: 90, notes: "Press directly overhead. Core tight. Don't arch your lower back.", orderIndex: 3 },
        { name: "Cable Lateral Raise", setsTarget: 3, repsTarget: "15-20", restSeconds: 60, notes: "Light weight, full range. Lead with elbows not hands. Builds shoulder width.", orderIndex: 4 },
        { name: "Tricep Pushdown (Cable)", setsTarget: 3, repsTarget: "12-15", restSeconds: 60, notes: "Elbows pinned to sides. Full extension at the bottom. Squeeze at the bottom.", orderIndex: 5 },
        { name: "Overhead Tricep Extension", setsTarget: 3, repsTarget: "12-15", restSeconds: 60, notes: "Use one dumbbell or cable. Keep elbows close to head. Full stretch at top.", orderIndex: 6 },
      ],
    },
    {
      dayLabel: "Day 2 – Pull (Back & Biceps)",
      dayOrder: 2,
      exercises: [
        { name: "Lat Pulldown", setsTarget: 4, repsTarget: "10-12", restSeconds: 90, notes: "Tuesday. Pull bar to upper chest, lean back slightly. Squeeze lats at bottom. Don't use momentum.", orderIndex: 1 },
        { name: "Seated Cable Row", setsTarget: 4, repsTarget: "10-12", restSeconds: 90, notes: "Pull to lower chest. Squeeze shoulder blades at the end. Keep chest tall.", orderIndex: 2 },
        { name: "Single-Arm Dumbbell Row", setsTarget: 3, repsTarget: "10-12", restSeconds: 60, notes: "Knee on bench. Pull elbow straight back, not out. Feel the lat contract.", orderIndex: 3 },
        { name: "Face Pull (Cable)", setsTarget: 3, repsTarget: "15", restSeconds: 60, notes: "Cable at eye height. Pull to forehead, elbows high. Crucial for shoulder health — don't skip this.", orderIndex: 4 },
        { name: "Dumbbell Bicep Curl", setsTarget: 3, repsTarget: "12-15", restSeconds: 60, notes: "Alternate arms. No swinging. Full range — all the way up and all the way down.", orderIndex: 5 },
        { name: "Hammer Curl", setsTarget: 3, repsTarget: "12-15", restSeconds: 60, notes: "Neutral grip (thumbs up). Builds the brachialis — adds thickness to arms.", orderIndex: 6 },
      ],
    },
    {
      dayLabel: "Day 3 – Legs (Quads, Hamstrings, Glutes, Calves)",
      dayOrder: 3,
      exercises: [
        { name: "Barbell Squat", setsTarget: 4, repsTarget: "10-12", restSeconds: 90, notes: "Wednesday. Start with just the bar to learn the movement. Feet shoulder-width, chest up, squat to parallel or below.", orderIndex: 1 },
        { name: "Leg Press", setsTarget: 3, repsTarget: "12-15", restSeconds: 90, notes: "Feet hip-width on platform. Don't lock knees at top. Control the descent slowly.", orderIndex: 2 },
        { name: "Romanian Deadlift (Dumbbell)", setsTarget: 3, repsTarget: "10-12", restSeconds: 90, notes: "Hinge at hips, soft knees. Lower until you feel a hamstring stretch. Keep back flat throughout.", orderIndex: 3 },
        { name: "Leg Curl (Machine)", setsTarget: 3, repsTarget: "12-15", restSeconds: 60, notes: "Full range of motion. Don't let hips rise. Squeeze hamstrings at the top.", orderIndex: 4 },
        { name: "Calf Raise (Machine or Standing)", setsTarget: 4, repsTarget: "15-20", restSeconds: 60, notes: "Full stretch at bottom, full squeeze at top. Go slow — 2 sec up, 2 sec down.", orderIndex: 5 },
        { name: "Plank", setsTarget: 3, repsTarget: "40-60 sec", restSeconds: 60, notes: "Neutral spine. Don't let hips sag or pike. Breathe steadily.", orderIndex: 6 },
      ],
    },
    {
      dayLabel: "Day 4 – Push (Chest, Shoulders, Triceps) – Volume",
      dayOrder: 4,
      exercises: [
        { name: "Dumbbell Bench Press", setsTarget: 4, repsTarget: "8-10", restSeconds: 90, notes: "Thursday. Slightly heavier than Day 1 if possible. Same form — controlled descent.", orderIndex: 1 },
        { name: "Cable Chest Fly", setsTarget: 3, repsTarget: "12-15", restSeconds: 60, notes: "Arms slightly bent throughout. Feel the chest stretch at the bottom. Squeeze at the top.", orderIndex: 2 },
        { name: "Overhead Press (Dumbbell)", setsTarget: 3, repsTarget: "8-10", restSeconds: 90, notes: "Slightly heavier than Day 1. Full range — lower to ear level.", orderIndex: 3 },
        { name: "Cable Lateral Raise", setsTarget: 4, repsTarget: "15-20", restSeconds: 60, notes: "Higher volume on Day 4. Shoulders respond well to more sets. Keep it light and controlled.", orderIndex: 4 },
        { name: "Skull Crusher (Dumbbell)", setsTarget: 3, repsTarget: "12-15", restSeconds: 60, notes: "Lower dumbbells toward forehead, elbows stay pointing up. Great for tricep mass.", orderIndex: 5 },
        { name: "Tricep Pushdown (Cable)", setsTarget: 3, repsTarget: "15", restSeconds: 60, notes: "Burnout set — lighter weight, higher reps. Elbows locked to sides.", orderIndex: 6 },
      ],
    },
    {
      dayLabel: "Day 5 – Pull (Back & Biceps) – Volume",
      dayOrder: 5,
      exercises: [
        { name: "Lat Pulldown", setsTarget: 4, repsTarget: "8-10", restSeconds: 90, notes: "Friday. Go slightly heavier than Day 2. Full range, controlled.", orderIndex: 1 },
        { name: "Bent-Over Barbell Row", setsTarget: 3, repsTarget: "10-12", restSeconds: 90, notes: "Hinge at hips 45°, pull bar to lower chest. Keep back straight. Big compound movement.", orderIndex: 2 },
        { name: "Seated Cable Row", setsTarget: 3, repsTarget: "10-12", restSeconds: 90, notes: "Wider grip variation if possible. Targets mid-back differently.", orderIndex: 3 },
        { name: "Face Pull (Cable)", setsTarget: 3, repsTarget: "15-20", restSeconds: 60, notes: "Higher reps on Day 5. Shoulder health is non-negotiable.", orderIndex: 4 },
        { name: "Incline Dumbbell Curl", setsTarget: 3, repsTarget: "12-15", restSeconds: 60, notes: "Seated on incline bench, arms hanging back. Maximum bicep stretch. Slow and controlled.", orderIndex: 5 },
        { name: "Hammer Curl", setsTarget: 3, repsTarget: "12-15", restSeconds: 60, notes: "Finish with neutral grip curls. Arms will be tired — go lighter and focus on the squeeze.", orderIndex: 6 },
      ],
    },
    {
      dayLabel: "Day 6 – Legs (Quads, Hamstrings, Glutes, Calves) – Volume",
      dayOrder: 6,
      exercises: [
        { name: "Goblet Squat", setsTarget: 3, repsTarget: "15", restSeconds: 60, notes: "Saturday. Warm-up squat variation. Dumbbell at chest. Squat deep.", orderIndex: 1 },
        { name: "Leg Press", setsTarget: 4, repsTarget: "12-15", restSeconds: 90, notes: "Heavier than Day 3 or higher reps. Push the volume.", orderIndex: 2 },
        { name: "Walking Lunges", setsTarget: 3, repsTarget: "12 per leg", restSeconds: 90, notes: "Bodyweight or dumbbells. Long stride, back knee almost touches floor. Great for glutes.", orderIndex: 3 },
        { name: "Leg Curl (Machine)", setsTarget: 4, repsTarget: "12-15", restSeconds: 60, notes: "Hamstrings are often undertrained. 4 sets today. Full stretch at the bottom.", orderIndex: 4 },
        { name: "Calf Raise (Machine or Standing)", setsTarget: 4, repsTarget: "20", restSeconds: 60, notes: "High rep day for calves. Don't rush — feel every rep.", orderIndex: 5 },
        { name: "Dead Bug", setsTarget: 3, repsTarget: "10 per side", restSeconds: 60, notes: "Core finisher. Lower back stays pressed to floor. Move slowly and with full control.", orderIndex: 6 },
      ],
    },
  ],
}
