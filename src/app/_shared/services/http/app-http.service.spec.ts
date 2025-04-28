import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AppHttpService } from './app-http.service';
import { environment } from 'src/environments/environment';
import { UserModel } from '../../models/user.model';

describe('AppHttpService', () => {
  let service: AppHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppHttpService]
    });

    service = TestBed.inject(AppHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should make a POST request to login endpoint', async () => {
      const mockUsername = 'testuser';
      const mockPassword = 'password123';
      const mockResponse: UserModel = {
        _id: '123',
        username: mockUsername,
        name: 'Test User',
        email: 'test@example.com',
        token: 'mock-token'
      };

      const promise = service.login(mockUsername, mockPassword);

      const req = httpMock.expectOne(`${environment.apiUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username: mockUsername, password: mockPassword });
      expect(req.request.headers.get('noLoader')).toBe('true');
      req.flush(mockResponse);

      const result = await promise;
      expect(result).toEqual(mockResponse);
    });

    it('should return error response on failure', async () => {
      const mockUsername = 'testuser';
      const mockPassword = 'wrong-password';
      const mockErrorResponse = { error: 'Invalid credentials' };

      const promise = service.login(mockUsername, mockPassword);

      const req = httpMock.expectOne(`${environment.apiUrl}/login`);
      req.flush(mockErrorResponse, { status: 401, statusText: 'Unauthorized' });

      const result = await promise;
      expect(result).toEqual(mockErrorResponse);
    });
  });

  describe('logout', () => {
    it('should make a POST request to logout endpoint', async () => {
      const promise = service.logout();

      const req = httpMock.expectOne(`${environment.apiUrl}/logout`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      expect(req.request.headers.get('NoLoader')).toBe('true');
      req.flush({});

      const result = await promise;
      expect(result).toBe(true);
    });

    it('should return false on error', async () => {
      const promise = service.logout();

      const req = httpMock.expectOne(`${environment.apiUrl}/logout`);
      req.error(new ErrorEvent('Network error'));

      const result = await promise;
      expect(result).toBe(false);
    });
  });
  
  describe('forgotPassword', () => {
    it('should make a POST request to forgot password endpoint', async () => {
      const mockUsername = 'testuser';
      const mockResponse = { success: true, message: 'Email sent' };

      const promise = service.forgotPassword(mockUsername);

      const req = httpMock.expectOne(`${environment.apiUrl}/password/forgot`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username: mockUsername });
      expect(req.request.headers.get('NoLoader')).toBe('true');
      req.flush(mockResponse);

      const result = await promise;
      expect(result).toEqual(mockResponse);
    });
  });

  describe('checkResetToken', () => {
    it('should make a POST request to check reset token endpoint', async () => {
      const mockToken = 'reset-token-123';
      const mockResponse = { valid: true, username: 'testuser' };

      const promise = service.checkResetToken(mockToken);

      const req = httpMock.expectOne(`${environment.apiUrl}/password/checkToken`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ token: mockToken });
      expect(req.request.headers.get('NoLoader')).toBe('true');
      req.flush(mockResponse);

      const result = await promise;
      expect(result).toEqual(mockResponse);
    });
  });

  describe('resetPassword', () => {
    it('should make a POST request to reset password endpoint', async () => {
      const mockPassword = 'new-password-123';
      const mockUsername = 'testuser';
      const mockToken = 'reset-token-123';

      const promise = service.resetPassword(mockPassword, mockUsername, mockToken);

      const req = httpMock.expectOne(`${environment.apiUrl}/password/reset`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        password: mockPassword,
        username: mockUsername,
        token: mockToken
      });
      req.flush({});

      const result = await promise;
      expect(result).toBe(true);
    });
  });

  describe('test', () => {
    it('should make a GET request to test endpoint', async () => {
      const promise = service.test();

      const req = httpMock.expectOne(`${environment.apiUrl}/test`);
      expect(req.request.method).toBe('GET');
      req.flush({});

      const result = await promise;
      expect(result).toBe(true);
    });

    it('should return false on error', async () => {
      const promise = service.test();

      const req = httpMock.expectOne(`${environment.apiUrl}/test`);
      req.error(new ErrorEvent('Network error'));

      const result = await promise;
      expect(result).toBe(false);
    });
  });
});
