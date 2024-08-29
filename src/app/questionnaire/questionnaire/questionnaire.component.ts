import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
})
export class QuestionnaireComponent  implements OnInit {
  apiConfig :any = {}
  constructor(private navCtrl: NavController,private router:ActivatedRoute) { }

  ngOnInit() {
    this.router.params.subscribe(param => {
      this.apiConfig['solutionId'] = param['id']
      this.apiConfig['baseURL'] = environment.baseURL;
      this.apiConfig['userAuthToken'] = localStorage.getItem('accToken');
      this.apiConfig['solutionType'] = 'survey';
    })
  }

  goBack(){
    this.navCtrl.back();
  }

}