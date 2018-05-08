import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Organization } from '../../../core/models/organization';
import { OrganizationService } from '../../../core/services/organization.service';
import { AutocompleteComponent } from './autocomplete.component';

@Component({
  selector: 'app-autocomplete-organization',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteOrganizationComponent extends AutocompleteComponent<Organization> {

  @Input() placeholder = 'Organizations';
  @Input() requiredMessage = 'Please enter an organization';
  @Input() serverErrorMessage = 'Failed to fetch organizations';
  @Input() displayItem = (org: Organization) => org.name;
  @Input() trackBy = (org: Organization) => org.id;
  @Input() fetcher = (term: string) => this.organizationService.search(term);

  constructor(private organizationService: OrganizationService, snackBar: MatSnackBar) {
    super(snackBar);
  }
}
