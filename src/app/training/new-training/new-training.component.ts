import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exerciseOptions: Exercise[];
  exerciseSub: Subscription;
  constructor(private _trainingService: TrainingService) {}

  ngOnInit(): void {
    this.exerciseSub = this._trainingService.exercisesChanged.subscribe(
      (exercises) => (this.exerciseOptions = exercises)
    );
    this._trainingService.fetchAvailableExercises();
    //this.exerciseOptions = this._trainingService.getAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this._trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    this.exerciseSub.unsubscribe();
  }
}
