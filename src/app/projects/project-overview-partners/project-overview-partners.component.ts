import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-overview-partners',
  templateUrl: './project-overview-partners.component.html',
  styleUrls: ['./project-overview-partners.component.scss']
})
export class ProjectOverviewPartnersComponent implements OnInit {

  panelOpenState = false;
  partnerTypes = [
    {id: 1, name: 'Managing'},
    {id: 2, name: 'Funding'},
    {id: 3, name: 'Impact'},
    {id: 4, name: 'Technical'},
    {id: 5, name: 'Resource'}
  ];
  mouAgreementStatuses = [
    {id: 1, name: 'Not Attached'},
    {id: 2, name: 'Awaiting Signature'},
    {id: 3, name: 'Signed'}
  ]

  constructor() {
  }

  ngOnInit() {
  }

}
