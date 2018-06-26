import { maybeRedacted } from './util';

class LocationPart {
  id: string;
  imageLargeFileName: string;
  imageMediumFileName: string;
  imageSmallFileName: string;

  static fromJson(json: Partial<LocationPart>): LocationPart {
    const {
      id = '',
      imageLargeFileName = '',
      imageMediumFileName = '',
      imageSmallFileName = ''
    } = json;

    return {
      id,
      imageLargeFileName,
      imageMediumFileName,
      imageSmallFileName
    };
  }
}

export class Region extends LocationPart {
  name: string | null;
  directorId: string;

  static fromJson(json: Partial<Region>): Region {
    const region = Object.assign(new Region(), super.fromJson(json));
    region.name = maybeRedacted(json.name);
    region.directorId = json.directorId || '';

    return region;
  }
}

export class Area extends LocationPart {
  name: string | null;
  region: Region;

  static fromJson(json: Partial<Area>): Area {
    const area = Object.assign(new Area(), super.fromJson(json));
    area.name = maybeRedacted(json.name);
    area.region = Region.fromJson(json.region || {});

    return area;
  }
}

export class Location extends LocationPart {
  country: string | null;
  area: Area;
  editable: boolean;

  static fromJson(json: Partial<Location>): Location {
    const location = Object.assign(new Location(), super.fromJson(json));

    location.country = maybeRedacted(json.country);
    location.area = Area.fromJson(json.area || {});

    return location;
  }

  get displayName() {
    return [
      this.country,
      this.area.name,
      this.area.region.name
    ]
      .filter(val => val != null)
      .join(' | ');
  }
}
