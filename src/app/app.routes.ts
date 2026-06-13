import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { superAdminGuard } from './core/guards/super-admin-guard';
import { NgModule } from '@angular/core';

export const routes: Routes = [  // ← Ajouter 'export' ici !
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'quizzes',
    loadChildren: () => import('./features/quiz/quiz-module').then(m => m.QuizModule),
    canActivate: [authGuard]
  },
  {
    path: 'rankings',
    loadChildren: () => import('./features/rankings/rankings-module').then(m => m.RankingsModule),
    canActivate: [authGuard]
  },
  {
    path: 'badges',
    loadChildren: () => import('./features/badges/badges-module').then(m => m.BadgesModule),
    canActivate: [authGuard]
  },
  {
    path: 'history',
    loadChildren: () => import('./features/history/history-module').then(m => m.HistoryModule),
    canActivate: [authGuard]
  },
  {
    path: 'notifications',
    loadChildren: () => import('./features/notifications/notifications-module').then(m => m.NotificationsModule),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin-module').then(m => m.AdminModule),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: '',
    redirectTo: '/quizzes',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/quizzes'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }