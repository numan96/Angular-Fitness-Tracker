import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exerciseOptions: Exercise[];
  isLoading = false;
  private _exerciseSub: Subscription;
  private _loadingSubs: Subscription;

  constructor(
    private _trainingService: TrainingService,
    private _uiService: UIService
  ) {}

  ngOnInit(): void {
    this._loadingSubs = this._uiService.loadingStateChanged.subscribe(
      (isLoading) => {
        this.isLoading = isLoading;
      }
    );
    this._exerciseSub = this._trainingService.exercisesChanged.subscribe(
      (exercises) => (this.exerciseOptions = exercises)
    );
    this.fetchExercises();
    //this.exerciseOptions = this._trainingService.getAvailableExercises();
  }

  fetchExercises() {
    this._trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this._trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    if (this._exerciseSub) {
      this._exerciseSub.unsubscribe();
    }

    if (this._loadingSubs) {
      this._loadingSubs.unsubscribe();
    }
  }
}
