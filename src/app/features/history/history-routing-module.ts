import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttemptHistory } from './attempt-history/attempt-history';

const routes: Routes = [
  { path: '', component: AttemptHistory },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryRoutingModule {}
