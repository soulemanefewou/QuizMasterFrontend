import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { UserManagement } from './user-management/user-management';
import { QuizManagement } from './quiz-management/quiz-management';
import { BadgeManagement } from './badge-management/badge-management';
import { Statistics } from './statistics/statistics';

const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'users', component: UserManagement },
  { path: 'quizzes', component: QuizManagement },
  { path: 'badges', component: BadgeManagement },
  { path: 'statistics', component: Statistics },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
