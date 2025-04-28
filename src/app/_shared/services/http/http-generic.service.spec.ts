import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HttpGenericService } from './http-generic.service';
import { UserSessionService } from '../state/user-session.service';
import { DataTableCriteria } from '../../components/data-table/classes/data-table-criteria';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

interface TestModel {
  id: string;
  name: string;
}

class TestGenericService extends HttpGenericService<TestModel> {
  constructor(http: HttpClient, userSession: UserSessionService) {
    super(http, userSession, 'test');
  }
}

describe('HttpGenericService', () => {
  let service: TestGenericService;
  let httpMock: HttpTestingController;
  let userSessionServiceMock: jasmine.SpyObj<UserSessionService>;

  beforeEach(() => {
    userSessionServiceMock = jasmine.createSpyObj('UserSessionService', ['getToken']);
    userSessionServiceMock.getToken.and.returnValue('mock-token');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TestGenericService,
        { provide: UserSessionService, useValue: userSessionServiceMock }
      ]
    });

    service = TestBed.inject(TestGenericService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all items', async () => {
      const mockItems: TestModel[] = [
        { id: '1', name: 'Test 1' },
        { id: '2', name: 'Test 2' }
      ];

      const promise = service.getAll();

      const req = httpMock.expectOne(`${environment.apiUrl}/test`);
      expect(req.request.method).toBe('GET');
      req.flush(mockItems);

      const result = await promise;
      expect(result).toEqual(mockItems);
    });

    it('should handle error and return empty array', async () => {
      const promise = service.getAll();

      const req = httpMock.expectOne(`${environment.apiUrl}/test`);
      req.error(new ErrorEvent('Network error'));

      const result = await promise;
      expect(result).toEqual([]);
    });
  });

  describe('getOne', () => {
    it('should return one item by id', async () => {
      const mockId = '123';
      const mockItem: TestModel = { id: mockId, name: 'Test Item' };

      const promise = service.getOne(mockId);

      const req = httpMock.expectOne(`${environment.apiUrl}/test/${mockId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockItem);

      const result = await promise;
      expect(result).toEqual(mockItem);
    });

    it('should handle error and return null', async () => {
      const mockId = '123';

      const promise = service.getOne(mockId);

      const req = httpMock.expectOne(`${environment.apiUrl}/test/${mockId}`);
      req.error(new ErrorEvent('Network error'));

      const result = await promise;
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create an item', async () => {
      const mockItem = { name: 'New Test' };
      const mockResponse: TestModel = { id: '123', name: 'New Test' };

      const promise = service.create(mockItem);

      const req = httpMock.expectOne(`${environment.apiUrl}/test`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockItem);
      req.flush(mockResponse);

      const result = await promise;
      expect(result).toEqual(mockResponse);
    });

    it('should handle error and return null', async () => {
      const mockItem = { name: 'New Test' };

      const promise = service.create(mockItem);

      const req = httpMock.expectOne(`${environment.apiUrl}/test`);
      req.error(new ErrorEvent('Network error'));

      const result = await promise;
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an item', async () => {
      const mockId = '123';
      const mockItem = { name: 'Updated Test' };
      const mockResponse = { success: true };

      const promise = service.update(mockId, mockItem);

      const req = httpMock.expectOne(`${environment.apiUrl}/test/${mockId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockItem);
      expect(req.request.headers.get('NoLoader')).toBe('true');
      req.flush(mockResponse);

      const result = await promise;
      expect(result).toEqual(mockResponse);
    });

    it('should handle error and return false', async () => {
      const mockId = '123';
      const mockItem = { name: 'Updated Test' };

      const promise = service.update(mockId, mockItem);

      const req = httpMock.expectOne(`${environment.apiUrl}/test/${mockId}`);
      req.error(new ErrorEvent('Network error'));

      const result = await promise;
      expect(result).toBe(false);
    });
  });

  describe('remove', () => {
    it('should delete an item', async () => {
      const mockId = '123';

      const promise = service.remove(mockId);

      const req = httpMock.expectOne(`${environment.apiUrl}/test/${mockId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});

      const result = await promise;
      expect(result).toBe(true);
    });

    it('should handle error and return false', async () => {
      const mockId = '123';

      const promise = service.remove(mockId);

      const req = httpMock.expectOne(`${environment.apiUrl}/test/${mockId}`);
      req.error(new ErrorEvent('Network error'));

      const result = await promise;
      expect(result).toBe(false);
    });
  });

  describe('search', () => {
    it('should search with criteria', async () => {
      const mockCriteria = new DataTableCriteria();
      mockCriteria.page = 1;
      mockCriteria.sort = { column: 'name', direction: 'asc' };
      mockCriteria.filters = { status: 'active' };
      mockCriteria.keyword = 'test';

      const mockResponse = {
        items: [{ id: '1', name: 'Test Item' }],
        total: 1,
        lastPage: 1
      };

      const promise = service.search(mockCriteria);

      const req = httpMock.expectOne(`${environment.apiUrl}/test/search`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        ...mockCriteria.filters,
        sortBy: mockCriteria.sort.column,
        sortDir: mockCriteria.sort.direction,
        page: mockCriteria.page,
        keyword: mockCriteria.keyword,
        isCheckAll: false
      });
      req.flush(mockResponse);

      const result = await promise;
      expect(result).toEqual(mockResponse);
    });

    it('should handle error and return null', async () => {
      const mockCriteria = new DataTableCriteria();

      const promise = service.search(mockCriteria);

      const req = httpMock.expectOne(`${environment.apiUrl}/test/search`);
      req.error(new ErrorEvent('Network error'));

      const result = await promise;
      expect(result).toBeNull();
    });
  });

  describe('exists', () => {
    it('should check if an item exists', async () => {
      const mockValue = 'testname';
      const mockResponse = { exists: true };

      const promise = service.exists(mockValue);

      const req = httpMock.expectOne(req => {
        return req.url === `${environment.apiUrl}/exists` &&
               req.params.get('resource') === 'test' &&
               req.params.get('value') === mockValue;
      });
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('NoLoader')).toBe('true');
      req.flush(mockResponse);

      const result = await promise;
      expect(result).toEqual(mockResponse);
    });

    it('should handle error and return exists: false', async () => {
      const mockValue = 'testname';

      const promise = service.exists(mockValue);

      const req = httpMock.expectOne(req => {
        return req.url === `${environment.apiUrl}/exists` &&
               req.params.get('resource') === 'test' &&
               req.params.get('value') === mockValue;
      });
      req.error(new ErrorEvent('Network error'));

      const result = await promise;
      expect(result).toEqual({ exists: false });
    });
  });
});
