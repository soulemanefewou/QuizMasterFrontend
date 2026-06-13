import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BadgeCatalog } from './badge-catalog/badge-catalog';

const routes: Routes = [
  { path: '', component: BadgeCatalog },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BadgesRoutingModule {}
