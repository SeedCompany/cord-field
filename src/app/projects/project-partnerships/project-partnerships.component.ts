import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete/typings/autocomplete';
import { Observable } from 'rxjs/Observable';
import { Organization } from '../../core/models/organization';
import { Partnership, PartnershipAgreementStatus, PartnershipType } from '../../core/models/partnership';
import { OrganizationService } from '../../core/services/organization.service';

@Component({
  selector: 'app-project-partnerships',
  templateUrl: './project-partnerships.component.html',
  styleUrls: ['./project-partnerships.component.scss']
})
export class ProjectPartnershipsComponent implements OnInit {

  readonly PartnershipType = PartnershipType;
  readonly PartnershipAgreementStatus = PartnershipAgreementStatus;

  partnerships: Partnership[] = [];
  private opened: Partnership | null;

  adding = false;
  search = new FormControl();
  searchResults: Observable<Organization[]>;

  /** Autofocus search input when it is created */
  @ViewChild('searchInput') set searchInput(el: ElementRef | null) {
    if (el) {
      window.setTimeout(() => el.nativeElement.focus(), 0);
    }
  }

  constructor(private organizationService: OrganizationService) {
  }

  ngOnInit(): void {
    this.searchResults = this.search
      .valueChanges
      .filter(term => term.length > 1)
      .debounceTime(300)
      .switchMap(term => this.organizationService.search(term))
      .map((organizations: Organization[]) => {
        const currentIds = this.partnerships.map(p => p.id);
        return organizations.filter(org => !currentIds.includes(org.id));
      });
  }

  trackById(index: number, object: {id: string}): string {
    return object.id;
  }

  isCardOpened(partnership: Partnership): boolean {
    return this.opened ? this.opened.id === partnership.id : false;
  }

  onCardOpen(partnership: Partnership): void {
    this.opened = partnership;
  }

  onCardClose(): void {
    this.opened = null;
  }

  onSelectOrganization(event: MatAutocompleteSelectedEvent): void {
    const org: Organization = event.option.value;
    const partnership = Partnership.fromOrganization(org);

    this.partnerships.push(partnership);
    this.adding = false;
    this.search.setValue('');
  }

  onCancel(): void {
    if (this.search.value) {
      this.search.setValue('');
    } else {
      this.adding = false;
    }
  }

  onDelete(partnership: Partnership): void {
    this.partnerships = this.partnerships.filter(current => current.id !== partnership.id);
  }
}
