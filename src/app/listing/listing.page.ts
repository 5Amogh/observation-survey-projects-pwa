import { Component, inject, OnInit } from '@angular/core';
import { UrlConfig } from 'src/app/interfaces/main.interface';
import urlConfig from 'src/app/config/url.config.json';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderService } from '../services/loader/loader.service';
import { ToastService } from '../services/toast/toast.service';
import { NavController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { actions } from 'src/app/config/actionContants';
import { ProfileService } from '../services/profile/profile.service';
import { AlertService } from '../services/alert/alert.service';
import { ProjectsApiService } from '../services/projects-api/projects-api.service';
import { SamikshaApiService } from '../services/samiksha-api/samiksha-api.service';
@Component({
  selector: 'app-listing',
  templateUrl: './listing.page.html',
  styleUrls: ['./listing.page.scss'],
})
export class ListingPage implements OnInit {
  solutionList: any = { data: [], count: 0 };
  loader: LoaderService;
  solutionId!: string;
  listType!: keyof UrlConfig;
  searchTerm: any = "";
  toastService: ToastService;
  stateData: any;
  page: number = 1;
  limit: number = 10;
  filter = "assignedToMe";
  filters=actions.PROJECT_FILTERS;
  entityData:any;
  ProjectsApiService: ProjectsApiService;
  SamikshaApiService:SamikshaApiService;
  showLoading:boolean = true;
  reportPage:boolean = false

  constructor(private navCtrl: NavController, private router: Router,
    private profileService: ProfileService,
    private alertService: AlertService, private activatedRoute: ActivatedRoute
  ) {
    this.ProjectsApiService = inject(ProjectsApiService);
    this.SamikshaApiService = inject(SamikshaApiService);
    this.loader = inject(LoaderService)
    this.toastService = inject(ToastService)
    activatedRoute.queryParams.subscribe((params:any)=>{
      this.listType = params["type"]
      this.reportPage = params["reportPage"] == "true"
    })
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.page = 1;
    this.solutionList = { data: [], count: 0 }
    this.stateData = await this.profileService.getHomeConfig(this.listType,this.reportPage)
    this.getProfileDetails();
    this.showLoading = true;
  }

  ionViewWillLeave() {
    this.alertService.dismissAlert();
  }

  formatDate(endDate: string): string {
    if (!endDate) {
      return '';
    }
  
    const date = new Date(endDate);
    const localTime = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return localTime.toDateString();
  }

  handleInput(event: any) {
    this.searchTerm = event.target.value;
    this.page = 1;
    this.solutionList = { data: [], count: 0 };
    this.getListData();
  }
  filterChanged(event: any) {
    this.solutionList = { data: [], count: 0 }
    this.page = 1;
    this.getListData()
  }

  getProfileDetails() {
    this.profileService.getProfileAndEntityConfigData().subscribe((mappedIds) => {
      if (mappedIds) {
        this.entityData = mappedIds;
        this.getListData();
      }
    });
  }

  async getListData() {
    this.showLoading = true;
    await this.loader.showLoading("Please wait while loading...");
    if(this.listType !== 'project'){
      this.filter = '';
    };
    (this.listType == 'project' ? this.ProjectsApiService : this.SamikshaApiService)
      .post(
        urlConfig[this.listType].listingUrl + `?type=${this.stateData.solutionType}&page=${this.page}&limit=${this.limit}&filter=${this.filter}&search=${this.searchTerm}${this.stateData.reportIdentifier ? `&` +this.stateData.reportIdentifier+`=`+this.reportPage : ''}`, this.entityData)
      .pipe(
        finalize(async () => {
          await this.loader.dismissLoading();
          this.showLoading = false;
        })
      )
      .subscribe((res: any) => {
        if (res?.status == 200) {
          this.solutionList.data = this.solutionList?.data.concat(res?.result?.data);
          this.solutionList.count = res?.result?.count;
          (this.solutionList.data as []).forEach((element: any) => {
            element.endDate = this.formatDate(element.endDate);
            this.checkAndUpdateExpiry(element);
            this.assignStatusAndClasses(element);
            this.calculateExpiryDetails(element);
          });
        } else {
          this.toastService.presentToast(res?.message, 'warning');
        }
      },
        (err: any) => {
          this.toastService.presentToast(err?.error?.message, 'danger');
        }
      );
  }

  checkAndUpdateExpiry(element: any) {
    if (element.endDate) {
      const expiryDate = new Date(element.endDate);
      const currentDate = new Date();
      if (currentDate > expiryDate) {
        element.status = 'expired';
      }
    }
  }

  assignStatusAndClasses(element: any) {
    const statusMappings = {
      'active': { tagClass: 'tag-not-started', statusLabel: 'Not Started' },
      'draft': { tagClass: 'tag-in-progress', statusLabel: 'In Progress' },
      'started': { tagClass: 'tag-in-progress', statusLabel: 'In Progress' },
      'completed': { tagClass: 'tag-completed', statusLabel: 'Completed' },
      'expired': { tagClass: 'tag-expired', statusLabel: 'Expired' }
    };
  
    const statusInfo = (statusMappings as any)[element.status] || { tagClass: '', statusLabel: '' };
    element.tagClass = statusInfo.tagClass;
    element.statusLabel = statusInfo.statusLabel;
  }
  
  calculateExpiryDetails(element: any) {
    if (element.endDate) {
      element.isExpiringSoon = this.isExpiringSoon(element.endDate);
      element.daysUntilExpiry = this.getDaysUntilExpiry(element.endDate);
    } else {
      element.isExpiringSoon = false;
      element.daysUntilExpiry = 0;
    }
  }

  isExpiringSoon(endDate: string | Date): boolean {
    const currentDate = new Date();
    const expiryDate = new Date(endDate);
  
    const diffTime = expiryDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    return diffDays <= 2 && diffDays > 0;
  }

  getDaysUntilExpiry(endDate: string | Date): number {
    const currentDate = new Date();
    const expiryDate = new Date(endDate);
  
    const diffTime = expiryDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    return Math.max(diffDays, 0);
  }
  
  

  loadData() {
    this.page = this.page + 1;
    this.getListData();
  }

  goBack() {
    this.navCtrl.back();
  }

  navigateTo(data: any) {
    switch (this.listType) {
      case 'project':
        this.router.navigate(['project-details'], { state: { _id:data._id || null, solutionId: data.solutionId} });
        break;
  
      case 'survey':
        const route = this.reportPage 
          ? ['report-details', data.submissionId] 
          : ['questionnaire', data.solutionId];
        this.router.navigate(route);
        break;
  
      default:
        console.warn('Unknown listType:', this.listType);
    }
  }
  
}