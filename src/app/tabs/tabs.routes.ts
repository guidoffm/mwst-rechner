import type { Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'calculator',
        loadComponent: () => import('../calculator/calculator.page').then((m) => m.CalculatorPage),
      },
      {
        path: 'history',
        loadComponent: () => import('../history/history.page').then((m) => m.HistoryPage),
      },
      {
        path: 'settings',
        loadComponent: () => import('../settings/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: '',
        redirectTo: '/tabs/calculator',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/tabs/calculator',
    pathMatch: 'full',
  },
];
