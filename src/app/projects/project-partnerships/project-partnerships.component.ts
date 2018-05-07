import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete/typings/autocomplete';
import { Observable } from 'rxjs/Observable';
import { Partnership, PartnershipAgreementStatus, PartnershipType } from '../../core/models/partnership';
import { PartnershipService } from '../../core/services/partnership.service';

@Component({
  selector: 'app-project-partnerships',
  templateUrl: './project-partnerships.component.html',
  styleUrls: ['./project-partnerships.component.scss']
})
export class ProjectPartnershipsComponent implements OnInit {

  readonly PartnershipType = PartnershipType;
  readonly PartnershipAgreementStatus = PartnershipAgreementStatus;

  partnerships: Partnership[];
  activePartnership: Partnership;
  activePartnershipId: string;
  adding = false;
  filteredPartnerships: Observable<Partnership[]>;
  search = new FormControl();

  constructor(private partnershipService: PartnershipService) {
  }

  ngOnInit() {
    this.filteredPartnerships = this.search
      .valueChanges
      .filter(term => term.length > 1)
      .debounceTime(300)
      .switchMap(term => this.partnershipService.search(term));

    this.partnershipService.getPartnerships().subscribe(partnerships => {
      this.partnerships = partnerships;
    });
  }

  trackPartnershipById(index: number, partnership: Partnership): string {
    return partnership.id;
  }

  isCardOpened(id: string): boolean {
    return id === this.activePartnershipId;
  }

  onCardOpen(partnership: Partnership): void {
    this.activePartnership = partnership;
    this.activePartnershipId = partnership.id;
  }

  onCardClose(id: string): void {
    if (this.activePartnership.id === id) {
      this.activePartnershipId = '';
    }
  }

  onSelectPartnership(event: MatAutocompleteSelectedEvent) {
    this.partnerships.push(event.option.value);
    this.adding = false;
    this.search.setValue('');
  }

  onCancel() {
    if (this.search.value) {
      this.search.setValue('');
    } else {
      this.adding = false;
    }
  }
}
