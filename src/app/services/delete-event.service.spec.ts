import { TestBed } from '@angular/core/testing';

import { DeleteEventService } from './delete-event.service';

describe('DeleteEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeleteEventService = TestBed.get(DeleteEventService);
    expect(service).toBeTruthy();
  });
});
