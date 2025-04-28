import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { KeywordService } from './keyword.service';
import { UserSessionService } from '../state/user-session.service';
import { DataTableCriteria } from '../../components/data-table/classes/data-table-criteria';
import { DataTableResponse } from '../../components/data-table/classes/data-table-response';
import { KeywordModel } from '../../models/keyword.model';
import { environment } from 'src/environments/environment';

describe('KeywordService', () => {
  let service: KeywordService;
  let httpMock: HttpTestingController;
  let userSessionServiceMock: jasmine.SpyObj<UserSessionService>;

  beforeEach(() => {
    userSessionServiceMock = jasmine.createSpyObj('UserSessionService', ['getToken']);
    userSessionServiceMock.getToken.and.returnValue('mock-token');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        KeywordService,
        { provide: UserSessionService, useValue: userSessionServiceMock }
      ]
    });

    service = TestBed.inject(KeywordService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getKeywords', () => {
    it('should return keyword search results', async () => {
      const mockCriteria = new DataTableCriteria();
      mockCriteria.page = 1;
      mockCriteria.sort = { column: 'name', direction: 'asc' };
      mockCriteria.filters = { status: 'active' };
      mockCriteria.keyword = 'test';

      const mockResponse: DataTableResponse = {
        items: [{ id: '1', name: 'Test Keyword' }],
        total: 1,
        lastPage: 1
      };

      const promise = service.getKeywords(mockCriteria);

      const req = httpMock.expectOne(`${environment.apiUrl}/keywords/search`);
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

    it('should handle error', async () => {
      const mockCriteria = new DataTableCriteria();
      
      const promise = service.getKeywords(mockCriteria);
      
      const req = httpMock.expectOne(`${environment.apiUrl}/keywords/search`);
      req.error(new ErrorEvent('Network error'));
      
      const result = await promise;
      expect(result).toBeNull(); // Using null as fallback for search methods
    });
  });

  describe('getKeyword', () => {
    it('should return a keyword by id', async () => {
      const mockId = '123';
      const mockKeyword: KeywordModel = { _id: mockId, name: 'Test Keyword' };
      
      const promise = service.getKeyword(mockId);
      
      const req = httpMock.expectOne(`${environment.apiUrl}/keywords/${mockId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockKeyword);
      
      const result = await promise;
      expect(result).toEqual(mockKeyword);
    });

    it('should handle error', async () => {
      const mockId = '123';
      
      const promise = service.getKeyword(mockId);
      
      const req = httpMock.expectOne(`${environment.apiUrl}/keywords/${mockId}`);
      req.error(new ErrorEvent('Network error'));
      
      const result = await promise;
      expect(result).toBeNull(); // Using default fallback as null for GET
    });
  });

  describe('createKeyword', () => {
    it('should create a keyword and return true on success', async () => {
      const mockValues = { name: 'New Keyword', status: 'active' };
      
      const promise = service.createKeyword(mockValues);
      
      const req = httpMock.expectOne(`${environment.apiUrl}/keywords`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockValues);
      req.flush({});
      
      const result = await promise;
      expect(result).toBe(true);
    });

    it('should return false on error', async () => {
      const mockValues = { name: 'New Keyword', status: 'active' };
      
      const promise = service.createKeyword(mockValues);
      
      const req = httpMock.expectOne(`${environment.apiUrl}/keywords`);
      req.error(new ErrorEvent('Network error'));
      
      const result = await promise;
      expect(result).toBe(false);
    });
  });

  describe('updateKeyword', () => {
    it('should update a keyword and return true on success', async () => {
      const mockId = '123';
      const mockValues = { name: 'Updated Keyword', status: 'inactive' };
      
      const promise = service.updateKeyword(mockId, mockValues);
      
      const req = httpMock.expectOne(`${environment.apiUrl}/keywords/${mockId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockValues);
      req.flush({});
      
      const result = await promise;
      expect(result).toBe(true);
    });

    it('should return false on error', async () => {
      const mockId = '123';
      const mockValues = { name: 'Updated Keyword', status: 'inactive' };
      
      const promise = service.updateKeyword(mockId, mockValues);
      
      const req = httpMock.expectOne(`${environment.apiUrl}/keywords/${mockId}`);
      req.error(new ErrorEvent('Network error'));
      
      const result = await promise;
      expect(result).toBe(false);
    });
  });

  describe('deleteKeyword', () => {
    it('should delete a keyword and return true on success', async () => {
      const mockId = '123';
      
      const promise = service.deleteKeyword(mockId);
      
      const req = httpMock.expectOne(`${environment.apiUrl}/keywords/${mockId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
      
      const result = await promise;
      expect(result).toBe(true);
    });

    it('should return false on error', async () => {
      const mockId = '123';
      
      const promise = service.deleteKeyword(mockId);
      
      const req = httpMock.expectOne(`${environment.apiUrl}/keywords/${mockId}`);
      req.error(new ErrorEvent('Network error'));
      
      const result = await promise;
      expect(result).toBe(false);
    });
  });
});
