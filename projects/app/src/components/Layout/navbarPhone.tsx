import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { Flex, Box } from '@chakra-ui/react';
import { useChatStore } from '@/web/core/chat/storeChat';
import { useTranslation } from 'next-i18next';
import Badge from '../Badge';
import MyIcon from '@fastgpt/web/components/common/Icon';
import { useUserStore } from '@/web/support/user/useUserStore';

const NavbarPhone = ({ unread }: { unread: number }) => {
  const router = useRouter();
  const { userInfo } = useUserStore();
  const { t } = useTranslation();
  const { lastChatAppId, lastChatId } = useChatStore();
  const navbarList = useMemo(
    () => [
      {
        label: t('navbar.Chat'),
        icon: 'core/chat/chatLight',
        activeIcon: 'core/chat/chatFill',
        link: `/chat?appId=${lastChatAppId}&chatId=${lastChatId}`,
        activeLink: ['/chat'],
        forbidUserType: ['app'],
        unread: 0
      },
      {
        label: t('navbar.Apps'),
        icon: 'core/app/aiLight',
        activeIcon: 'core/app/aiFill',
        link: `/app/list`,
        activeLink: ['/app/list', '/app/detail'],
        forbidUserType: ['app'],
        unread: 0
      },
      {
        label: t('navbar.Tools'),
        icon: 'phoneTabbar/tool',
        activeIcon: 'phoneTabbar/toolFill',
        link: '/tools',
        activeLink: ['/tools'],
        forbidUserType: ['app'],
        unread: 0
      },
      {
        label: t('navbar.Apps'),
        icon: 'core/app/aiLight',
        activeIcon: 'core/app/aiFill',
        link: `/app/share`,
        activeLink: ['/app/share'],
        forbidUserType: ['platform']
      },
      {
        label: t('navbar.Account'),
        icon: 'support/user/userLight',
        activeIcon: 'support/user/userFill',
        link: '/account',
        activeLink: ['/account'],
        forbidUserType: [],
        unread
      }
    ],
    [t, lastChatAppId, lastChatId, unread]
  );

  return (
    <>
      <Flex
        alignItems={'center'}
        h={'100%'}
        justifyContent={'space-between'}
        backgroundColor={'white'}
        position={'relative'}
        px={10}
      >
        {navbarList
          .filter(
            (item) => userInfo?.userType && !item?.forbidUserType?.includes(userInfo?.userType)
          )
          .map((item) => (
            <Flex
              position={'relative'}
              key={item.link}
              cursor={'pointer'}
              borderRadius={'md'}
              textAlign={'center'}
              alignItems={'center'}
              h={'100%'}
              pt={1}
              px={3}
              transform={'scale(0.9)'}
              {...(item.activeLink.includes(router.pathname)
                ? {
                    color: 'primary.600'
                  }
                : {
                    color: 'myGray.500'
                  })}
              onClick={() => {
                if (item.link === router.asPath) return;
                router.push(item.link);
              }}
            >
              <Badge isDot count={item.unread}>
                <MyIcon
                  name={
                    (item.activeLink.includes(router.pathname) ? item.activeIcon : item.icon) as any
                  }
                  width={'20px'}
                  height={'20px'}
                />
                <Box fontSize={'12px'}>{item.label}</Box>
              </Badge>
            </Flex>
          ))}
      </Flex>
    </>
  );
};

export default NavbarPhone;
