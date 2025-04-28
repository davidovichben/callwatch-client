import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BaseHttpService, HttpBodyOptions, HttpOptions } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

class MockBaseHttpService extends BaseHttpService {
  // Expose protected methods for testing
  public testGet<T>(endpoint: string, options?: HttpOptions<T>): Promise<T> {
    return this.get<T>(endpoint, options);
  }

  public testPost<T>(endpoint: string, options: HttpBodyOptions<T>): Promise<T> {
    return this.post<T>(endpoint, options);
  }

  public testPut<T>(endpoint: string, options: HttpBodyOptions<T>): Promise<T> {
    return this.put<T>(endpoint, options);
  }

  public testDelete<T>(endpoint: string, options?: HttpOptions<T>): Promise<T> {
    return this.delete<T>(endpoint, options);
  }
}

describe('BaseHttpService', () => {
  let service: MockBaseHttpService;
  let httpMock: HttpTestingController;
  let userSessionServiceMock: jasmine.SpyObj<UserSessionService>;

  beforeEach(() => {
    userSessionServiceMock = jasmine.createSpyObj('UserSessionService', ['getToken']);
    userSessionServiceMock.getToken.and.returnValue('mock-token');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: UserSessionService, useValue: userSessionServiceMock }
      ]
    });

    service = new MockBaseHttpService(userSessionServiceMock, TestBed.inject(HttpClientTestingModule));
    service['http'] = TestBed.inject(HttpClientTestingModule);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('HTTP Methods', () => {
    it('should have correct default fallback values', () => {
      // GET method should have null as default fallback
      const getOptions = service['get'] as any;
      expect(getOptions.fallback).toBeNull();

      // POST method should have false as default fallback
      const postOptions = service['post'] as any;
      expect(postOptions.fallback).toBe(false);

      // PUT method should have false as default fallback
      const putOptions = service['put'] as any;
      expect(putOptions.fallback).toBe(false);

      // DELETE method should have false as default fallback
      const deleteOptions = service['delete'] as any;
      expect(deleteOptions.fallback).toBe(false);
    });

    it('GET should use provided fallback on error', async () => {
      const mockEndpoint = 'api/test';
      const mockFallback = { data: 'fallback' };
      
      const promise = service.testGet<any>(mockEndpoint, {
        fallback: mockFallback
      });
      
      const req = httpMock.expectOne(mockEndpoint);
      expect(req.request.method).toBe('GET');
      req.error(new ErrorEvent('Network error'));
      
      const result = await promise;
      expect(result).toEqual(mockFallback);
    });

    it('POST should use false as default fallback on error', async () => {
      const mockEndpoint = 'api/test';
      const mockBody = { data: 'test' };
      
      const promise = service.testPost<boolean>(mockEndpoint, {
        body: mockBody
      });
      
      const req = httpMock.expectOne(mockEndpoint);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockBody);
      req.error(new ErrorEvent('Network error'));
      
      const result = await promise;
      expect(result).toBe(false);
    });
    
    it('POST to search endpoint should use null as fallback on error', async () => {
      const mockEndpoint = 'api/test/search';
      const mockBody = { sortBy: 'name', sortDir: 'asc', page: 1 };
      
      const promise = service.testPost<any>(mockEndpoint, {
        body: mockBody,
        fallback: null
      });
      
      const req = httpMock.expectOne(mockEndpoint);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockBody);
      req.error(new ErrorEvent('Network error'));
      
      const result = await promise;
      expect(result).toBeNull(); // Using null as fallback for search methods
    });

    it('PUT should use false as default fallback on error', async () => {
      const mockEndpoint = 'api/test';
      const mockBody = { data: 'test' };
      
      const promise = service.testPut<boolean>(mockEndpoint, {
        body: mockBody
      });
      
      const req = httpMock.expectOne(mockEndpoint);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockBody);
      req.error(new ErrorEvent('Network error'));
      
      const result = await promise;
      expect(result).toBe(false);
    });

    it('DELETE should use false as default fallback on error', async () => {
      const mockEndpoint = 'api/test';
      
      const promise = service.testDelete<boolean>(mockEndpoint);
      
      const req = httpMock.expectOne(mockEndpoint);
      expect(req.request.method).toBe('DELETE');
      req.error(new ErrorEvent('Network error'));
      
      const result = await promise;
      expect(result).toBe(false);
    });

    it('should include authorization token in headers', () => {
      service.testGet('api/test');
      
      const req = httpMock.expectOne('api/test');
      expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    });
  });
});
