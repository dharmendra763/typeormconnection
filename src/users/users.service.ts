import { HttpException, HttpStatus, Injectable,  } from '@nestjs/common';
import {Repository} from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    /**
     * 
     * @param repo type orm repository
     */
    constructor(
        @InjectRepository(User) private userRepo : Repository<User>
    ){}

    create(email: string, password: string) {
        const user = this.userRepo.create({email, password});
        return this.userRepo.save(user);
    }

    async findOne(id: number){
        if (!id) {
            return null;
        }
        const user = await this.userRepo.findOneBy({id})
        if(!user) {
            throw new HttpException('Forbidden', HttpStatus.NOT_FOUND);  
        }
        return user;
    }

    find(email: string){
        return this.userRepo.findBy({email});
    }

    update(id: number, user: CreateUserDto){
        this.userRepo.findOneBy({id});
        
    }

    async remove(id: number){
        const user = await this.findOne(id);

        return this.userRepo.remove([user]);
    }
}
