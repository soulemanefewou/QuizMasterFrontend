import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizList } from './quiz-list/quiz-list';
import { QuizDetail } from './quiz-detail/quiz-detail';
import { QuizAttempt } from './quiz-attempt/quiz-attempt';
import { QuizResult } from './quiz-result/quiz-result';

const routes: Routes = [
  { path: '', component: QuizList },
  { path: 'result/:id', component: QuizResult },
  { path: ':id', component: QuizDetail },
  { path: ':id/attempt', component: QuizAttempt },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizRoutingModule {}
