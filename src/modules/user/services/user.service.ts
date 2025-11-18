import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../../../schemas';
import { IUserInterface } from '../../../schemas/User.schema';
import { constants } from '../../../common/constants/error.constant';
import { MongooseHelper } from '../../../helpers/mongoose.helper';

@Injectable()
export class UserService {
  constructor(private readonly mongooseHelper: MongooseHelper) {}

  async get_users(
    query: any,
  ): Promise<{ data: IUserInterface; total: number; pages: number }> {
    let { user_id, email, phone_number, sort, page, limit } = query;
    let filters: Record<string, any> = { is_deleted: { $ne: true } };
    if (user_id) {
      filters._id = this.mongooseHelper.convert_to_object_id(user_id);
    }
    if (email) {
      filters.email = email;
    }
    if (phone_number) {
      filters.phone_number = phone_number;
    }

    let sort_query: Record<string, any> = {};
    if (sort) {
      sort_query.createdAt = sort;
    } else {
      sort_query.createdAt = -1;
    }

    let pipeline: any = [
      {
        $match: filters,
      },
    ];

    pipeline.push({
      $facet: {
        users: [
          { $sort: sort_query },
          ...(page && limit
            ? [{ $skip: (+page - 1) * limit }, { $limit: limit }]
            : []),

          { $project: { password: 0, __v: 0 } },
        ],
        totalCount: [{ $count: 'total' }],
      },
    });

    const result = await User.aggregate(pipeline).exec();

    const users = result[0]?.users || [];
    const total = result[0]?.totalCount[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);
    return {
      data: users,
      total,
      pages: totalPages,
    };
  }

  async get_user_details(user_id: any): Promise<IUserInterface | null> {
    let is_user = await this.get_user_by_id_or_throw_error(user_id);
    if (!is_user) throw new BadRequestException(constants.USER.NOT_FOUND);
    return is_user;
  }

  async get_user_by_condition(
    condition: any,
    select: string = '',
  ): Promise<IUserInterface[] | Boolean> {
    let is_user = await User.find(condition).select(select);
    if (!is_user) return false;
    return is_user;
  }

  async get_user_by_id_or_throw_error(id: string): Promise<IUserInterface> {
    let is_user = await User.findById(id);
    if (!is_user) throw new BadRequestException(constants.USER.NOT_FOUND);
    return is_user;
  }

  async create_user(body: any) {
    const { email, username } = body;
    const is_user = await this.get_user_by_condition({ email });
    if (!is_user) throw new BadRequestException('User already exists');
    let new_user = await User.create(body);
    return new_user;
  }
  async update_user(user_id: string, body: any) {
    let is_user = await this.get_user_by_id_or_throw_error(user_id);
    let updated_user = await User.findByIdAndUpdate(user_id, body, {
      new: true,
    });
    return updated_user;
  }

  async delete_user(user_id: string): Promise<IUserInterface> {
    const is_user = await this.get_user_by_id_or_throw_error(user_id);
    is_user.is_deleted = true;
    await is_user.save();
    return is_user;
  }
}
