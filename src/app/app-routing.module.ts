import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreloadingService } from './services/preloading.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'vi',
    pathMatch: 'full'
  },

  {
    path: ':lang',
    loadChildren: () => import('./main/contents/page/page.module').then(m => m.PageModule),
    data: { preloading: true }
  },
  
  {
    path: '**',
    redirectTo: 'vi',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'legacy_enabled',
    preloadingStrategy: PreloadingService
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
