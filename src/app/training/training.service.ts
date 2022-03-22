import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { map } from 'rxjs/operators';
import { Exercise } from './exercise.model';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private _availableExercises: Exercise[] = [];
  private _runningExercise: Exercise;
  private _fbSubs: Subscription[] = [];
  constructor(private _db: AngularFirestore) {}

  fetchAvailableExercises() {
    this._fbSubs.push(
      this._db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map((docArray) =>
            docArray.map((doc) => {
              const data = doc.payload.doc.data() as Exercise;
              const id = doc.payload.doc.id;
              return { id, ...data };
            })
          )
        )
        .subscribe((exercises: Exercise[]) => {
          this._availableExercises = exercises;
          this.exercisesChanged.next([...this._availableExercises]);
        })
    );
  }

  startExercise(selectedId: string) {
    // this._db
    //   .doc('availableExercises/' + selectedId)
    //   .update({ lastSelected: new Date() });
    this._runningExercise = this._availableExercises.find(
      (ex) => ex.id === selectedId
    )!;
    this.exerciseChanged.next({ ...this._runningExercise });
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this._runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this._runningExercise = null!;
    this.exerciseChanged.next(null!);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
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

  fetchCompletedOrCancelledExercises() {
    this._fbSubs.push(
      this._db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          this.finishedExercisesChanged.next(exercises);
        })
    );
  }

  cancelSubscriptions() {
    this._fbSubs.forEach((sub) => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this._db.collection('finishedExercises').add(exercise);
  }
}
