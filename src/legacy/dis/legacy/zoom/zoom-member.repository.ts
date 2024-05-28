import { GenericRepository } from '@/internal/common/repository/generic.repository';
import {
  ZoomMember,
  ZoomMemberDocument,
} from '@/legacy/dis/legacy/zoom/schemas/zoom-member.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CoachesWithMeetingCount } from '@/legacy/dis/legacy/zoom/domain/types';

export class ZoomMemberRepository extends GenericRepository<ZoomMemberDocument> {
  constructor(
    @InjectModel(ZoomMember.name)
    protected readonly model: Model<ZoomMemberDocument>,
  ) {
    super(model);
  }

  async findByEmail(email: string): Promise<ZoomMemberDocument> {
    return this.model.findOne({ hostEmail: email }).exec();
  }

  async listAllCoachesWithMeetingCount() {
    const data = await this.model.aggregate<CoachesWithMeetingCount>([
      {
        $match: {
          zoomAppInstantDelete: false,
        },
      },
      {
        $sort: {
          fullName: 1,
        },
      },
      {
        $lookup: {
          from: 'ds__zoom_recording',
          localField: 'hostEmail',
          foreignField: 'hostEmail',
          as: 'records',
        },
      },
      {
        $lookup: {
          from: 'ds__zoom_phone_users',
          localField: 'hostEmail',
          foreignField: 'email',
          as: 'calls',
        },
      },
      {
        $addFields: {
          meetingCount: { $size: '$records' },
          phoneCalls: { $size: '$calls' },
        },
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
          hostEmail: 1,
          meetingCount: 1,
          phoneCalls: 1,
        },
      },
    ]);

    const buildAvatar = (fullName: string) => {
      return fullName
        .split(' ')
        .map((name) => name[0])
        .join('');
    };

    return data.map((coach) => {
      return <CoachesWithMeetingCount>{
        ...coach,
        avatar: buildAvatar(coach.fullName),
      };
    });
  }
}
