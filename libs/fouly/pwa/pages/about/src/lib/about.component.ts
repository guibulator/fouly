import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fouly-about-page',
  styleUrls: ['about.component.scss'],
  templateUrl: 'about.component.html'
})
export class AboutComponent implements OnInit {
  private members = [];
  // { Removed for now because of PSP
  //   name: 'page.about.team.mathieu.name',
  //   role: 'page.about.team.mathieu.role',
  //   picture: 'assets/img/profile/mathieug_profile.png',
  //   linkedIn: 'https://www.linkedin.com/in/guibulator/'
  // },
  // {
  //   name: 'page.about.team.marcoux.name',
  //   role: 'page.about.team.marcoux.role',
  //   picture: 'assets/img/profile/marcoux_profile.png',
  //   linkedIn: 'https://www.linkedin.com/in/mathieu-marcoux-71612178/'
  // },
  // {
  //   name: 'page.about.team.arnaud.name',
  //   role: 'page.about.team.arnaud.role',
  //   picture: 'assets/img/profile/arnaud_profile.png',
  //   linkedIn: 'https://www.linkedin.com/in/arnaudjean/'
  // }
  // {
  //   name: 'page.about.team.fred.name',
  //   role: 'page.about.team.fred.role',
  //   picture: 'assets/img/profile/fred_profile.png',
  //   linkedIn: 'https://www.linkedin.com/in/fr%C3%A9d%C3%A9rick-roy-088b8411/'
  // }
  //];

  team = this.members.sort(() => Math.random() - 0.5);

  constructor() {}

  ngOnInit() {}
}
