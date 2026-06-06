export const BEGINNER_PLAN = {
  name: "Beginner 3-Day Full Body",
  description: "3 days per week. Focus on form over weight. Rest 60-90s between sets. Suggested: Mon/Wed/Fri.",
  days: [
    {
      dayLabel: "Day A – Push & Core",
      dayOrder: 1,
      exercises: [
        { name: "Barbell Squat", setsTarget: 3, repsTarget: "10-12", restSeconds: 90, notes: "Start with just the bar. Feet shoulder-width, chest up, knees over toes.", orderIndex: 1 },
        { name: "Dumbbell Bench Press", setsTarget: 3, repsTarget: "10-12", restSeconds: 90, notes: "Lower to chest, press straight up. Control the descent.", orderIndex: 2 },
        { name: "Overhead Press (Dumbbell)", setsTarget: 3, repsTarget: "10-12", restSeconds: 90, notes: "Press directly overhead. Don't flare elbows too wide.", orderIndex: 3 },
        { name: "Tricep Pushdown (Cable)", setsTarget: 3, repsTarget: "12-15", restSeconds: 60, notes: "Elbows pinned to sides. Full extension at the bottom.", orderIndex: 4 },
        { name: "Plank", setsTarget: 3, repsTarget: "30-45 sec", restSeconds: 60, notes: "Neutral spine. Don't let hips sag. Breathe steadily.", orderIndex: 5 },
      ],
    },
    {
      dayLabel: "Day B – Pull & Hinge",
      dayOrder: 2,
      exercises: [
        { name: "Romanian Deadlift (Dumbbell)", setsTarget: 3, repsTarget: "10-12", restSeconds: 90, notes: "Hinge at hips, soft knees. Feel hamstring stretch. Keep back flat.", orderIndex: 1 },
        { name: "Lat Pulldown", setsTarget: 3, repsTarget: "10-12", restSeconds: 90, notes: "Pull bar to upper chest, lean back slightly. Squeeze lats at bottom.", orderIndex: 2 },
        { name: "Seated Cable Row", setsTarget: 3, repsTarget: "10-12", restSeconds: 90, notes: "Pull to lower chest. Squeeze shoulder blades together.", orderIndex: 3 },
        { name: "Dumbbell Bicep Curl", setsTarget: 3, repsTarget: "12-15", restSeconds: 60, notes: "Don't swing. Full range of motion. Alternate arms.", orderIndex: 4 },
        { name: "Face Pull (Cable)", setsTarget: 3, repsTarget: "15", restSeconds: 60, notes: "Cable at eye height. Pull to forehead, elbows high. Great for shoulder health.", orderIndex: 5 },
      ],
    },
    {
      dayLabel: "Day C – Legs & Core",
      dayOrder: 3,
      exercises: [
        { name: "Goblet Squat", setsTarget: 3, repsTarget: "12-15", restSeconds: 90, notes: "Hold dumbbell at chest. Squat deep, elbows inside knees at bottom.", orderIndex: 1 },
        { name: "Leg Press", setsTarget: 3, repsTarget: "12-15", restSeconds: 90, notes: "Feet hip-width. Don't lock knees at top. Control the descent.", orderIndex: 2 },
        { name: "Leg Curl (Machine)", setsTarget: 3, repsTarget: "12-15", restSeconds: 60, notes: "Full range of motion. Don't let hips rise on the way up.", orderIndex: 3 },
        { name: "Calf Raise", setsTarget: 4, repsTarget: "15-20", restSeconds: 60, notes: "Full stretch at bottom, full squeeze at top. Go slow.", orderIndex: 4 },
        { name: "Dead Bug", setsTarget: 3, repsTarget: "8 per side", restSeconds: 60, notes: "Lower back pressed to floor the entire time. Move slowly and with control.", orderIndex: 5 },
      ],
    },
  ],
}
