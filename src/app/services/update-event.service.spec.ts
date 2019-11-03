import { TestBed } from '@angular/core/testing';

import { UpdateEventService } from './update-event.service';

describe('UpdateEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpdateEventService = TestBed.get(UpdateEventService);
    expect(service).toBeTruthy();
  });
});
