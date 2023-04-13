import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SummaryPipe } from '../tools/pips/summary.pipe';
export * from './_models';

/* import { AlertComponent } from './components/alert/alert.component';
import { AlertService } from './services/alert.service'; */

@NgModule({
  declarations: [
    SummaryPipe
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SummaryPipe
  ],
  providers: [
  ]
})
export class SharedModule { }
