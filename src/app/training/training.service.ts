import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Exercise } from './exercise.model';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();

  private _availableExercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 },
  ];
  private _runningExercise: Exercise;
  private exercises: Exercise[] = [];
  constructor() {}

  getAvailableExercises() {
    return this._availableExercises.slice();
  }

  startExercise(selectedId: string) {
    this._runningExercise = this._availableExercises.find(
      (ex) => ex.id === selectedId
    )!;
    this.exerciseChanged.next({ ...this._runningExercise });
  }

  completeExercise() {
    this.exercises.push({
      ...this._runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this._runningExercise = null!;
    this.exerciseChanged.next(null!);
  }

  cancelExercise(progress: number) {
    this.exercises.push({
      ...this._runningExercise,
      duration: this._runningExercise.duration * (progress / 100),
      calories: this._runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled',
    });
    this._runningExercise = null!;
    this.exerciseChanged.next(null!);
  }

  getRunningExercise() {
    return { ...this._runningExercise };
  }

  getCompletedOrCancelledExercises() {
    return this.exercises.slice();
  }
}
