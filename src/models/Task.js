import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'review', 'done', 'backlog'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    sprint: {
      type: String,
      default: 'Backlog',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    workspaceName: {
      type: String,
      required: [true, 'Task must belong to a workspace'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    physics: {
      weight: {
        type: Number,
        default: 1,
      },
      velocity: {
        type: Number,
        default: 0,
      },
      momentum: {
        type: Number,
        default: 0,
      },
      coordinates: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
      },
    },
    githubLinks: [{ type: String }],
    epic: {
      type: String,
      default: '',
    },
    checklist: [
      {
        text: String,
        isCompleted: { type: Boolean, default: false },
      }
    ],
  },
  {
    timestamps: true,
  }
);

taskSchema.pre('save', async function () {
  if (this.isModified('physics.weight') || this.isModified('physics.velocity')) {
    this.physics.momentum = this.physics.weight * this.physics.velocity;
  }
});

export default mongoose.model('Task', taskSchema);
