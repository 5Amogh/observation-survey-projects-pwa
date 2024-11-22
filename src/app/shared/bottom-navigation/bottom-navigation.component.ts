import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import NavConfig from '../../config/nav.config.json'

@Component({
  selector: 'app-bottom-navigation',
  templateUrl: './bottom-navigation.component.html',
  styleUrls: ['./bottom-navigation.component.scss'],
})
export class BottomNavigationComponent {

  selectedIndex = 0;

  navItems = NavConfig;


  constructor(private router: Router) {}

  onNavigate(route: string, index: number): void {
    this.selectedIndex = index;
    this.router.navigate([route]);
  }

}
