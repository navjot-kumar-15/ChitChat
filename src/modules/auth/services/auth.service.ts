import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { constants } from '../../../common/constants/error.constant';
import { BcryptHelper } from '../../../helpers/bcrypt.helper';
import { JwtHelperService } from '../../../helpers/jwt.helper';
import { IUserInterface } from '../../../schemas/User.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private bcryptService: BcryptHelper,
    private jwtService: JwtHelperService,
  ) {}

  async register_user(body: any): Promise<IUserInterface> {
    let { email, password } = body;

    // Hash Pass
    body.password = await this.bcryptService.hash_pass(password);

    let new_user = await this.userService.create_user(body);
    let token = await this.jwtService.generate_token({ id: new_user._id });
    new_user.token = token;
    return new_user;
  }
  async login_user(body: any) {
    const { email, password } = body;
    const is_user = await this.userService.get_user_by_condition({ email });
    if (!is_user) throw new BadRequestException(constants.USER.NOT_FOUND);
    if (
      is_user.password &&
      !(await this.bcryptService.compare_pass(password, is_user?.password))
    )
      throw new BadRequestException(constants.COMMON.PASSWORD_INCORRECT);
    let token = await this.jwtService.generate_token({ id: is_user._id });
    is_user.token = token;
    await is_user.save();
    return is_user;
  }
}
