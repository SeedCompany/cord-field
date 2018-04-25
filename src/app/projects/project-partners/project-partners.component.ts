import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete/typings/autocomplete';
import { Observable } from 'rxjs/Observable';
import {
  Partner,
  PartnerAgreementStatusList,
  PartnerAgreementStatusToString,
  PartnerTypeList,
  PartnerTypeToString
} from '../../core/models/partner';
import { PartnerService } from '../../core/services/partner.service';

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
  partners: Partner[];
  activePartner: Partner;
  activePartnerId: string;
  addingPartner = false;
  filteredPartners: Observable<Partner[]>;
  search = new FormControl();

  constructor(private partnerService: PartnerService) {
  }

  ngOnInit() {
    this.filteredPartners = this.search
      .valueChanges
      .filter(term => term.length > 1)
      .debounceTime(300)
      .switchMap(term => this.partnerService.search(term));

    this.partnerService.getPartners().subscribe(partners => {
      this.partners = partners;
    });
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

  onSelectPartner(event: MatAutocompleteSelectedEvent) {
    this.partners.push(event.option.value);
    this.addingPartner = false;
    this.search.setValue('');
  }

  onCancel() {
    if (this.search.value) {
      this.search.setValue('');
    } else {
      this.addingPartner = false;
    }
  }
}
