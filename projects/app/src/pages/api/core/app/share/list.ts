import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { connectToDatabase } from '@/service/mongo';
import { MongoApp } from '@fastgpt/service/core/app/schema';
import { MongoOutLink } from '@fastgpt/service/support/outLink/schema';
import { AppListItemType } from '@fastgpt/global/core/app/type';
import { authUserRole } from '@fastgpt/service/support/permission/auth/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    await connectToDatabase();
    // 凭证校验
    const { teamId, tmbId, teamOwner, role } = await authUserRole({ req, authToken: true });

    // 根据teamId获取被分享的应用
    const myOutLinks = await MongoOutLink.find(
      { 'limit.shareTeam': teamId, type: 'share' },
      '_id appId shareId'
    );
    let shareAppDict: Map<string, string> = new Map();
    let shareApps: Array<string> = new Array();
    myOutLinks.forEach((item) => {
      shareAppDict.set(item.appId.toString(), item.shareId.toString());
      shareApps.push(item.appId.toString());
    });

    // 根据 userId 获取模型信息
    const myApps = await MongoApp.find(
      { _id: { $in: shareApps } },
      '_id avatar name intro tmbId permission'
    ).sort({
      updateTime: -1
    });

    const queryResult = myApps.map((app) => ({
      _id: app._id,
      shareId: shareAppDict.get(String(app._id)),
      avatar: app.avatar,
      name: app.name,
      intro: app.intro,
      isOwner: teamOwner || String(app.tmbId) === tmbId,
      permission: app.permission
    }));

    console.log('queryResult : ' + JSON.stringify(queryResult));

    jsonRes<AppListItemType[]>(res, {
      data: queryResult
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
