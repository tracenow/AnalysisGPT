import { hashStr } from '@fastgpt/global/common/string/tools';
import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { authCert } from '@fastgpt/service/support/permission/auth/common';
import { addHours } from 'date-fns';

import { UserModelSchema } from '@fastgpt/global/support/user/type';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await authCert({ req, authRoot: true });

    const user = req.body as UserModelSchema;

    jsonRes(res, {
      data: hashStr(user.password)
    });
  } catch (error) {
    console.log(error);

    jsonRes(res, {
      code: 500,
      error
    });
  }
}
