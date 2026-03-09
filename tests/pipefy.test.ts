import { PipefyAPI } from '../src/index';

describe('PipefyAPI', () => {
  let api: PipefyAPI;
  const apiKey = 'test-key';
  const orgId = '123';

  beforeEach(() => {
    api = new PipefyAPI(apiKey, orgId, 'UTC', 'en-US');
  });

  it('should be initialized correctly using positional legacy arguments', () => {
    expect(api).toBeDefined();
    expect(api).toBeInstanceOf(PipefyAPI);
  });

  it('should be initialized correctly using a ServiceAccountConfig object', () => {
    const saApi = new PipefyAPI({
      clientId: 'abc',
      clientSecret: 'def',
      tokenEndpoint: 'https://auth.pipefy.com/oauth/token',
      organizationId: '123',
      timeZone: 'UTC',
      intlCode: 'en-US',
    });
    expect(saApi).toBeDefined();
    expect(saApi).toBeInstanceOf(PipefyAPI);
  });

  describe('getServiceAccountToken', () => {
    it('should successfully fetch a token from the service account endpoint', async () => {
      const clientId = 'client123';
      const clientSecret = 'secret456';
      const tokenEndpoint = 'https://auth.pipefy.com/oauth/token';
      const mockResponse = {
        access_token: 'mock-token',
        expires_in: 3600,
        token_type: 'Bearer',
      };

      const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response),
      );

      const result = await api.getServiceAccountToken(clientId, clientSecret, tokenEndpoint);

      expect(fetchSpy).toHaveBeenCalledWith(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
        }),
      });
      expect(result).toEqual(mockResponse);

      fetchSpy.mockRestore();
    });

    it('should throw an error if the token request fails', async () => {
      jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          ok: false,
          statusText: 'Unauthorized',
        } as Response),
      );

      await expect(api.getServiceAccountToken('id', 'secret', 'url')).rejects.toThrow(
        'Error fetching service account token: Unauthorized',
      );

      (global.fetch as jest.Mock).mockRestore();
    });
  });
});
