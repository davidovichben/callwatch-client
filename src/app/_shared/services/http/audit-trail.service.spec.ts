import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuditTrailService } from './audit-trail.service';
import { UserSessionService } from '../state/user-session.service';
import { DataTableCriteria } from '../../components/data-table/classes/data-table-criteria';
import { DataTableResponse } from '../../components/data-table/classes/data-table-response';
import { AuditTrailEntryChangeModel } from '../../models/audit-trail-entry-change.model';
import { environment } from 'src/environments/environment';

describe('AuditTrailService', () => {
  let service: AuditTrailService;
  let httpMock: HttpTestingController;
  let userSessionServiceMock: jasmine.SpyObj<UserSessionService>;

  beforeEach(() => {
    userSessionServiceMock = jasmine.createSpyObj('UserSessionService', ['getToken']);
    userSessionServiceMock.getToken.and.returnValue('mock-token');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuditTrailService,
        { provide: UserSessionService, useValue: userSessionServiceMock }
      ]
    });

    service = TestBed.inject(AuditTrailService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLogs', () => {
    it('should return audit trail logs', async () => {
      const mockCriteria = new DataTableCriteria();
      mockCriteria.page = 1;
      mockCriteria.sort = { column: 'created', direction: 'desc' };
      mockCriteria.filters = { resourceType: 'user' };

      const mockResponse: DataTableResponse = {
        items: [
          { id: 1, resourceType: 'user', resourceId: '123', resourceName: 'User creation', created: '2023-01-01T00:00:00Z', ipAddress: '127.0.0.1' }
        ],
        total: 1,
        lastPage: 1
      };

      const promise = service.getLogs(mockCriteria);

      const req = httpMock.expectOne(`${environment.apiUrl}/auditTrail/search`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        ...mockCriteria.filters,
        sortBy: mockCriteria.sort.column,
        sortDir: mockCriteria.sort.direction,
        page: mockCriteria.page,
        keyword: '',
        isCheckAll: false
      });
      req.flush(mockResponse);

      const result = await promise;
      expect(result).toEqual(mockResponse);
    });

    it('should handle error and return fallback value', async () => {
      const mockCriteria = new DataTableCriteria();
      
      const promise = service.getLogs(mockCriteria);
      
      const req = httpMock.expectOne(`${environment.apiUrl}/auditTrail/search`);
      req.error(new ErrorEvent('Network error'));
      
      const result = await promise;
      expect(result).toBeNull(); // Using null as fallback for search methods
    });
  });

  describe('getChanges', () => {
    it('should return entry changes for a given entry ID', async () => {
      const mockEntryId = 123;
      const mockChanges: AuditTrailEntryChangeModel[] = [
        { attribute: 'name', oldValue: 'Old Name', newValue: 'New Name' },
        { attribute: 'email', oldValue: 'old@example.com', newValue: 'new@example.com' }
      ];
      
      const promise = service.getChanges(mockEntryId);
      
      const req = httpMock.expectOne(`${environment.apiUrl}/auditTrail/${mockEntryId}/changes`);
      expect(req.request.method).toBe('GET');
      req.flush(mockChanges);
      
      const result = await promise;
      expect(result).toEqual(mockChanges);
    });

    it('should handle error and return null', async () => {
      const mockEntryId = 123;
      
      const promise = service.getChanges(mockEntryId);
      
      const req = httpMock.expectOne(`${environment.apiUrl}/auditTrail/${mockEntryId}/changes`);
      req.error(new ErrorEvent('Network error'));
      
      const result = await promise;
      expect(result).toBeNull(); // Default fallback value for GET
    });
  });
});
