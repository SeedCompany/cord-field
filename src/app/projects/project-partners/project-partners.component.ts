import { Component, OnInit } from '@angular/core';
import {
  Partner,
  PartnerAgreementStatusList,
  PartnerAgreementStatusToString,
  PartnerTypeList,
  PartnerTypeToString
} from '../../core/models/partner';

@Component({
  selector: 'app-project-partners',
  templateUrl: './project-partners.component.html',
  styleUrls: ['./project-partners.component.scss']
})
export class ProjectPartnersComponent implements OnInit {

  partnerTypes = PartnerTypeList;
  mouAgreementStatuses = PartnerAgreementStatusList;
  partnerTypeToString = PartnerTypeToString;
  partnerAgreementStatusToString = PartnerAgreementStatusToString;
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
  activePartner: Partner;
  activePartnerId: string;

  constructor() {
  }

  ngOnInit() {
  }

  trackPartnerById(index: number, partner: Partner): string {
    return partner.id;
  }

  trackByValue(index: Number, value: string): string {
    return value;
  }

  isCardOpened(id: string): boolean {
    return id === this.activePartnerId;
  }

  onCardOpen(partner: Partner): void {
    this.activePartner = partner;
    this.activePartnerId = partner.id;
  }

  onCardClose(id: string): void {
    if (this.activePartner.id === id) {
      this.activePartnerId = '';
    }
  }
}
