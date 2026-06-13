import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlobalRanking } from './global-ranking/global-ranking';

const routes: Routes = [
  { path: '', component: GlobalRanking },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RankingsRoutingModule {}
