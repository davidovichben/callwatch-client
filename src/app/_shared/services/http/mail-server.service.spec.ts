    it('should handle error', async () => {
      const mockCriteria = new DataTableCriteria();
      
      const promise = service.getMailServers(mockCriteria);
      
      const req = httpMock.expectOne(`${environment.apiUrl}/mailServers/search`);
      req.error(new ErrorEvent('Network error'));
      
      const result = await promise;
      expect(result).toBeNull(); // Using null as fallback for search methods
    });
