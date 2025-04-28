import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserService } from './user.service';
import { UserSessionService } from '../state/user-session.service';
import { DataTableCriteria } from '../../components/data-table/classes/data-table-criteria';
import { DataTableResponse } from '../../components/data-table/classes/data-table-response';
import { environment } from 'src/environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let userSessionServiceMock: jasmine.SpyObj<UserSessionService>;

  beforeEach(() => {
    userSessionServiceMock = jasmine.createSpyObj('UserSessionService', ['getToken']);
    userSessionServiceMock.getToken.and.returnValue('mock-token');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: UserSessionService, useValue: userSessionServiceMock }
      ]
    });

    service = TestBed.inject(UserService);
    service['http'] = TestBed.inject(HttpClientTestingModule);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should return user search results', async () => {
      const mockCriteria = new DataTableCriteria();
      mockCriteria.page = 1;
      mockCriteria.sort = { column: 'name', direction: 'asc' };
      mockCriteria.filters = { status: 'active' };

      const mockResponse: DataTableResponse = {
        items: [{ id: '1', name: 'Test User', username: 'testuser' }],
        total: 1,
        lastPage: 1
      };

      const promise = service.getUsers(mockCriteria);

      const req = httpMock.expectOne(`${environment.apiUrl}/user/search`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('NoLoader')).toBe('true');
      req.flush(mockResponse);

      const result = await promise;
      expect(result).toEqual(mockResponse);
    });

    it('should handle error and return null', async () => {
      const mockCriteria = new DataTableCriteria();
      
      const promise = service.getUsers(mockCriteria);
      
      const req = httpMock.expectOne(`${environment.apiUrl}/user/search`);
      req.error(new ErrorEvent('Network error'));
      
      const result = await promise;
      expect(result).toBeNull(); // Using null as fallback for search methods
    });
  });
});
