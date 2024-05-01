import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { connectToDatabase } from '@/service/mongo';
import { MongoTeam } from '@fastgpt/service/support/user/team/teamSchema';
import { TeamListItemType } from '@fastgpt/global/support/user/team/type';
import { authUserRole } from '@fastgpt/service/support/permission/auth/user';
import { TeamMemberRoleEnum } from '@fastgpt/global/support/user/team/constant';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    await connectToDatabase();
    // // 凭证校验
    // const { teamId, tmbId, teamOwner, role } = await authUserRole({ req, authToken: true });
    //
    // if (!(role == TeamMemberRoleEnum.admin)) {
    //     return jsonRes<TeamListItemType[]>(res, {
    //         data: []
    //     });
    // }

    // 获取所有团队信息
    const myTeams = await MongoTeam.find({}, '_id name').sort({
      updateTime: -1
    });
    return jsonRes<TeamListItemType[]>(res, {
      data: myTeams.map((team) => ({
        _id: team._id,
        name: team.name
      }))
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
