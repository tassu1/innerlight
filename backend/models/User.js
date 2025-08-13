const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
    },
    lastSeen: {
      type: Date,
      default: Date.now
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
    },
    profilePic: {
      type: String,
      default: "",
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friendRequests: [
      {
        from: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
        requestedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    sentRequests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    // ===== NEW MIND GARDEN ADDITIONS =====
    mindGarden: {
  habits: [{
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    icon: String,
    description: String,
    completed: Boolean,
    xpValue: { type: Number, default: 5 } // XP per completion
  }],
  growth: {
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastUpdated: Date
  },
  history: [{
    date: Date,
    completedHabits: [{
      habitId: mongoose.Schema.Types.ObjectId,
      name: String,
      xpEarned: Number
    }],
    totalXp: Number
  }]
}
  },
  { timestamps: true }
);

// Encrypt password (existing)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password method (existing)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ===== NEW MIND GARDEN METHODS =====
userSchema.methods.updateMindGarden = async function(habitUpdates) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Initialize if empty
  if (!this.mindGarden.habits.length) {
    this.mindGarden.habits = [
      { _id: new mongoose.Types.ObjectId(), name: "Meditate", icon: "🧘", description: "5 minutes of mindfulness" },
      { _id: new mongoose.Types.ObjectId(), name: "Hydrate", icon: "💧", description: "Drink 8 glasses of water" },
      { _id: new mongoose.Types.ObjectId(), name: "Exercise", icon: "🏃", description: "30 minutes of movement" },
      { _id: new mongoose.Types.ObjectId(), name: "Journal", icon: "📔", description: "Reflect on your day" }
    ];
  }

  // Check for new day
  const isNewDay = !this.mindGarden.growth.lastUpdated || 
                  this.mindGarden.growth.lastUpdated < today;

  if (isNewDay) {
    // Reset daily completions
    this.mindGarden.habits.forEach(h => h.completed = false);
    
    // Update streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    this.mindGarden.growth.streak = 
      (this.mindGarden.growth.lastUpdated >= yesterday) 
        ? this.mindGarden.growth.streak + 1 
        : 1;
  }

  // Apply updates
  habitUpdates.forEach(update => {
    const habit = this.mindGarden.habits.id(update.habitId);
    if (habit) habit.completed = update.completed;
  });

  // Calculate today's XP
  const completedToday = this.mindGarden.habits.filter(h => h.completed);
  const xpEarned = completedToday.reduce((sum, h) => sum + h.xpValue, 0);

  // Add to history if new day or first update
  if (isNewDay || !this.mindGarden.history.length) {
    this.mindGarden.history.push({
      date: today,
      completedHabits: completedToday.map(h => ({
        habitId: h._id,
        name: h.name,
        xpEarned: h.xpValue
      })),
      totalXp: xpEarned
    });
  } else {
    // Update today's entry
    const todayEntry = this.mindGarden.history[this.mindGarden.history.length - 1];
    todayEntry.completedHabits = completedToday.map(h => ({
      habitId: h._id,
      name: h.name,
      xpEarned: h.xpValue
    }));
    todayEntry.totalXp = xpEarned;
  }

  // Update growth
  this.mindGarden.growth.xp += xpEarned;
  this.mindGarden.growth.level = Math.floor(this.mindGarden.growth.xp / 100) + 1;
  this.mindGarden.growth.lastUpdated = new Date();

  return this.save();
};

const User = mongoose.model("User", userSchema);
module.exports = User;