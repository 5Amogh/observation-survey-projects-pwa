import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { actions } from 'src/app/config/actionContants';

@Component({
  selector: 'app-report-header',
  templateUrl: './report-header.component.html',
  styleUrls: ['./report-header.component.scss'],
})
export class ReportHeaderComponent {
  @Input() reportType: any;
  @Input() reportTitle: any;
  @Output() emitReportType = new EventEmitter<any>();
  @Output() emitReportAction = new EventEmitter<any>();
  period:any;

  isOpen = false;

  constructor(public popoverController: PopoverController,) {
    this.setOptionList();
  }

  getReportType(type: any) {
    this.emitReportType.emit(type);
  }

  presentPopoverforTask(e: Event) {
    this.isOpen = true;
  }

  async openPopover(ev: any) {
    let menu:any =[
      {
        title: 'Share',
        value: 'share',
      },
      {
        title: 'Download',
        value: 'download',
      }
    ];


    const popover = await this.popoverController.create({
      component: PopoverComponent,
      componentProps: { menus: menu },
      event: ev,
      translucent: true,
    });
    popover.onDidDismiss().then((data) => {

      if (data.data) {
        this.emitReportAction.emit(data.data)
      }
    });
    return await popover.present();
  }
  setOptionList(){
    let options:any = actions.PERIODS;
    this.period= options;
  }
}