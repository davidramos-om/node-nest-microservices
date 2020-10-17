import { UserDto } from "src/user/dto/user.dto";
import { UserEntity } from "src/user/entity/user.entity";

export const toUserDto = (data: UserEntity): UserDto =>
{
    const { id, screen_name, email } = data;
  
    let userDto: UserDto = {
        id,
        screen_name,
        email,
    };
  
    return userDto;
};