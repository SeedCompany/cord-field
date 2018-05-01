export class Location {
  id: string;
  country: string;
  region: {
    id: string;
    name: string;
  };
  area: {
    id: string;
    name: string;
  };

  static fromJson(json: any): Location {
    const location = new Location();

    location.id = json.id;
    location.country = json.country || '';

    const region = json.region || {};
    location.region = {
      id: region.id,
      name: region.name
    };

    const area = json.area || {};
    location.area = {
      id: area.id,
      name: area.name
    };

    return location;
  }
}
