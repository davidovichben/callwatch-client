import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UnitService } from './unit.service';
import { UserSessionService } from '../state/user-session.service';
import { DataTableCriteria } from '../../components/data-table/classes/data-table-criteria';
import { environment } from 'src/environments/environment';
import { UnitModel } from '../../models/unit.model';

describe('UnitService', () => {
  let service: UnitService;
  let httpMock: HttpTestingController;
  let userSessionServiceMock: jasmine.SpyObj<UserSessionService>;

  beforeEach(() => {
    userSessionServiceMock = jasmine.createSpyObj('UserSessionService', ['getToken']);
    userSessionServiceMock.getToken.and.returnValue('mock-token');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UnitService,
        { provide: UserSessionService, useValue: userSessionServiceMock }
      ]
    });

    service = TestBed.inject(UnitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUnits', () => {
    it('should return all units', async () => {
      const mockUnits: UnitModel[] = [
        { id: '1', name: 'Unit 1', parent: null },
        { id: '2', name: 'Unit 2', parent: '1' }
      ];

      const promise = service.getUnits();

      const req = httpMock.expectOne(`${environment.apiUrl}/unit`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('NoLoader')).toBe('true');
      req.flush(mockUnits);

      const result = await promise;
      expect(result).toEqual(mockUnits);
    });

    it('should filter by unitId if provided', async () => {
      const unitId = '1';
      const mockUnits: UnitModel[] = [
        { id: '2', name: 'Unit 2', parent: '1' },
        { id: '3', name: 'Unit 3', parent: '1' }
      ];

      const promise = service.getUnits(unitId);

      const req = httpMock.expectOne(`${environment.apiUrl}/unit?unitId=${unitId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUnits);

      const result = await promise;
      expect(result).toEqual(mockUnits);
    });

    it('should handle error and return empty array', async () => {
      const promise = service.getUnits();

      const req = httpMock.expectOne(`${environment.apiUrl}/unit`);
      req.error(new ErrorEvent('Network error'));

      const result = await promise;
      expect(result).toEqual([]);
    });
  });

  describe('getUnit', () => {
    it('should return a unit by id', async () => {
      const mockId = '123';
      const mockUnit: UnitModel = { id: mockId, name: 'Test Unit', parent: null };

      const promise = service.getUnit(mockId);

      const req = httpMock.expectOne(`${environment.apiUrl}/unit/${mockId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUnit);

      const result = await promise;
      expect(result).toEqual(mockUnit);
    });

    it('should handle root unit request', async () => {
      const mockUnit: UnitModel = { id: 'root', name: 'Root Unit', parent: null };

      const promise = service.getUnit('root');

      const req = httpMock.expectOne(`${environment.apiUrl}/unit/root`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUnit);

      const result = await promise;
      expect(result).toEqual(mockUnit);
    });

    it('should handle error and return null', async () => {
      const mockId = '123';

      const promise = service.getUnit(mockId);

      const req = httpMock.expectOne(`${environment.apiUrl}/unit/${mockId}`);
      req.error(new ErrorEvent('Network error'));

      const result = await promise;
      expect(result).toBeNull();
    });
  });

  describe('newUnit', () => {
    it('should create a unit', async () => {
      const mockValues = { name: 'New Unit', parent: '1' };
      const mockResponse: UnitModel = { id: '123', name: 'New Unit', parent: '1' };

      const promise = service.newUnit(mockValues);

      const req = httpMock.expectOne(`${environment.apiUrl}/unit`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockValues);
      req.flush(mockResponse);

      const result = await promise;
      expect(result).toEqual(mockResponse);
    });

    it('should handle error and return null', async () => {
      const mockValues = { name: 'New Unit', parent: '1' };

      const promise = service.newUnit(mockValues);

      const req = httpMock.expectOne(`${environment.apiUrl}/unit`);
      req.error(new ErrorEvent('Network error'));

      const result = await promise;
      expect(result).toBeNull();
    });
  });

  describe('updateUnit', () => {
    it('should update a unit', async () => {
      const mockId = '123';
      const mockValues = { name: 'Updated Unit' };
      const mockResponse = { success: true };

      const promise = service.updateUnit(mockId, mockValues);

      const req = httpMock.expectOne(`${environment.apiUrl}/unit/${mockId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockValues);
      expect(req.request.headers.get('NoLoader')).toBe('true');
      req.flush(mockResponse);

      const result = await promise;
      expect(result).toEqual(mockResponse);
    });

    it('should handle error and return false', async () => {
      const mockId = '123';
      const mockValues = { name: 'Updated Unit' };

      const promise = service.updateUnit(mockId, mockValues);

      const req = httpMock.expectOne(`${environment.apiUrl}/unit/${mockId}`);
      req.error(new ErrorEvent('Network error'));

      const result = await promise;
      expect(result).toBe(false);
    });
  });

  describe('deleteUnit', () => {
    it('should delete a unit', async () => {
      const mockId = '123';

      const promise = service.deleteUnit(mockId);

      const req = httpMock.expectOne(`${environment.apiUrl}/unit/${mockId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});

      const result = await promise;
      expect(result).toBe(true);
    });

    it('should include assignedUnitId if provided', async () => {
      const mockId = '123';
      const assignedUnitId = '456';

      const promise = service.deleteUnit(mockId, assignedUnitId);

      const req = httpMock.expectOne(`${environment.apiUrl}/unit/${mockId}?assignedUnitId=${assignedUnitId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});

      const result = await promise;
      expect(result).toBe(true);
    });

    it('should handle error and return false', async () => {
      const mockId = '123';

      const promise = service.deleteUnit(mockId);

      const req = httpMock.expectOne(`${environment.apiUrl}/unit/${mockId}`);
      req.error(new ErrorEvent('Network error'));

      const result = await promise;
      expect(result).toBe(false);
    });
  });

  describe('transferUnit', () => {
    it('should transfer a unit to a new parent', async () => {
      const mockUnit = '123';
      const mockParent = '456';
      const mockResponse = { success: true };

      const promise = service.transferUnit(mockUnit, mockParent);

      const req = httpMock.expectOne(`${environment.apiUrl}/unit/${mockUnit}/transfer`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ parent: mockParent });
      req.flush(mockResponse);

      const result = await promise;
      expect(result).toEqual(mockResponse);
    });

    it('should handle error and return null', async () => {
      const mockUnit = '123';
      const mockParent = '456';

      const promise = service.transferUnit(mockUnit, mockParent);

      const req = httpMock.expectOne(`${environment.apiUrl}/unit/${mockUnit}/transfer`);
      req.error(new ErrorEvent('Network error'));

      const result = await promise;
      expect(result).toBeNull();
    });
  });

  describe('getUnitLevels', () => {
    it('should return unit levels', async () => {
      const mockLevels = [1, 2, 3];

      const promise = service.getUnitLevels();

      const req = httpMock.expectOne(`${environment.apiUrl}/unit/levels`);
      expect(req.request.method).toBe('GET');
      req.flush(mockLevels);

      const result = await promise;
      expect(result).toEqual(mockLevels);
    });

    it('should handle error and return empty array', async () => {
      const promise = service.getUnitLevels();

      const req = httpMock.expectOne(`${environment.apiUrl}/unit/levels`);
      req.error(new ErrorEvent('Network error'));

      const result = await promise;
      expect(result).toEqual([]);
    });
  });
});
