import mongoose, { Schema, Document } from 'mongoose';

export interface ICar extends Document {
  model: string;
  color: string;
  year: number;
  value_per_day: number;
  accessories: {
    description: string;
  }[];
  number_of_passengers: number;
}

const VehicleSchema: Schema = new Schema<ICar>({
  model: {
    type: String,
    required: [true, 'model is required'],
  },
  color: {
    type: String,
    required: [true, 'color is required'],
  },
  year: {
    type: Number,
    required: [true, 'year is required'],
    min: [1950, 'year cannot be less than 1950'],
    max: [2023, 'year cannot be greater than 2023'],
  },
  value_per_day: {
    type: Number,
    required: [true, 'value_per_day is required'],
    min: [1, 'value_per_day cannot be less than 1'],
  },
  accessories: [
    {
      description: {
        type: String,
        required: [true, 'accessory description is required'],
      },
    },
  ],
  number_of_passengers: {
    type: Number,
    required: [true, 'number_of_passengers is required'],
    min: [1, 'number_of_passengers cannot be less than 1'],
  },
});

VehicleSchema.path('accessories').validate((accessories: { description: string }[]) => {
  const accessoryDescriptions = accessories.map((a) => a.description);
  return new Set(accessoryDescriptions).size === accessoryDescriptions.length;
}, 'accessories must be unique');

VehicleSchema.path('accessories').validate((accessories: { description: string }[]) => {
  return accessories.length > 0;
}, 'at least one accessory is required');

export default mongoose.model<ICar>('Vehicle', VehicleSchema);
