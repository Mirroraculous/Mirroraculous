import { TestBed } from '@angular/core/testing';

import { EventsService } from './addEvents.service';

describe('EventsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventsService = TestBed.get(EventsService);
    expect(service).toBeTruthy();
  });
});
