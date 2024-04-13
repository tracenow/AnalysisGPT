import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { connectToDatabase } from '@/service/mongo';
import { authCert } from '@fastgpt/service/support/permission/auth/common';
import { addHours } from 'date-fns';

import { MongoUser } from '@fastgpt/service/support/user/schema';
import { UserModelSchema } from '@fastgpt/global/support/user/type';
import {UserTypeEnum} from "@fastgpt/global/support/user/constant";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectToDatabase();
        await authCert({ req, authRoot: true });

        const user = req.body as UserModelSchema;

        if (!(user.userType == UserTypeEnum.app)) {
            throw new Error('参数错误');
        }

        const response = await MongoUser.create(user);

        jsonRes(res, {
            data: response
        });
    } catch (error) {
        console.log(error);

        jsonRes(res, {
            code: 500,
            error
        });
    }
}
