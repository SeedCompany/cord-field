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

  partnerTypes = PartnerTypeList;
  mouAgreementStatuses = PartnerAgreementStatusList;
  partnerTypeToString = PartnerTypeToString;
  partnerAgreementStatusToString = PartnerAgreementStatusToString;
  isCardOpen = false;
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
  partner: Partner;

  constructor() {
  }

  ngOnInit() {
  }

  trackPartnerById(index: number, partner: Partner): string {
    return partner.id;
  }

  setPartner(partner: Partner | undefined): void {
    if (partner) {
      this.partner = partner;
      this.isCardOpen = true;
    } else {
      this.partner = {
        id: '',
        name: ''
      };
      this.isCardOpen = false;
    }
  }

  isCardOpened(partner: Partner): boolean {
    this.partner = this.partner || {id: '', name: ''};
    return partner.id === this.partner.id && this.isCardOpen;
  }
}
