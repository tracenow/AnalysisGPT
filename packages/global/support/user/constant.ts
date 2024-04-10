export enum UserStatusEnum {
  active = 'active',
  forbidden = 'forbidden'
}
export const userStatusMap = {
  [UserStatusEnum.active]: {
    label: 'support.user.status.active'
  },
  [UserStatusEnum.forbidden]: {
    label: 'support.user.status.forbidden'
  }
};

export enum OAuthEnum {
  github = 'github',
  google = 'google',
  wechat = 'wechat'
}

export enum UserTypeEnum {
  platform = 'platform',
  app = 'app'
}
