import { Injectable } from '@angular/core';
import { Engagement, ModifiedEngagement } from '@app/core/models/engagement';
import { PloApiService } from '@app/core/services/http/plo-api.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EngagementService {

  constructor(private ploApi: PloApiService) {
  }

  getEngagement(id: string): Promise<Engagement> {
    return this.ploApi
      .get<Engagement>(`/engagements/${id}`)
      .pipe(map(Engagement.fromJson))
      .toPromise();
  }

  async save(engagementId: string, data: ModifiedEngagement): Promise<void> {
    await this.ploApi
      .put<Engagement>(`/engagements/${engagementId}/save`, data)
      .toPromise();
  }
}
