import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
} from '@simplewebauthn/browser';
import apiClient from './api';

export class PasskeyService {
  private readonly apiBaseUrl: string;

  constructor(baseUrl: string = '/auth') {
    this.apiBaseUrl = baseUrl;
  }

  // 检查浏览器是否支持 WebAuthn
  static isSupported(): boolean {
    return browserSupportsWebAuthn();
  }

  // Passkey 注册流程
  async register(): Promise<boolean> {
    try {
      // 1. 获取注册选项
      const { data: options } = await apiClient.post(
        `${this.apiBaseUrl}/passkey/register/options`,
        {},
        {
          withCredentials: true,
        }
      );

      // 2. 开始设备注册流程
      const regResponse = await startRegistration(options);

      // 3. 发送注册响应到服务器验证
      const { data } = await apiClient.post(
        `${this.apiBaseUrl}/passkey/register/verify`,
        regResponse,
        {
          withCredentials: true,
        }
      );

      const { verified } = data;
      return verified;
    } catch (error) {
      console.error('Passkey registration failed:', error);
      throw error;
    }
  }

  // Passkey 登录流程
  async login(userId: number): Promise<boolean> {
    try {
      // 1. 获取认证选项
      const { data: options } = await apiClient.post(
        `${this.apiBaseUrl}/passkey/login/options`,
        { userId }
      );

      // 2. 开始认证流程
      const authResponse = await startAuthentication({optionsJSON: options});

      // 3. 发送认证响应到服务器验证
      const { data } = await apiClient.post(
        `${this.apiBaseUrl}/passkey/login/verify`,
        {
          userId,
          authenticationResponse: authResponse,
        },
        {
          withCredentials: true,
        }
      );

      return data;
    } catch (error) {
      console.error('Passkey authentication failed:', error);
      throw error;
    }
  }
}
