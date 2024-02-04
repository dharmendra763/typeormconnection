import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signin(email: string, password: string) {
    const badEmailPasswordCombination = "Bad Email and Password combination";
    const [user] = await this.userService.find(email)

    if(!user) {
        throw new NotFoundException("User not found");
    }

    const [salt, storedHash]  = user.password.split(".");

    const isSamePassword = await this.isHashAndPasswordSame(storedHash, salt, password)

    if(!isSamePassword) {
        return new BadRequestException(badEmailPasswordCombination);
    }
    return user;
  }

  async signup(email: string, password: string) {
    // see if email is in use
    const users = await this.userService.find(email);
    if (users.length > 0) {
      throw new BadRequestException('Email already in use');
    }
    // hash the user password
    const result = await this.encryptPassword(password);
    // create a new user and save it
    const user = await this.userService.create(email, result);
    // return the user
    return user;
  }

  async encryptPassword(password: string): Promise<string> {
    // generate a random salt
    const salt = randomBytes(8).toString('hex');
    //  hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // join the hashed result and the salt together
    return salt + '.' + hash.toString('hex');
  }

  async isHashAndPasswordSame(storedHash: string, salt: string, password: string): Promise<boolean> {
    //  hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // join the hashed result and the salt together
    return storedHash === hash.toString("hex");
  }
}
