import { Component, OnInit } from '@angular/core';
import {
  Partner,
  PartnerAgreementStatusList,
  PartnerAgreementStatusToString,
  PartnerTypeList,
  PartnerTypeToString
} from '../../core/models/partner';

@Component({
  selector: 'app-project-overview-partners',
  templateUrl: './project-overview-partners.component.html',
  styleUrls: ['./project-overview-partners.component.scss']
})
export class ProjectOverviewPartnersComponent implements OnInit {

  panelOpenState = false;
  partnerTypes = PartnerTypeList;
  mouAgreementStatuses = PartnerAgreementStatusList;
  partnerTypeToString = PartnerTypeToString;
  partnerAgreementStatusToString = PartnerAgreementStatusToString;
  open = false;

  partners: Partner[] = [
    {
      id: '1',
      name: 'Partner - 1'
    },
    {
      id: '2',
      name: 'Partner - 2'
    },
    {
      id: '3',
      name: 'Partner - 3'
    },
    {
      id: '4',
      name: 'Partner - 4'
    }
  ];
  openPartner: Partner;

  constructor() {
  }

  ngOnInit() {
  }

  trackPartnerById(index: number, partner: Partner): string {
    return partner.id;
  }

  setOpenPartner(partner: Partner): void {
    this.openPartner = partner;
    this.open = true;
  }

  isCardOpened(partner: Partner): boolean {
    this.openPartner = this.openPartner || {} as Partner;
    return partner.id === this.openPartner.id && this.open;
  }

  setOpenPartnerToNull(): void {
    this.openPartner = {} as Partner;
    this.open = false;
  }
}
