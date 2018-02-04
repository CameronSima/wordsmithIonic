import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { GameReportPage } from './gameReport';

@NgModule({
  declarations: [
    GameReportPage,
  ],
  imports: [
    IonicPageModule.forChild(GameReportPage),
    TranslateModule.forChild()
  ],
  exports: [
    GameReportPage
  ]
})
export class GameReportPageModule { }
